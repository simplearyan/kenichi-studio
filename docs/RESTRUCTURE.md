# Kenichi Studio Restructuring Plan

## Objective
Transition from a flat, component-based architecture to a **domain-driven, feature-based architecture**. This ensures scalability as we add distinct micro-tools (Logo Maker, Meme Generator, Converters) without polluting the global scope.

---

## 🏗️ New Directory Structure

### `src/features/` (The Core)
Every distinct sub-product gets its own domain in `features/`.

```text
src/features/
├── core/                # Shared logic across all apps (e.g. Engine, Store)
├── studio/              # "Kenichi Studio" (Video Editor)
│   ├── components/      # Timeline, Viewport, LayersPanel
│   ├── hooks/           # useTimeline, usePlayback
│   └── stores/          # Editor-specific state
├── logo-maker/          # [NEW] Logo creation tool
│   ├── templates/       # JSON definitions of logos
│   └── Editor.tsx       # Logo-specific canvas
├── meme-maker/          # [NEW] Meme generator
└── converters/          # [NEW] SVG/Media utilities
```

### `src/components/` (Shared UI)
Only "dumb", reusable UI primitives go here.
*   `ui/` (Buttons, Inputs, Sliders - Shadcn/Tailwind style)
*   `layout/` (Navbar, Footer, SEOHead)
*   `overlays/` (Modals, Toasts)

### `src/pages/` (Routing)
Pages become thin wrappers that import feature containers.
*   `pages/studio/index.astro` -> Imports `<StudioApp />` from `features/studio`
*   `pages/tools/logo.astro` -> Imports `<LogoMaker />` from `features/logo-maker`

---

## 🔄 Migration Steps

### Phase 1: Preparation (Safe)
- [ ] Create `src/features` directory.
- [ ] Create `src/components/ui` for primitives.

### Phase 2: The Studio Migration (Big Move)
- [ ] Move `src/components/Editor.tsx` -> `src/features/studio/Editor.tsx`.
- [ ] Move `src/components/Visualizer.tsx` -> `src/features/studio/Visualizer.tsx`.
- [ ] Move `src/components/studio/*` -> `src/features/studio/components/`.

### Phase 3: Shared Code Cleanup
- [ ] Audit `src/utils` and move feature-specific utils into their respective `features/` folder.
- [ ] Keep only truly global utils (math, string formatting) in `src/utils`.

## 📏 Rules of Thumb
1.  **Imports**: A feature should typically not import from another feature (unless it's from `features/core`).
2.  **Colocation**: If a component is ONLY used by the Logo Maker, it belongs in `features/logo-maker/components`, NOT `src/components`.
3.  **Pages**: Page files should contain almost no logic, just layout wrapping and data fetching.
