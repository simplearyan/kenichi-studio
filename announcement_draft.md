# Kinetix Launch Announcement Drafts

## Tweet / X Thread (Technical)
🚀 Introducing **@kinetix/core**: The Open Source Video Engine for the Web.

Most canvas-to-video libraries are tied to React (Remotion) or just wrappers around ffmpeg. Kinetix is different.

It's a pure TypeScript, time-based rendering engine that runs:
✅ Frame-perfect (offline rendering via Web Workers)
✅ Framework Agnostic (React, Vue, Svelte, Vanilla)
✅ 0 to 4K export in seconds

Powered by the robust `mediabunny` and `webm-muxer` under the hood.

We are 100% Open Source (MPL 2.0). 
Use it freely. Contribute back.

⭐ Star us on GitHub: [link]
❤️ Sponsor the dev: [link]

#webdev #javascript #opensource #video

---

## Reddit r/webdev (The "Pitch")
**Title:** I open-sourced the video engine behind my SaaS. It's framework-agnostic and renders 4K in the browser.

**Body:**
Hey everyone,
I've spent the last year building a video editor, and I realized the core engine was too good to keep closed.

So I extracted it into **Kinetix Core**.

**Why another video library?**
Most existing tools force you into a specific ecosystem (like React for Remotion) or are just simple canvas recorders that drop frames if your PC lags.

Kinetix uses an "Offline Rendering" approach with Web Workers. It steps through your animation time frame-by-frame, ensuring every single pixel is perfect, regardless of your frame rate. It uses `mediabunny` for encoding and `webm-muxer` (C++/Wasm) for raw speed.

**It features:**
- A robust Scene Graph
- Object system (transform, opacity, z-index)
- Time management (seek, play, pause, loop)
- Heavy export optimization

It's licensed under **MPL 2.0** (like Mozilla Firefox), so you can use it in commercial apps freely, but improvements to the core file stay open.

I'm looking for feedback and contributors!
[Link to Repo]

---

## GitHub Discussion / Sponsor Pitch
**Title:** Why Sponsor Kinetix?

Building a reliable video engine is complex scaling work. We stand on the shoulders of giants like `mediabunny` and `webm-muxer` to bring you a stable viewing experience.

Your sponsorship directly funds:
1.  **Maintenance**: Keeping up with browser codecs and WebGL updates.
2.  **New Object Packs**: We plan to release a `Chart.js` adapter and a standard "lower-thirds" library.
3.  **Documentation**: Better guides and interactive examples.

If you rely on Kinetix for your product, please consider sponsoring.
