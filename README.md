# Pathemoria — Architecture & Deployment Guide

**Repository:** `Pathemoria/Pathemoria.github.io`  
**Live URL:** [pathemoria.github.io](https://pathemoria.github.io)  
**Branch:** `main` (deployed directly via GitHub Pages)

---

## 1. Overview

Pathemoria is a personal website built as a single-page application in a single HTML file. It began as a design exercise — a fictional café website called *The Grounds* — and evolved through active development into a personal page whose design language proved too considered and too idiosyncratic for a real local business pitch. The café-origin is still visible in the current version: the placeholder content (reviews, a Vienna map, sample contact details) retains the voice and structure of a hospitality site. That content is pending replacement with real personal material.

The name is a Latin-Greek portmanteau: *pathema* (πάθημα, Greek — the memory of felt experience, what is lived through rather than chosen) combined with *memoria* (Latin — memory). It means, roughly, the emotional residue of having lived through something.

### Design Identity

The aesthetic is built around three reference points that reinforce each other:

- **NieR:Automata's UI language** — a left sidebar navigation using dot-matrix stipple textures, geometric markers, ledger-line borders, filled active-state bands, and a three-zone vertical layout. The interface is treated as diegetic — it feels like a printed document existing within the world rather than a shell sitting on top of it.
- **Typewriter / literary print** — Special Elite (a typewriter-face font) for all labels, headings, and navigation. Lora (a humanist serif) for body text. Together they produce the atmosphere of a well-made small-press publication.
- **Parchment palette** — a warm ink-on-paper colour system: `--ink: #1a1209`, `--parchment: #f4efe6`, `--amber: #b5742a`. Low contrast, low saturation, high atmosphere.

The Aizawa strange attractor rendered in the background on a fixed canvas reinforces the idea of something alive and continuous beneath the interface — the world exists before and beneath the navigation.

---

## 2. Architecture

### Single-File Structure

The entire site lives in one `index.html` file. This was a deliberate choice made at the start of development and maintained throughout: during active design iteration, a single file eliminates the overhead of coordinating changes across multiple files and removes any risk of import path or build tool issues. The planned split into separate `style.css`, `main.js`, and `index.html` files is deferred until the design is stable.

The file is structured in three logical blocks:

```
<head>
  Google Fonts links (Special Elite, Lora)
  <style> — all CSS (~450 lines)

<body>
  <aside class="sidebar"> — brand name + navigation
  <div class="page-body">
    <main>
      <canvas id="attractor-canvas"> — fixed-position, full viewport
      <div class="stage-card"> — the animated content container
        Five .stage-section divs (Reviews, Location, About, Gallery, Contact)
    <div class="lightbox"> — full-viewport image overlay
    <footer>

<script> — all JavaScript (~380 lines)
```

### Layout System

The body is a horizontal flex row: `aside.sidebar` (fixed 160px width) on the left, `div.page-body` (flex: 1) on the right. The page body is a vertical flex column: `<main>` expands to fill available height, `<footer>` sits at the bottom.

The `<canvas>` element is `position: fixed; inset: 0` — it covers the full viewport behind everything, including behind the sidebar. Both the sidebar and the stage card use `backdrop-filter: blur()` to sit as frosted-glass panels in front of the attractor.

The stage card (`div.stage-card`) is absolutely sized via JavaScript: its `width` and `height` are set as inline pixel values calculated from the active section's content. All five section divs are `position: absolute; top: 0; left: 0; right: 0` inside it, stacked. Only the active section has `opacity: 1`; all others are `opacity: 0`.

On mobile (≤700px), this model inverts: the card hands its dimensions back to CSS (`height: auto !important` overrides the JS inline style), sections switch from `position: absolute` with opacity-toggling to `position: relative` with `height: 0 / height: auto` — collapsed when inactive, expanded when active. This allows the card to grow naturally with its content rather than requiring a JS-calculated pixel height.

### CSS Custom Properties

All colours, and the sidebar width, are defined as CSS custom properties on `:root`:

| Property | Value | Role |
|---|---|---|
| `--ink` | `#1a1209` | Primary text and border colour |
| `--parchment` | `#f4efe6` | Page background |
| `--cream` | `#fdf8f0` | Lighter surface variant |
| `--amber` | `#b5742a` | Accent — active states, labels, markers |
| `--rule` | `rgba(26,18,9,0.10)` | Hairline borders and dividers |
| `--card-bg` | `rgba(253,248,240,0.15)` | Stage card and sidebar background tint |
| `--sidebar-w` | `160px` | Sidebar width — referenced in both CSS and JS |

### Responsive Breakpoints

Three breakpoints govern layout changes:

**≤900px** — Narrow desktop / tablet landscape. The sidebar remains vertical. Section padding tightens. The two-column contact and location grids collapse to single column before they become cramped.

**≤700px** — Tablet portrait / phone landscape. The sidebar becomes a horizontal topbar. The stage card uses CSS-controlled dimensions. Sections use height-collapse switching. Body scrolls normally.

**≤480px** — Phone portrait. Gallery drops to one column. Padding tightens further. Footer simplifies to one note.

---

## 3. Core Systems

### 3.1 Aizawa Strange Attractor

The background is a real-time particle simulation of the Aizawa strange attractor — a chaotic dynamical system with six parameters that produces a distinctive toroidal-butterfly shape. It runs on a `<canvas>` element using the browser's 2D rendering context.

**Parameters:**
```
a=0.95  b=0.7   c=0.6
d=3.5   e=0.25  f=0.1
dt=0.004  NOISE=0.004
```

**Integration:** Fourth-order Runge-Kutta (RK4). Each animation frame, every particle advances one step through the attractor's differential equations. A small random noise term (`±0.004`) is added to each step to prevent particles from settling into perfectly identical orbits — this produces the natural-looking distributed cloud rather than a rigid wire-frame.

**Initialisation:** 600 warmup steps from a seed point `(0.1, 0, 0)` settle the trajectory onto the attractor before any particles are placed. 220 particles are then seeded at 30-step intervals along the attractor so they arrive pre-distributed rather than all starting from the same point.

**Rendering:** Each particle is drawn as a radial gradient with outer radius 7px, fading from `hsla(28, 65%, 38%)` at the core to transparent at the edge. Alpha varies between 0.30 and 0.80 based on local trajectory speed (faster-moving regions are brighter). A slow Y-axis rotation (`ROT_SPEED = 0.00018` rad/frame) and fixed X-axis tilt (`TILT = 0.42` rad ≈ 24°) give the attractor its characteristic oblique angle. The canvas element itself has `animation: canvasFadeIn` which brings it from opacity 0 to 0.45 — the canvas CSS opacity is set entirely by this animation, with no separate static rule, to avoid conflicts with `fill-mode: both`.

### 3.2 Stage Navigation

The section-switching system orchestrates a three-phase transition between sections on desktop:

1. **Fade out** (400ms) — the current section's opacity transitions to 0
2. **Resize** (750ms width / 900ms height, CSS cubic-bezier transitions) — the stage card animates to the incoming section's dimensions
3. **Fade in** (950ms delay from step 1) — the incoming section's opacity transitions to 1

An `isAnimating` flag blocks any new navigation during an active transition. On mobile, this three-phase sequence is replaced by an instant class swap — animated card resizing does not make sense when the card's dimensions are CSS-controlled.

Section widths are fixed design constants (in pixels):

| Section | Width |
|---|---|
| Reviews | 560 |
| Location | 680 |
| About | 540 |
| Gallery | 740 |
| Contact | 760 |

All widths are clamped to `92%` of the available viewport width (viewport minus sidebar width on desktop, full viewport on mobile) via `clampW()`.

### 3.3 Section Height Measurement

Section heights cannot be derived from CSS alone because sections are `position: absolute` and their content depends on font rendering, text wrapping, and inner container heights — all of which must be known before the card can be sized correctly.

The `measureH(el, width)` function handles this by temporarily pulling an element into normal document flow at a specified pixel width, reading its `offsetHeight`, then restoring all previous styles. The width must be passed explicitly so that text wraps at the correct column width — without it, the element would measure at full window width and understate its true height.

**Font loading:** All height measurements are deferred behind `document.fonts.ready` — a browser-native Promise that resolves only after every CSS font has loaded and is ready to paint. Without this, measurements run against fallback fonts (Georgia), which are measurably shorter than Special Elite. The stored `sectionHeights` values would be permanently too small, and the card would clip its content. `window.load` is provided as a fallback for browsers that do not expose `document.fonts`.

**Measurement order:** Inner containers are always measured before outer sections:
1. Each `.review-slide` is measured to set `reviews-container` height
2. Each `.pager-page` in About is measured to set `about-paginator` height
3. Gallery paginator height is computed geometrically (see §3.4)
4. Each `.stage-section` is then measured — their inner containers now have explicit heights, so `offsetHeight` reads correctly

**Resize handling:** A debounced resize handler (120ms) remeasures everything after the viewport settles. On mobile, it clears the card's inline styles so CSS retakes control. On desktop, it updates the card to the current section's new dimensions.

### 3.4 Gallery System

The gallery displays 12 images across two pages of six, arranged in a 3×2 grid. Two independent systems operate on the same flat `galleryImages` array:

**Page system** — controls which grid of six is visible, using the same paginator/dot pattern as the About section's story pages. The scroll wheel advances pages when the gallery section is active (shared cooldown flag prevents rapid firing).

**Lightbox system** — operates on individual image indices (0–11) across the entire flat array, independent of which page is active. Images are preloaded via a temporary `Image()` object before the visible `<img>` src is set, preventing a flash of the previous image. A double `requestAnimationFrame` delay after the src swap ensures the opacity transition fires after the browser has had a chance to register the new src.

**Height calculation:** Gallery paginator height is computed geometrically rather than measured, because `aspect-ratio: 4/3` is an implicit CSS constraint that `offsetHeight` can occasionally return zero for in certain environments. The formula accounts for the current breakpoint's column count:

```javascript
cols      = getGalleryCols()          // 3 desktop / 2 tablet / 1 phone
cellWidth = (availableWidth - (cols - 1) * 10) / cols
cellHeight = cellWidth * 3 / 4
gridHeight = cellHeight * rows + (rows - 1) * 10
```

### 3.5 Sidebar

The sidebar uses three intentional vertical zones:

- **Zone 1 — Site name** (`flex-shrink: 0`): pinned to the top with a double-ruled separator below (a primary `border-bottom` plus a shorter `::after` line offset below it — the typewritten double-underline convention)
- **Zone 2 — Nav zone** (`flex: 1`, `justify-content: center`): expands to fill all remaining space and floats the nav list into the vertical midpoint. `padding-bottom: 80px` ensures the nav never overlaps the bottom decoration
- **Zone 3 — Closure mark** (`position: absolute; bottom: 36px`): three stacked decreasing-width lines (54px, 36px, 20px) built from layered `linear-gradient` backgrounds — a direct translation of NieR:Automata's document closure annotation

The dot-matrix stipple texture is a `radial-gradient` background: 1px dots on a 6px grid at 9% opacity. Each nav item has a `▪` marker (`::before` pseudo-element) held in normal flex flow rather than positioned absolutely, so all items' text stays at the same X position regardless of whether the marker is visible. Active items receive a filled background band (`rgba(26,18,9,0.07)`) and an amber left border — the NieR inverted-block selection pattern translated to the parchment palette.

### 3.6 Cloudflare Email Protection

Email addresses must never appear as literal text in the HTML source. Cloudflare's email-protection proxy scans HTML for the `@` character and, when found, replaces email addresses with encoded `<a>` tags and injects a `<script src="/cdn-cgi/...">` tag to decode them client-side. This CDN path does not exist on localhost, causing the browser to stall script loading — which silently prevents all JavaScript on the page from executing.

The permanent fix is to inject email addresses at runtime via JavaScript:

```javascript
(function() {
    var at = String.fromCharCode(64);  // builds '@' — never a literal in source
    document.getElementById('contact-email-main').textContent = 'hello' + at + 'thegrounds.co';
})();
```

This runs immediately (before `fonts.ready`, as it has no measurement dependency) and renders identically in every browser. Since the `@` character never exists as a literal byte in the HTML source, Cloudflare's scanner finds nothing to protect and injects nothing.

---

## 4. Deployment

### GitHub Pages Setup

The site is deployed via GitHub Pages from the `main` branch of the `Pathemoria/Pathemoria.github.io` repository. GitHub Pages serves the `index.html` at the root of the repository directly as `pathemoria.github.io`.

No build step is required — the site is a single static HTML file with no dependencies, bundlers, or package managers. Deployment is:

```bash
git add index.html
git commit -m "describe what changed"
git push origin main
```

Changes are typically live within 1–2 minutes of pushing.

### Local Development

The site is developed locally using VS Code with the Live Server extension. Live Server serves the file at `http://127.0.0.1:5500` with hot reload on save.

**Important:** Do not open `index.html` directly as a `file://` URL in a browser. Several browser security policies (particularly around the canvas and backdrop-filter) behave differently under `file://` than under `http://`. Always use Live Server or another local HTTP server.

### Updating the Site

Since everything is in one file, any change means editing `index.html` and pushing. There is no build process to run, no dependencies to install, and no environment to configure.

When replacing placeholder content with real content, the key locations are:

| Content | Location in file |
|---|---|
| Gallery images | `galleryImages[]` array in JS (lightbox src) and `<img src>` attributes in HTML (thumbnails) |
| Contact email addresses | The `String.fromCharCode(64)` IIFE at the top of the script block |
| Map coordinates | The OpenStreetMap `<iframe src>` in the Location section |
| Site name | `.site-name` span in the sidebar HTML |
| Review copy | `.review-slide` divs in the Reviews section |
| About copy | `.pager-page` divs in the About section |

### Known Deployment Consideration

The `browsing-topics` Permissions-Policy warning that appears in the browser console is harmless. It originates from the OpenStreetMap iframe advertising an HTTP header for a browser feature that Chrome does not recognise. It does not affect any site functionality.

---

## 5. Roadmap

The following features are planned but not yet implemented. They are listed in the recommended implementation order.

### 5.1 Gallery — Real Photography

Replace the twelve Picsum placeholder images with real photographs. Two changes are required:

- **Thumbnail HTML:** The `<img src>` attributes in the two `.gallery-page` divs (600×450 recommended dimensions)
- **Lightbox JS:** The `src` values in the `galleryImages[]` array (1200×900 recommended dimensions)

Both can be local file paths once the file split (§5.3) is complete, or hosted URLs if images are served from a CDN or image host.

### 5.2 Contact Form Backend

The contact form currently has a frontend-only submit handler that fades the form out and displays a confirmation message. No data is sent anywhere.

Two low-configuration options for a personal page:

**Formspree** — Add `action="https://formspree.io/f/{your-id}"` and `method="POST"` to the form element. Submissions arrive in your email. Free at low volume. Requires no backend code.

**EmailJS** — Call their browser SDK from the existing submit handler. Also requires no server, calls their API directly from the browser. Free tier is sufficient for personal use.

Either option can be wired in without changing any other part of the site.

### 5.3 File Split

Split `index.html` into three files:

```
index.html    — HTML structure only
style.css     — all CSS, linked via <link rel="stylesheet" href="style.css">
main.js       — all JS, linked via <script src="main.js"> at bottom of <body>
```

The `<script>` tag must remain at the bottom of `<body>` (not in `<head>`) so the DOM exists before the script queries it. The `document.fonts.ready` wrapper provides an additional safety layer regardless. No other structural changes are required.

---

*Document produced alongside the development process. For the full build history and technical decisions in context, see the conversation that produced this codebase.*
