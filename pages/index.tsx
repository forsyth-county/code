import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import GlassHeader from '@/components/GlassHeader';
import GlowingButton from '@/components/GlowingButton';
import { Code2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Code Forsyth - Level Up Your Coding</title>
        <meta name="description" content="The most beautiful in-browser Python coding platform" />
      </Head>

      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Grid Background */}
        <div className="fixed inset-0 grid-background" />
        
        {/* Cosmic Glow Overlay */}
        <div className="fixed inset-0 cosmic-glow pointer-events-none" />
        
        {/* Radial gradient mask */}
        <div className={cn(
          "pointer-events-none fixed inset-0 flex items-center justify-center",
          "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        )} />

        {/* Header */}
        <GlassHeader />

        {/* Main Content */}
        <main className="relative z-10 pt-32 pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              {/* Welcome Pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <div className="glass px-6 py-2 rounded-full text-sm">
                  Welcome back, Coder! 👋
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black"
              >
                <span className="text-gradient">Level Up Your Coding</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg md:text-xl text-purple-200/80 max-w-3xl mx-auto leading-relaxed"
              >
                Turn practice time into mastery. Instant Python executor, dozens of challenges, 
                plots, and tools — fast, safe, and actually fun.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
              >
                <GlowingButton
                  onClick={() => router.push('/executor')}
                  icon={Code2}
                  variant="gradient"
                  size="lg"
                  className="w-full sm:w-auto text-xl"
                >
                  Start Coding Now
                </GlowingButton>

                <GlowingButton
                  onClick={() => router.push('/executor?random=true')}
                  icon={Sparkles}
                  variant="purple"
                  size="lg"
                  className="w-full sm:w-auto text-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
                >
                  Feeling Lucky?
                </GlowingButton>
              </motion.div>

              {/* Bottom Note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm text-purple-300/60 pt-4"
              >
                ✨ Feeling Lucky? takes you to a random coding challenge — perfect when you're bored!
              </motion.p>
            </motion.div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  title: "Instant Execution",
                  description: "Run Python code directly in your browser with Pyodide. No setup required.",
                  emoji: "⚡"
                },
                {
                  title: "Fun Challenges",
                  description: "Practice with curated coding challenges from beginner to advanced.",
                  emoji: "🎯"
                },
                {
                  title: "Beautiful UI",
                  description: "Code in style with our stunning glassmorphic interface and smooth animations.",
                  emoji: "✨"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.2 }}
                  className="glass glass-hover rounded-2xl p-8 text-center"
                >
                  <div className="text-5xl mb-4">{feature.emoji}</div>
                  <h3 className="text-xl font-bold mb-3 text-gradient">{feature.title}</h3>
                  <p className="text-purple-200/70">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
