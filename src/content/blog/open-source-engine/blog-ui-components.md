---
title: "The Monolith Trap: Why Kinetix Needs a UI Library"
description: "A guide to why Kinetix needs a UI library."
pubDate: 2026-01-20
tags: ["tutorial", "open-source", "react", "svelte", "video-engine"]
--- 

# The Monolith Trap: Why Kinetix Needs a UI Library

We recently spent several hours building the `/engine` demo page. We hooked up a timeline slider, formatted time strings (`00:05`), handled play/pause toggles, and managed canvas resizing.

The result is beautiful, but the code in [engine.astro](file:///d:/Code/Antigravity/design_concepts/kinetix/src/pages/engine.astro) is becoming a "Monolith"—a mix of app logic, UI handling, and engine glue code.

## The Problem: Reinventing the Wheel

Every time a developer wants to build a tool with Kinetix, they currently have to:
1.  Instantiate the [Engine](file:///d:/Code/Antigravity/design_concepts/kinetix/src/engine/Core.ts#4-700).
2.  Build their own HTML buttons for "Play", "Pause", "Export".
3.  Write custom event listeners to sync a range input with `engine.currentTime`.
4.  Figure out the CSS to make the canvas responsive.

This slows down adoption. A developer who wants a "Video Player" doesn't want to write a `formatTime(ms)` helper function from scratch.

## The Solution: `@kinetix/ui`

It is not enough to just ship the **Logic** (the Engine). We must also ship the **Interface**.

We are proposing a new package (or exports from the core) that provides "Headless" and "Styled" components.

### 1. The "Headless" Hooks
Imagine using Kinetix with React or Vue easily:
```jsx
const { isPlaying, togglePlay, currentTime, duration } = useKinetix(engine);
```
This abstracts away the event listener boilerplate.

### 2. The Pre-built Components
For faster prototyping, we should offer web components or framework-agnostic UI blocks:

```html
<kinetix-player engine={myEngine}>
  <kinetix-canvas slot="screen" />
  <kinetix-controls slot="controls" theme="dark" />
</kinetix-player>
```

## Moving Forward

By extracting our custom logic from [engine.astro](file:///d:/Code/Antigravity/design_concepts/kinetix/src/pages/engine.astro) into reusable components, we achieve two things:
1.  **Dogfooding**: We verify that our components are flexible enough for real apps.
2.  **Velocity**: Future demo pages (or user apps) can be spun up in minutes, not hours.

The goal is to make Kinetix not just an *Engine*, but a *Platform*.
