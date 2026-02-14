export interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  code: string;
  category: string;
}

export const challenges: Challenge[] = [
  {
    id: 1,
    title: "Hello World",
    description: "Print 'Hello, World!' to the console",
    difficulty: "beginner",
    code: `# Your first Python program!
print("Hello, World!")`,
    category: "basics"
  },
  {
    id: 2,
    title: "Mad Libs Generator",
    description: "Create a fun Mad Libs story generator",
    difficulty: "beginner",
    code: `# Mad Libs Generator
name = "Alice"
adjective = "happy"
verb = "dance"

story = f"Once upon a time, {name} was very {adjective}. They loved to {verb} every day!"
print(story)`,
    category: "fun"
  },
  {
    id: 3,
    title: "FizzBuzz Classic",
    description: "The classic FizzBuzz programming challenge",
    difficulty: "beginner",
    code: `# FizzBuzz Challenge
for i in range(1, 31):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`,
    category: "algorithms"
  },
  {
    id: 4,
    title: "Fibonacci Sequence",
    description: "Generate the Fibonacci sequence",
    difficulty: "intermediate",
    code: `# Fibonacci Sequence Generator
def fibonacci(n):
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

result = fibonacci(15)
print(result)
print(f"The 15th Fibonacci number is: {result[-1]}")`,
    category: "algorithms"
  },
  {
    id: 5,
    title: "Prime Number Checker",
    description: "Check if numbers are prime",
    difficulty: "intermediate",
    code: `# Prime Number Checker
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

primes = [n for n in range(2, 51) if is_prime(n)]
print(f"Primes up to 50: {primes}")`,
    category: "algorithms"
  }
];

export function getRandomChallenge(): Challenge {
  const randomIndex = Math.floor(Math.random() * challenges.length);
  return challenges[randomIndex];
}

export function getChallengeById(id: number): Challenge | undefined {
  return challenges.find(c => c.id === id);
}
