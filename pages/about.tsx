import React from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import GlassHeader from '@/components/GlassHeader';
import { cn } from '@/lib/utils';
import { Github, Code2, Sparkles, Zap } from 'lucide-react';

export default function About() {
  return (
    <>
      <Head>
        <title>About - Code Forsyth</title>
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

        <main className="relative z-10 pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-black text-gradient mb-4">
                About Code Forsyth
              </h1>
              <p className="text-lg text-purple-200/80 max-w-2xl mx-auto">
                The most beautiful in-browser Python coding platform
              </p>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Mission */}
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gradient mb-4">Our Mission</h2>
                <p className="text-purple-200/80 leading-relaxed">
                  Code Forsyth is designed to make learning and practicing Python addictive and fun. 
                  We believe coding should be beautiful, accessible, and enjoyable. Our platform 
                  combines cutting-edge web technologies with a stunning user interface to create 
                  an experience that makes you actually want to code.
                </p>
              </div>

              {/* Tech Stack */}
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gradient mb-6">Tech Stack</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Next.js', desc: 'React framework for production' },
                    { name: 'TypeScript', desc: 'Type-safe JavaScript' },
                    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework' },
                    { name: 'Framer Motion', desc: 'Animation library' },
                    { name: 'Pyodide', desc: 'Python in the browser via WebAssembly' },
                    { name: 'Monaco Editor', desc: 'VS Code editor for the web' },
                  ].map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-black/30 rounded-lg p-4 border border-white/5"
                    >
                      <div className="font-semibold text-cyan-400">{tech.name}</div>
                      <div className="text-sm text-purple-200/60">{tech.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gradient mb-6">Features</h2>
                <ul className="space-y-3">
                  {[
                    'Fully client-side Python execution with Pyodide',
                    'Beautiful glassmorphic UI with neon accents',
                    'Smooth animations powered by Framer Motion',
                    'Monaco Editor for a VS Code-like experience',
                    'Curated coding challenges from beginner to advanced',
                    'Random challenge generator for when you\'re bored',
                    'Code sharing via URL',
                    'Completely free and open source'
                  ].map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-purple-200/80">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* GitHub Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <a
                  href="https://github.com/forsyth-county/code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 glass glass-hover rounded-full px-8 py-4 text-lg font-semibold"
                >
                  <Github size={24} />
                  View on GitHub
                </a>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
