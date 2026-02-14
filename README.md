# CodeForsyth ✨

**A beautiful in-browser Python code executor for students**

CodeForsyth is a streamlined, fully client-side Python code executor built for Forsyth County students to learn and practice coding. With a clean blue/white/red interface, dark grid background, and glassmorphic design, it makes coding simple and beautiful.

![Code Forsyth](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🌟 Features

- **🚀 Instant Python Execution**: Run Python code directly in your browser using Pyodide (WebAssembly)
- **✨ Beautiful Interface**: Dark theme with grid background, glassmorphism, and smooth animations
- **🎨 Monaco Editor**: VS Code-like editing experience with syntax highlighting
- **🖥️ Interactive Python Console**: Live REPL with xterm.js for line-by-line Python execution
- **🛡️ Error Handling**: Clear error messages for both syntax and runtime errors
- **📱 Fully Responsive**: Works beautifully on desktop, tablet, and mobile
- **⚡ Zero Backend**: 100% client-side, perfect for GitHub Pages

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (Pages Router, Static Export)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Python Runtime**: [Pyodide 0.25.0](https://pyodide.org/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Terminal**: [xterm.js](https://xtermjs.org/) - Interactive terminal emulator
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
├── components/          # React components
│   ├── GlassHeader.tsx # Navigation header
│   ├── GlowingButton.tsx # Animated button
│   └── GlassTerminal.tsx # Interactive Python console
├── lib/                # Utilities
│   └── utils.ts        # Helper functions
├── pages/              # Next.js pages
│   ├── _app.tsx        # App wrapper
│   ├── _document.tsx   # HTML document
│   ├── index.tsx       # Landing page
│   └── executor.tsx    # Python executor
├── public/             # Static assets
│   └── favicon.ico     # Site favicon
├── styles/             # Global styles
│   └── globals.css     # Tailwind + custom CSS
└── next.config.js      # Next.js config
```

## 🎨 Design

**Color Scheme:**
- Primary: Blue (#3B82F6)
- Secondary: White (#FFFFFF)
- Accent: Red (#EF4444)
- Background: Black with dark grid pattern (#262626)

**Visual Elements:**
- Dark grid background (40px × 40px)
- Glassmorphic panels with backdrop blur
- Blue-White-Red gradient text
- Cosmic glow effects (blue and red)
- Smooth Framer Motion animations

## 🎯 Usage

### Running Python Code in the Editor

1. Navigate to the **Executor** page
2. Write or paste Python code in the Monaco Editor
3. Click **Run Code** to execute
4. View output in the output panel

### Using the Interactive Python Console

The executor page features a live Python REPL (Read-Eval-Print Loop) console below the editor:

1. Type Python commands directly in the console
2. Press **Enter** to execute line-by-line
3. Results appear immediately in the terminal
4. Use **Up/Down arrows** to navigate command history
5. Click **Send to Console** button to execute editor code in the console
6. Click the **Trash icon** to clear the console

The console provides:
- Real-time Python execution
- Command history (arrow keys)
- Multi-line input support
- Syntax-highlighted output
- Shared Pyodide environment with the editor

### Error Handling

The executor properly handles:
- **Syntax Errors**: Shows parsing errors with line numbers
- **Runtime Errors**: Captures exceptions during execution
- **Standard Error**: Displays warnings and error output
- **Clear Messages**: User-friendly error formatting

### Python Code Notes

**Important**: The browser-based Pyodide environment does not support `input()` for interactive user input. 

Instead of:
```python
name = input("Enter your name: ")
```

Use pre-defined variables:
```python
name = "Student"
```

## 🌐 Deployment

### GitHub Pages (Automated)

1. GitHub Actions workflow is included (`.github/workflows/deploy.yml`)
2. Triggers on push to `main` branch
3. Builds and deploys automatically
4. Live at: `https://forsyth-county.github.io/code`

### Manual Deployment

```bash
npm run build
# Deploy 'out' folder to any static host
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Credits

Built with ❤️ for Forsyth County students.

**Technologies:**
- [Pyodide](https://pyodide.org/) - Python in the browser
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [xterm.js](https://xtermjs.org/) - Terminal emulator
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

**Made with 💙 for students who love to code**
