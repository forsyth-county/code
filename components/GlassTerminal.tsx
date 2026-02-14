import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface GlassTerminalProps {
  pyodide: any;
  isReady: boolean;
  codeToExecute?: string;
  onCodeExecuted?: () => void;
}

export default function GlassTerminal({ pyodide, isReady, codeToExecute, onCodeExecuted }: GlassTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentLine, setCurrentLine] = useState('');
  const cursorPos = useRef(0);
  const inputResolverRef = useRef<((value: string) => void) | null>(null);
  const isWaitingForInputRef = useRef(false);
  const multilineBufferRef = useRef<string[]>([]);
  const isMultilineRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !terminalRef.current) return;

    let terminal: any;
    let fitAddon: any;

    const initTerminal = async () => {
      try {
        // Dynamically import xterm
        const { Terminal } = await import('@xterm/xterm');
        const { FitAddon } = await import('@xterm/addon-fit');

        terminal = new Terminal({
          cursorBlink: true,
          cursorStyle: 'block',
          fontFamily: '"JetBrains Mono", "Courier New", monospace',
          fontSize: 14,
          theme: {
            background: '#000000',
            foreground: '#ffffff',
            cursor: '#00ffff',
            black: '#000000',
            red: '#ff5555',
            green: '#50fa7b',
            yellow: '#f1fa8c',
            blue: '#6272a4',
            magenta: '#ff79c6',
            cyan: '#00ffff',
            white: '#f8f8f2',
            brightBlack: '#6272a4',
            brightRed: '#ff6e6e',
            brightGreen: '#69ff94',
            brightYellow: '#ffffa5',
            brightBlue: '#d6acff',
            brightMagenta: '#ff92df',
            brightCyan: '#a4ffff',
            brightWhite: '#ffffff',
          },
          allowProposedApi: true,
        });

        fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(terminalRef.current!);
        fitAddon.fit();

        xtermRef.current = terminal;
        fitAddonRef.current = fitAddon;

        // Welcome message
        terminal.writeln('\x1b[36m╔════════════════════════════════════════════════════════╗\x1b[0m');
        terminal.writeln('\x1b[36m║\x1b[0m  \x1b[1;35mWelcome to CodeForsyth REPL\x1b[0m                           \x1b[36m║\x1b[0m');
        terminal.writeln('\x1b[36m║\x1b[0m  \x1b[33mPython 3.11 | Pyodide Environment\x1b[0m                    \x1b[36m║\x1b[0m');
        terminal.writeln('\x1b[36m║\x1b[0m  \x1b[32mSupports interactive input() and multi-line code\x1b[0m      \x1b[36m║\x1b[0m');
        terminal.writeln('\x1b[36m╚════════════════════════════════════════════════════════╝\x1b[0m');
        terminal.writeln('');
        
        if (!isReady) {
          terminal.writeln('\x1b[33mPython environment is loading...\x1b[0m');
          terminal.writeln('');
        }

        writePrompt(terminal);

        // Handle keyboard input
        terminal.onData((data: string) => {
          handleTerminalInput(terminal, data);
        });

        // Handle window resize
        const handleResize = () => {
          if (fitAddon) fitAddon.fit();
        };
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          terminal.dispose();
        };
      } catch (error) {
        console.error('Failed to initialize terminal:', error);
      }
    };

    initTerminal();
  }, []);

  // Update prompt when Pyodide becomes ready and set up custom input function
  useEffect(() => {
    if (xtermRef.current && isReady && pyodide) {
      xtermRef.current.writeln('\x1b[32mPython environment ready!\x1b[0m');
      xtermRef.current.writeln('');
      
      // Set up custom input function in Python
      setupCustomInput();
    }
  }, [isReady, pyodide]);

  const setupCustomInput = async () => {
    if (!pyodide) return;
    
    // Create a JavaScript function that can be called from Python
    pyodide.globals.set('js_input', async (prompt: string) => {
      return await waitForUserInput(prompt || '');
    });
    
    // Set up Python environment with proper input support
    await pyodide.runPythonAsync(`
import builtins
import sys
from io import StringIO

# Save original stdout/stderr once at initialization
if not hasattr(sys, '_codeforsyth_original_stdout'):
    sys._codeforsyth_original_stdout = sys.stdout
    sys._codeforsyth_original_stderr = sys.stderr

# Create a synchronous-looking input that works with top-level await
def custom_input(prompt=''):
    """Custom input function that works in the browser with top-level await"""
    from js import js_input
    import asyncio
    # This works because Pyodide's runPythonAsync allows top-level await
    loop = asyncio.get_event_loop()
    if loop.is_running():
        # We're in an async context, we can await
        return loop.run_until_complete(js_input(str(prompt)))
    else:
        # Fallback for sync contexts
        return asyncio.run(js_input(str(prompt)))

# Replace the built-in input with our custom version
builtins.input = custom_input
`);
  };

  const waitForUserInput = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      if (!xtermRef.current) {
        resolve('');
        return;
      }
      
      // Guard against concurrent input requests
      if (isWaitingForInputRef.current) {
        console.warn('Already waiting for input, rejecting concurrent request');
        resolve('');
        return;
      }
      
      const term = xtermRef.current;
      
      // Display the prompt
      if (prompt) {
        term.write(prompt);
      }
      
      // Set up input waiting state
      isWaitingForInputRef.current = true;
      inputResolverRef.current = resolve;
    });
  };

  // Execute code when codeToExecute changes
  useEffect(() => {
    if (codeToExecute && xtermRef.current && isReady && pyodide) {
      const executeExternalCode = async () => {
        xtermRef.current.writeln('\x1b[36m# Code from editor:\x1b[0m');
        const lines = codeToExecute.split('\n');
        lines.forEach(line => {
          xtermRef.current.writeln('\x1b[36m>>> \x1b[0m' + line);
        });
        await executeCommand(xtermRef.current, codeToExecute);
        writePrompt(xtermRef.current);
        if (onCodeExecuted) {
          onCodeExecuted();
        }
      };
      executeExternalCode();
    }
  }, [codeToExecute, isReady, pyodide, onCodeExecuted]);

  const writePrompt = (term: any, isContinuation = false) => {
    if (isContinuation) {
      term.write('\x1b[36m... \x1b[0m');
    } else {
      term.write('\x1b[36m>>> \x1b[0m');
    }
    cursorPos.current = 0;
  };

  const isIncompleteStatement = (code: string): boolean => {
    // Check if the statement needs continuation
    const trimmed = code.trim();
    
    // Empty line is complete
    if (!trimmed) return false;
    
    // Check for line continuation character (backslash at end)
    if (trimmed.endsWith('\\')) return true;
    
    // Check for colon at end (if/for/while/def/class/try/except/with)
    if (trimmed.endsWith(':')) return true;
    
    // Keywords that require continuation
    const continationKeywords = ['elif', 'else', 'except', 'finally'];
    if (continationKeywords.includes(trimmed)) return true;
    
    // Check for unclosed parentheses, brackets, or braces
    let parenCount = 0;
    let bracketCount = 0;
    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    let inTripleQuote = false;
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const prevChar = i > 0 ? code[i - 1] : '';
      const nextChar = i < code.length - 1 ? code[i + 1] : '';
      const next2Char = i < code.length - 2 ? code[i + 2] : '';
      
      // Handle triple-quoted strings
      if (!inString && (char === '"' || char === "'") && nextChar === char && next2Char === char) {
        inTripleQuote = !inTripleQuote;
        stringChar = char;
        i += 2; // Skip next two chars
        continue;
      }
      
      // Skip if we're in a triple-quoted string
      if (inTripleQuote) continue;
      
      // Handle regular strings
      if ((char === '"' || char === "'") && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      }
      
      if (!inString) {
        if (char === '(') parenCount++;
        else if (char === ')') parenCount--;
        else if (char === '[') bracketCount++;
        else if (char === ']') bracketCount--;
        else if (char === '{') braceCount++;
        else if (char === '}') braceCount--;
      }
    }
    
    return parenCount > 0 || bracketCount > 0 || braceCount > 0 || inString || inTripleQuote;
  };

  const handleTerminalInput = async (term: any, data: string) => {
    const code = data.charCodeAt(0);

    // If waiting for input(), handle it differently
    if (isWaitingForInputRef.current) {
      if (code === 13) {
        // Enter - submit the input
        term.writeln('');
        const inputValue = currentLine;
        setCurrentLine('');
        cursorPos.current = 0;
        
        // Resolve the input promise
        if (inputResolverRef.current) {
          inputResolverRef.current(inputValue);
          inputResolverRef.current = null;
        }
        isWaitingForInputRef.current = false;
      } else if (code === 127) {
        // Backspace
        if (cursorPos.current > 0) {
          const newLine = currentLine.slice(0, -1);
          setCurrentLine(newLine);
          cursorPos.current--;
          term.write('\b \b');
        }
      } else if (code >= 32) {
        // Printable characters
        const newLine = currentLine + data;
        setCurrentLine(newLine);
        cursorPos.current++;
        term.write(data);
      }
      return;
    }

    // Normal REPL input handling
    if (code === 13) {
      // Enter
      term.writeln('');
      const line = currentLine;
      
      // Add to multiline buffer if in multiline mode
      if (isMultilineRef.current) {
        multilineBufferRef.current.push(line);
        
        // Check if this is an empty line (end of multiline)
        if (line.trim() === '') {
          const fullCommand = multilineBufferRef.current.slice(0, -1).join('\n');
          multilineBufferRef.current = [];
          isMultilineRef.current = false;
          
          if (fullCommand.trim()) {
            if (isReady && pyodide) {
              await executeCommand(term, fullCommand);
              setHistory(prev => [...prev, fullCommand]);
              setHistoryIndex(-1);
            } else {
              term.writeln('\x1b[31mPython environment not ready yet\x1b[0m');
            }
          }
          
          setCurrentLine('');
          writePrompt(term, false);
        } else {
          // Continue multiline
          setCurrentLine('');
          writePrompt(term, true);
        }
      } else {
        // Single line or start of multiline
        if (line.trim() === '') {
          // Empty line
          setCurrentLine('');
          writePrompt(term, false);
        } else if (isIncompleteStatement(line)) {
          // Start multiline mode
          multilineBufferRef.current = [line];
          isMultilineRef.current = true;
          setCurrentLine('');
          writePrompt(term, true);
        } else {
          // Complete statement, execute it
          if (isReady && pyodide) {
            await executeCommand(term, line);
            setHistory(prev => [...prev, line]);
            setHistoryIndex(-1);
          } else {
            term.writeln('\x1b[31mPython environment not ready yet\x1b[0m');
          }
          
          setCurrentLine('');
          writePrompt(term, false);
        }
      }
    } else if (code === 127) {
      // Backspace
      if (cursorPos.current > 0) {
        const newLine = currentLine.slice(0, -1);
        setCurrentLine(newLine);
        cursorPos.current--;
        term.write('\b \b');
      }
    } else if (code === 27) {
      // Escape sequences (arrow keys, etc.)
      // Handle arrow up/down for history
      if (data === '\x1b[A') {
        // Up arrow
        if (history.length > 0 && historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          const historyCommand = history[history.length - 1 - newIndex];
          clearCurrentLine(term);
          term.write(historyCommand);
          setCurrentLine(historyCommand);
          setHistoryIndex(newIndex);
          cursorPos.current = historyCommand.length;
        }
      } else if (data === '\x1b[B') {
        // Down arrow
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          const historyCommand = history[history.length - 1 - newIndex];
          clearCurrentLine(term);
          term.write(historyCommand);
          setCurrentLine(historyCommand);
          setHistoryIndex(newIndex);
          cursorPos.current = historyCommand.length;
        } else if (historyIndex === 0) {
          clearCurrentLine(term);
          setCurrentLine('');
          setHistoryIndex(-1);
          cursorPos.current = 0;
        }
      }
    } else if (code >= 32) {
      // Printable characters
      const newLine = currentLine + data;
      setCurrentLine(newLine);
      cursorPos.current++;
      term.write(data);
    }
  };

  const clearCurrentLine = (term: any) => {
    // Move cursor to start of input and clear
    for (let i = 0; i < cursorPos.current; i++) {
      term.write('\b \b');
    }
  };

  const executeCommand = async (term: any, command: string) => {
    try {
      // Set up stdout/stderr capture using the saved originals
      await pyodide.runPythonAsync(`
import sys
from io import StringIO
_stdout = StringIO()
_stderr = StringIO()
sys.stdout = _stdout
sys.stderr = _stderr
`);

      // Execute the command
      let result;
      try {
        // Use runPythonAsync which handles await properly in top-level code
        result = await pyodide.runPythonAsync(command);
      } catch (error: any) {
        // Execution error - get and display stderr
        const stderr = await pyodide.runPythonAsync('_stderr.getvalue()');
        
        // Restore stdout/stderr before displaying error
        await pyodide.runPythonAsync(`
sys.stdout = sys._codeforsyth_original_stdout
sys.stderr = sys._codeforsyth_original_stderr
`);
        
        if (stderr) {
          term.writeln('\x1b[31m' + stderr + '\x1b[0m');
        } else {
          term.writeln('\x1b[31mError: ' + error.message + '\x1b[0m');
        }
        return;
      }

      // Get captured output
      const stdout = await pyodide.runPythonAsync('_stdout.getvalue()');
      const stderr = await pyodide.runPythonAsync('_stderr.getvalue()');

      // Restore stdout/stderr
      await pyodide.runPythonAsync(`
sys.stdout = sys._codeforsyth_original_stdout
sys.stderr = sys._codeforsyth_original_stderr
`);

      // Display output
      if (stdout) {
        term.writeln(stdout);
      }
      if (stderr) {
        term.writeln('\x1b[31m' + stderr + '\x1b[0m');
      }
      
      // Display result if not None and no stdout
      // Pyodide converts Python None to undefined, and meaningful results to actual values
      if (result !== undefined && !stdout && String(result) !== 'undefined') {
        term.writeln('\x1b[33m' + String(result) + '\x1b[0m');
      }
    } catch (error: any) {
      term.writeln('\x1b[31mError: ' + error.message + '\x1b[0m');
      // Try to restore stdout/stderr even on error
      try {
        await pyodide.runPythonAsync(`
sys.stdout = sys._codeforsyth_original_stdout
sys.stderr = sys._codeforsyth_original_stderr
`);
      } catch (e) {
        // Ignore restoration errors
      }
    }
  };

  const clearTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
      xtermRef.current.writeln('\x1b[36m╔════════════════════════════════════════════════════════╗\x1b[0m');
      xtermRef.current.writeln('\x1b[36m║\x1b[0m  \x1b[1;35mCodeForsyth REPL\x1b[0m                                    \x1b[36m║\x1b[0m');
      xtermRef.current.writeln('\x1b[36m╚════════════════════════════════════════════════════════╝\x1b[0m');
      xtermRef.current.writeln('');
      writePrompt(xtermRef.current);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-2xl overflow-hidden flex flex-col"
      style={{
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.1)',
        border: '1px solid rgba(0, 255, 255, 0.2)',
      }}
    >
      <div className="px-4 py-2 border-b border-cyan-500/20 flex items-center justify-between bg-black/60">
        <span className="text-sm font-semibold text-cyan-400">Live Python Console (REPL)</span>
        <button
          onClick={clearTerminal}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          title="Clear Console"
        >
          <Trash2 size={16} className="text-cyan-400" />
        </button>
      </div>
      <div 
        ref={terminalRef} 
        className="flex-1 p-2 bg-black/80"
        style={{ minHeight: '300px', maxHeight: '400px' }}
      />
    </motion.div>
  );
}
