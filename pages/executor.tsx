import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import GlassHeader from '@/components/GlassHeader';
import GlowingButton from '@/components/GlowingButton';
import { Play, Download, Share2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getRandomChallenge, getChallengeById } from '@/data/challenges';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

declare global {
  interface Window {
    loadPyodide: any;
    pyodide: any;
  }
}

export default function Executor() {
  const router = useRouter();
  const [code, setCode] = useState('# Write your Python code here\nprint("Hello, Code Forsyth!")');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [isLoadingPyodide, setIsLoadingPyodide] = useState(true);
  const pyodideRef = useRef<any>(null);

  // Load Pyodide
  useEffect(() => {
    const loadPyodideScript = async () => {
      if (typeof window === 'undefined') return;

      // Add Pyodide script if not already added
      if (!document.getElementById('pyodide-script')) {
        const script = document.createElement('script');
        script.id = 'pyodide-script';
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        script.async = true;
        document.head.appendChild(script);

        script.onload = async () => {
          try {
            const pyodide = await window.loadPyodide({
              indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
            });
            pyodideRef.current = pyodide;
            setPyodideReady(true);
            setIsLoadingPyodide(false);
            toast.success('Python environment loaded!');
          } catch (error) {
            console.error('Failed to load Pyodide:', error);
            toast.error('Failed to load Python environment');
            setIsLoadingPyodide(false);
          }
        };

        script.onerror = () => {
          toast.error('Failed to load Pyodide script');
          setIsLoadingPyodide(false);
        };
      } else if (pyodideRef.current) {
        setPyodideReady(true);
        setIsLoadingPyodide(false);
      }
    };

    loadPyodideScript();
  }, []);

  // Handle random challenge from URL
  useEffect(() => {
    if (router.query.random === 'true') {
      const challenge = getRandomChallenge();
      setCode(challenge.code);
      toast.success(`Random challenge: ${challenge.title}`, {
        description: challenge.description,
      });
    } else if (router.query.challenge) {
      const challengeId = parseInt(router.query.challenge as string);
      const challenge = getChallengeById(challengeId);
      if (challenge) {
        setCode(challenge.code);
        toast.info(`Challenge: ${challenge.title}`);
      }
    }
  }, [router.query]);

  const runCode = async () => {
    if (!pyodideReady || !pyodideRef.current) {
      toast.error('Python environment not ready yet');
      return;
    }

    setIsRunning(true);
    setOutput('Running...\n');

    try {
      // Redirect stdout
      await pyodideRef.current.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);

      // Run user code
      await pyodideRef.current.runPythonAsync(code);

      // Get output
      const stdout = await pyodideRef.current.runPythonAsync('sys.stdout.getvalue()');
      setOutput(stdout || '(No output)');
      toast.success('Code executed successfully!');
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error';
      setOutput(`Error:\n${errorMessage}`);
      toast.error('Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  const shareCode = () => {
    const encoded = btoa(code);
    const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    navigator.clipboard.writeText(url);
    toast.success('Code link copied to clipboard!');
  };

  const resetCode = () => {
    setCode('# Write your Python code here\nprint("Hello, Code Forsyth!")');
    setOutput('');
    toast.info('Code reset');
  };

  return (
    <>
      <Head>
        <title>Python Executor - Code Forsyth</title>
      </Head>

      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Grid Background */}
        <div className="fixed inset-0 grid-background" />
        <div className="fixed inset-0 cosmic-glow pointer-events-none" />
        <div className={cn(
          "pointer-events-none fixed inset-0",
          "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        )} />

        <GlassHeader />

        {/* Loading Overlay */}
        {isLoadingPyodide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gradient mb-2">Loading Python Environment...</h2>
              <p className="text-purple-200/70">This may take a moment (~30MB download)</p>
            </div>
          </div>
        )}

        <main className="relative z-10 pt-24 pb-8 px-4 h-screen">
          <div className="h-full max-w-7xl mx-auto">
            {/* Action Bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4 mb-4 flex flex-wrap gap-3 items-center justify-between"
            >
              <h1 className="text-xl font-bold text-gradient">Python Executor</h1>
              <div className="flex gap-3">
                <button
                  onClick={resetCode}
                  className="glass glass-hover px-4 py-2 rounded-full flex items-center gap-2"
                  title="Reset Code"
                >
                  <RotateCcw size={18} />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                <button
                  onClick={shareCode}
                  className="glass glass-hover px-4 py-2 rounded-full flex items-center gap-2"
                  title="Share Code"
                >
                  <Share2 size={18} />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <GlowingButton
                  onClick={runCode}
                  icon={Play}
                  variant="cyan"
                  size="sm"
                  className={isRunning ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {isRunning ? 'Running...' : 'Run Code'}
                </GlowingButton>
              </div>
            </motion.div>

            {/* Editor and Output */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100%-120px)]"
            >
              {/* Editor Panel */}
              <div className="glass rounded-2xl overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                  <span className="text-sm font-semibold text-cyan-400">Code Editor</span>
                  <span className="text-xs text-purple-300/60">Python 3.11</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <MonacoEditor
                    height="100%"
                    defaultLanguage="python"
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: true,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 10, bottom: 10 },
                    }}
                  />
                </div>
              </div>

              {/* Output Panel */}
              <div className="glass rounded-2xl overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-white/10">
                  <span className="text-sm font-semibold text-purple-400">Output</span>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap">
                    {output || 'Output will appear here...'}
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
