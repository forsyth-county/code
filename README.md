# Code Forsyth ✨

**The most beautiful in-browser Python coding platform**

Code Forsyth is a stunning, fully client-side Python code executor built for students to learn and practice coding. With a premium glassmorphic UI, smooth animations, and zero backend requirements, it's designed to make coding addictive and fun.

![Code Forsyth](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🌟 Features

- **🚀 Instant Python Execution**: Run Python code directly in your browser using Pyodide (WebAssembly)
- **✨ Stunning UI**: Dark theme with grid background, glassmorphism, and neon glow effects
- **🎨 Monaco Editor**: VS Code-like editing experience with syntax highlighting
- **🎯 Fun Challenges**: Curated collection of coding challenges from beginner to advanced
- **🎲 Random Challenge Generator**: "Feeling Lucky?" button for when you're bored
- **🔗 Code Sharing**: Share your code via URL hash
- **📱 Fully Responsive**: Works beautifully on desktop, tablet, and mobile
- **⚡ Zero Backend**: 100% client-side, perfect for GitHub Pages

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Pages Router, Static Export)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Python Runtime**: [Pyodide](https://pyodide.org/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/forsyth-county/code.git
cd code

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build and export static site
npm run build

# The static files will be in the 'out' directory
```

## 📁 Project Structure

```
code/
├── components/          # Reusable React components
│   ├── GlassHeader.tsx # Navigation header with glassmorphism
│   └── GlowingButton.tsx # Animated button component
├── data/               # Static data
│   └── challenges.ts   # Coding challenges dataset
├── lib/                # Utility functions
│   └── utils.ts        # Helper functions (cn, etc.)
├── pages/              # Next.js pages
│   ├── _app.tsx        # App wrapper
│   ├── _document.tsx   # HTML document
│   ├── index.tsx       # Landing page
│   ├── executor.tsx    # Python code executor
│   ├── challenges.tsx  # Challenges gallery
│   ├── examples.tsx    # Code examples
│   └── about.tsx       # About page
├── public/             # Static assets
├── styles/             # Global styles
│   └── globals.css     # Tailwind + custom CSS
├── next.config.js      # Next.js configuration
├── tailwind.config.ts  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## 🎨 Design Philosophy

Code Forsyth embraces a **cyberpunk-minimalist** aesthetic with:

- **Dark Grid Background**: Subtle graph paper effect with cosmic glow
- **Glassmorphism**: Frosted glass panels with backdrop blur
- **Neon Accents**: Cyan, purple, and pink gradient highlights
- **Smooth Animations**: Every interaction feels premium
- **Typography**: Inter for UI, JetBrains Mono for code

## 🎯 Usage

### Running Code

1. Navigate to the **Executor** page
2. Write or paste Python code in the Monaco Editor
3. Click **Run Code** to execute
4. View output in the output panel

### Trying Challenges

1. Go to **Challenges** page
2. Browse the collection of coding challenges
3. Click **Try It** on any challenge
4. The code loads automatically in the executor

### Random Challenge

1. Click the **Feeling Lucky?** button (header or landing page)
2. A random challenge loads instantly
3. Perfect for quick practice sessions!

## 🌐 Deployment

### GitHub Pages

1. Update `next.config.js` basePath for your repo name
2. Build the project: `npm run build`
3. Deploy the `out` folder to GitHub Pages

### Other Hosts

The static `out` folder can be deployed to:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3
- Any static hosting service

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Credits

Built with ❤️ for Forsyth County students.

**Technologies:**
- [Pyodide](https://pyodide.org/) - Python in the browser
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

**Made with 💜 for students who love to code**
