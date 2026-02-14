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
        terminal.writeln('\x1b[36m║\x1b[0m  \x1b[32mType code and press Enter to execute\x1b[0m                  \x1b[36m║\x1b[0m');
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

  // Update prompt when Pyodide becomes ready
  useEffect(() => {
    if (xtermRef.current && isReady) {
      xtermRef.current.writeln('\x1b[32mPython environment ready!\x1b[0m');
      xtermRef.current.writeln('');
    }
  }, [isReady]);

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

  const writePrompt = (term: any) => {
    term.write('\x1b[36m>>> \x1b[0m');
    cursorPos.current = 0;
  };

  const handleTerminalInput = async (term: any, data: string) => {
    const code = data.charCodeAt(0);

    // Handle special keys
    if (code === 13) {
      // Enter
      term.writeln('');
      const command = currentLine.trim();
      
      if (command) {
        if (isReady && pyodide) {
          await executeCommand(term, command);
          setHistory(prev => [...prev, command]);
          setHistoryIndex(-1);
        } else {
          term.writeln('\x1b[31mPython environment not ready yet\x1b[0m');
        }
      }
      
      setCurrentLine('');
      writePrompt(term);
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
      // Set up stdout/stderr capture
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
        result = await pyodide.runPythonAsync(command);
      } catch (error: any) {
        // Execution error
        const stderr = await pyodide.runPythonAsync('_stderr.getvalue()');
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

      // Display output
      if (stdout) {
        term.writeln(stdout);
      }
      if (stderr) {
        term.writeln('\x1b[31m' + stderr + '\x1b[0m');
      }
      
      // Display result if not None and no stdout
      if (result !== undefined && result !== null && !stdout) {
        term.writeln('\x1b[33m' + String(result) + '\x1b[0m');
      }
    } catch (error: any) {
      term.writeln('\x1b[31mError: ' + error.message + '\x1b[0m');
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
