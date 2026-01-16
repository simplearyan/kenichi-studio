---
title: "Feature Focus: Drag-and-Drop Video Editing in Kinetix"
description: "How we implemented local video file support in the Kinetix engine using Blob URLs and HTML5 Canvas."
pubDate: 2026-01-20
tags: ["feature", "video-editing", "drag-drop", "javascript"]
---

# Feature Focus: Drag-and-Drop Video Editing in Kinetix

The core promise of **Kinetix** is to bring professional-grade motion graphics and video editing directly to the browser. While our engine excels at procedural graphics (Rectangles, Text), the real power comes when you combine those with existing video footage.

In this post, we'll explore how we added **Local Video Support** with a seamless drag-and-drop experience.

## The Goal: "It Should Just Work"

We wanted a user experience that feels like a native desktop app:
1.  Grab a video file from your computer.
2.  Drag it onto the canvas.
3.  See it play immediately.
4.  Scrub through the timeline with zero latency.

## How It Works (Under the Hood)

Securely playing a local file in the browser requires a few tricks. We don't upload the video to a server; instead, we stream it directly from the user's disk memory.

### 1. The `VideoObject` Class

We created a new object type, `VideoObject`, which wraps an HTML `<video>` element.

```typescript
export class VideoObject extends KinetixObject {
    private video: HTMLVideoElement;

    constructor(id: string, url: string) {
        super(id, 'Video');
        this.video = document.createElement('video');
        this.video.src = url;
        this.video.crossOrigin = "anonymous";
        // Important: Mute by default to allow autoplay policies
        this.video.muted = true; 
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        // Sync video time to engine time
        if (Math.abs(this.video.currentTime - time / 1000) > 0.1) {
            this.video.currentTime = time / 1000;
        }
        
        ctx.drawImage(this.video, this.x, this.y, this.width, this.height);
    }
}
```

### 2. The Drag-and-Drop Zone

In our engine UI, we listen for native Drag events on the container. When a file is dropped, we create a **Blob URL**. This is a temporary, internal URL that points to the file in the browser's memory (e.g., `blob:http://localhost:3000/a3f1...`).

```typescript
// engine.astro (simplified)
container.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file.type.startsWith('video/')) {
        // Create a memory URL
        const url = URL.createObjectURL(file);
        
        // Add to scene
        const video = new VideoObject('my-video', url);
        engine.scene.add(video);
    }
});
```

## Demo: Try It Yourself

We've deployed a live demo of this feature on the `/engine` page.

### The Walkthrough
1.  **Open the Demo**: Navigate to the [Engine Demo](/engine).
2.  **Drag a File**: Find an `.mp4` or `.webm` on your computer.
3.  **Drop It**: You'll see the "Drop Video Here" overlay appear. Release the mouse.
4.  **Edit**: The video typically fills the canvas. You can now:
    *   **Overlay Text**: Click "Add Text" to put a title over your video.
    *   **Animate**: Drag the timeline to see the video scrub in sync with your overlays.
5.  **Export**: Click "Export Video" to burn your text overlays permanently into a new video file!

## Why This Matters

This feature transforms Kinetix from a "graphics generator" into a **Video Editor**. By combining local video playback with canvas-based rendering, we unlock use cases like:

*   **Watermarking**: Batch process videos with a logo overlay.
*   **Subtitles**: Render burned-in captions.
*   **Intros/Outros**: Append animated graphics to video clips.

---

*Try the demo on our [Engine Page](/engine) or check out the implementation on [GitHub](https://github.com/kinetix).*
