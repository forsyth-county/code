import React from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import GlassHeader from '@/components/GlassHeader';
import { challenges } from '@/data/challenges';
import { cn } from '@/lib/utils';
import { Code2, Zap, Target } from 'lucide-react';

export default function Challenges() {
  const router = useRouter();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleTryChallenge = (challengeId: number) => {
    router.push(`/executor?challenge=${challengeId}`);
  };

  return (
    <>
      <Head>
        <title>Challenges - Code Forsyth</title>
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
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-black text-gradient mb-4">
                Coding Challenges
              </h1>
              <p className="text-lg text-purple-200/80 max-w-2xl mx-auto">
                Practice your Python skills with our curated collection of fun challenges
              </p>
            </motion.div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass glass-hover rounded-2xl p-6 cursor-pointer"
                  onClick={() => handleTryChallenge(challenge.id)}
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {challenge.category}
                    </span>
                    <span
                      className={cn(
                        'text-xs px-3 py-1 rounded-full border',
                        getDifficultyColor(challenge.difficulty)
                      )}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold mb-2 text-gradient">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-purple-200/70 mb-4 line-clamp-2">
                    {challenge.description}
                  </p>

                  {/* Action Button */}
                  <button className="w-full mt-auto px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2 font-semibold">
                    <Code2 size={18} />
                    Try It
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 glass rounded-2xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-black text-gradient mb-2">
                    {challenges.length}
                  </div>
                  <div className="text-purple-200/70">Total Challenges</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-gradient mb-2">
                    {challenges.filter(c => c.difficulty === 'beginner').length}
                  </div>
                  <div className="text-purple-200/70">Beginner Friendly</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-gradient mb-2">
                    {new Set(challenges.map(c => c.category)).size}
                  </div>
                  <div className="text-purple-200/70">Categories</div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
