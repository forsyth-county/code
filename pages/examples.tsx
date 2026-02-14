import React from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import GlassHeader from '@/components/GlassHeader';
import { cn } from '@/lib/utils';
import { Code2 } from 'lucide-react';

const examples = [
  {
    title: 'Hello World',
    code: `print("Hello, World!")`,
    description: 'The classic first program'
  },
  {
    title: 'Variables',
    code: `name = "Python"
version = 3.11
print(f"{name} {version}")`,
    description: 'Working with variables'
  },
  {
    title: 'Lists',
    code: `fruits = ['apple', 'banana', 'cherry']
for fruit in fruits:
    print(fruit)`,
    description: 'Iterating through lists'
  },
  {
    title: 'Functions',
    code: `def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
    description: 'Defining and using functions'
  },
  {
    title: 'List Comprehension',
    code: `squares = [x**2 for x in range(10)]
print(squares)`,
    description: 'Creating lists efficiently'
  },
  {
    title: 'Dictionary',
    code: `person = {
    "name": "Alice",
    "age": 30
}
print(person["name"])`,
    description: 'Using dictionaries'
  }
];

export default function Examples() {
  const router = useRouter();

  const handleTryExample = (code: string) => {
    const encoded = btoa(code);
    router.push(`/executor?code=${encoded}`);
  };

  return (
    <>
      <Head>
        <title>Examples - Code Forsyth</title>
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
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-black text-gradient mb-4">
                Code Examples
              </h1>
              <p className="text-lg text-purple-200/80 max-w-2xl mx-auto">
                Quick Python examples to get you started
              </p>
            </motion.div>

            {/* Examples Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {examples.map((example, index) => (
                <motion.div
                  key={example.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass rounded-2xl overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gradient mb-2">
                      {example.title}
                    </h3>
                    <p className="text-sm text-purple-200/70 mb-4">
                      {example.description}
                    </p>
                    <div className="bg-black/50 rounded-lg p-4 mb-4">
                      <pre className="text-sm text-green-300 font-mono overflow-x-auto">
                        {example.code}
                      </pre>
                    </div>
                    <button
                      onClick={() => handleTryExample(example.code)}
                      className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2 font-semibold"
                    >
                      <Code2 size={18} />
                      Try It
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
