# Contributing to Kinetix

Thank you for your interest in contributing to Kinetix! We're building an advanced educational platform and creative studio, and we'd love your help.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Architecture](#project-architecture)
- [Component Development](#component-development)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### Initial Setup

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/yourusername/kinetix.git
cd kinetix

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🔄 Development Workflow

### 1. Create a New Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull origin main

# Create and switch to a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write code following our [Code Style](#code-style).
- Test your changes locally in both light and dark modes.
- Commit frequently with clear messages.

### 3. Push and Create PR

```bash
# Push your branch to your fork
git push origin feature/your-feature-name
```

---

## 🏗️ Project Architecture

Kinetix is a hybrid application combining static content (Astro) with dynamic, interactive applications (React).

- **Static Pages (Blog/Education)**: These use Astro components for maximum performance.
- **Kinetix Studio**: This is a fully client-side React application ("island") embedded within Astro.

### Directory Structure

- `src/components/studio/`: Contains the core logic for the video editor (Timeline, Canvas, Properties).
- `src/components/animator/`: Helpers for animations used in the studio.
- `src/content/`: MDX-based content for the blog and education hub.
- `src/layouts/`: Base layouts for the application.

---

## 🎨 Component Development

### Creating a New Studio Component

If you are adding a new drag-and-drop object to the Kinetix Studio:

1.  **Define the Object**: Create the object class in `src/engine/objects/`.
2.  **Create the Renderer**: Add the React component that renders this object in `src/components/create/objects/`.
3.  **Add Settings**: Create a settings panel in `src/components/create/settings/`.
4.  **Register**: Register the object type in the Engine core.

### Creating a UI Component

For general UI components (buttons, cards):

- Use **Tailwind CSS** for styling.
- Support **Dark Mode** (`dark:` prefix).
- Use **Lucide React** for icons.

---

## 💅 Code Style

### General Guidelines

- Use 4 spaces for indentation (TSX/TS) and 2 spaces for JSON/MD.
- Use explicit types in TypeScript.
- Prefer functional components and Hooks for React.

### Tailwind Best Practices

- Use the simplified color palette (`bg-app-bg`, `text-primary`, `bg-accent`).
- Avoid arbitrary values (`w-[123px]`) unless absolutely necessary.
- Use `clsx` or `tailwind-merge` for conditional class names.

### Commit Messages

Follow conventional commits:

```text
type(scope): subject
```

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons
- `refactor`: Code restructuring

---

## 🔍 Pull Request Process

1.  **Test your changes**: Ensure the app builds (`npm run build`) and runs without errors.
2.  **Describe your changes**: Provide a clear description of what you did and why in the PR.
3.  **Screenshots**: If you changed the UI, please attach before/after screenshots.

---

## 🐛 Reporting Bugs

Please include:
- A clear description of the bug.
- Steps to reproduce.
- Browser and OS version.
- Screenshots if applicable.

---

**Happy Coding! 🚀**
