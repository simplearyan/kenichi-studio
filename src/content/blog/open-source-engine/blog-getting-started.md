---
title: "Getting Started with Kinetix: The Open Source Video Engine"
description: "A comprehensive guide to installing, configuring, and using the Kinetix engine with React, Svelte, and more."
pubDate: 2026-01-20
tags: ["tutorial", "open-source", "react", "svelte", "video-engine"]
---

# Getting Started with Kinetix Engine

Welcome to **Kinetix**, the lightweight, open-source video engine for the web. Whether you're building a simpler social media tool, an automated video generator, or a full-blown video editor, Kinetix provides the core building blocks you need without the bloat.

In this guide, we'll walk through:
1.  **Installation**: Setting up the core engine.
2.  **Basic Usage**: A simple "Hello World" in Vanilla JS.
3.  **Framework Integration**: Using Kinetix with **React** and **Svelte**.
4.  **UI Components**: Using our built-in library for instant controls.
5.  **Customization**: Styling the engine to fit your brand.

---

## 1. Installation

Kinetix is modular. You can install just the core engine, or add our UI library for pre-built controls.

```bash
# Install the core engine
npm install @kinetix/core

# Optional: Install the UI library (if you want pre-built controls)
npm install @kinetix/ui
```

> **Note**: Kinetix is built with TypeScript and ships with full type definitions out of the box.

---

## 2. Basic Usage (Vanilla JS)

At its heart, Kinetix is just a wrapper around an HTML `<canvas>`. Here is the absolute minimum setup:

```html
<!-- index.html -->
<canvas id="my-canvas"></canvas>

<script type="module">
  import { Engine, Rect, Text } from '@kinetix/core';

  // 1. Initialize the Engine
  const canvas = document.getElementById('my-canvas');
  const engine = new Engine(canvas);
  
  // 2. Set Resolution
  engine.resize(1080, 1080); // Square video
  
  // 3. Add Objects
  const rect = new Rect('my-rect', { 
      width: 200, height: 200, fill: 'red', x: 440, y: 440 
  });
  engine.scene.add(rect);
  
  const text = new Text('my-text', {
      text: "Hello World", fontSize: 60, fill: 'white', x: 400, y: 300
  });
  engine.scene.add(text);
  
  // 4. Play!
  engine.play();
</script>
```

---

## 3. Framework Integration

Kinetix is framework-agnostic. It doesn't care if you use React, Vue, Svelte, or Angular. It just needs a reference to a `canvas` element.

### React Integration

In React, use a `useRef` to get the canvas and a `useEffect` to initialize the engine.

```tsx
import React, { useEffect, useRef } from 'react';
import { Engine, Rect } from '@kinetix/core';

export const VideoEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize
    const engine = new Engine(canvasRef.current);
    engineRef.current = engine;
    
    // Setup Scene
    engine.resize(1920, 1080);
    engine.scene.add(new Rect('demo-rect', { width: 100, height: 100, fill: 'blue' }));

    // Cleanup on unmount
    return () => {
      engine.dispose();
    };
  }, []);

  return (
    <div className="video-container">
      <canvas ref={canvasRef} className="w-full aspect-video bg-black" />
      <button onClick={() => engineRef.current?.play()}>Play</button>
    </div>
  );
};
```

### Svelte Integration

In Svelte, use the `bind:this` directive and `onMount`.

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { Engine, Rect } from '@kinetix/core';

  let canvas: HTMLCanvasElement;
  let engine: Engine;

  onMount(() => {
    engine = new Engine(canvas);
    engine.resize(1920, 1080);
    engine.scene.add(new Rect('box', { fill: '#ff0000', width: 200, height: 200 }));
    
    return () => engine.dispose();
  });
</script>

<div class="container">
  <canvas bind:this={canvas}></canvas>
  <button on:click={() => engine.play()}>Play</button>
</div>
```

---

## 4. Using the UI Library

Why build controls from scratch? `@kinetix/ui` provides drop-in components for common tasks. These components are Vanilla JS classes that mount into *any* container you provide.

### Available Components
1.  **[PlayerOverlay](file:///d:/Code/Antigravity/design_concepts/kinetix/src/open-source-engine/src/ui/PlayerOverlay.ts#3-179)**: Play/Pause, Seekbar, Timer.
2.  **[CanvasControl](file:///d:/Code/Antigravity/design_concepts/kinetix/src/open-source-engine/src/ui/CanvasControl.ts#3-210)**: Resolution (Presets/Custom), Duration, Background Color.
3.  **[ExportControl](file:///d:/Code/Antigravity/design_concepts/kinetix/src/open-source-engine/src/ui/ExportControl.ts#3-202)**: Export to MP4/WebM, Frame Rate, Resolution sync.

### Example Setup

```typescript
import { Engine } from '@kinetix/core';
import { PlayerOverlay, CanvasControl, ExportControl } from '@kinetix/ui';

const engine = new Engine(document.getElementById('canvas'));

// 1. Mount Player Controls OVER the canvas container
new PlayerOverlay(engine, document.getElementById('canvas-wrapper'));

// 2. Mount Canvas Settings (Resolution, Aspect Ratio) to a sidebar
new CanvasControl(engine, document.getElementById('settings-sidebar'));

// 3. Mount Export Controls to a sidebar
new ExportControl(engine, document.getElementById('export-sidebar'));
```

### Why Vanilla JS Components?
By making our UI components framework-agnostic (just passing a DOM node), you can use them in React, Vue, or Svelte without worrying about context bridges or render cycles.

**React Usage:**
```tsx
const SettingsPanel = ({ engine }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (engine && containerRef.current) {
        // Just mount it!
        new CanvasControl(engine, containerRef.current);
    }
  }, [engine]);

  return <div ref={containerRef} />;
};
```

---

## 5. Customization & Styling

All Kinetix UI components are built with standard HTML/CSS. 

### Tailwind CSS
If you use Tailwind, the components will inherit basic resets. We use specific classes (like `bg-gray-800`, `text-white`) that generally look good in dark mode.

### Custom CSS Override
Since the components render into your DOM (not a Shadow DOM), you can override their styles easily using standard CSS.

```css
/* Override the export button color */
#kp-btn-export {
    background-color: #ff4757 !important;
    border-radius: 99px !important;
}

/* Change the slider color */
#kp-timeline-progress {
    background-color: #2ed573 !important;
}
```

---

## 6. Build Anything

With these tools, the possibilities are endless:

*   **Social Media Tool**: Create a "Text-to-TikTok" generator using the 9:16 aspect ratio preset and text overlays.
*   **Video Editor**: Build a full timeline editor using the React integration.
*   **Automation**: Use the core engine in a headless Node.js environment (with a mock canvas) to render videos server-side.

Start building today with `@kinetix/core`.

[GitHub Repository](https://github.com/kinetix/core) | [Documentation](https://kinetix.dev/docs)
