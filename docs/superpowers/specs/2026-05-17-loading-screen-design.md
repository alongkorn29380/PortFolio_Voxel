# Loading Screen Design

**Date:** 2026-05-17
**Status:** Approved

## Problem

When the site opens, Three.js begins loading large GLB models and textures while the physics world simultaneously starts simulating. The player character (`Chibi.glb`) spawns before `Terrain.glb` has finished loading, causing it to fall through the floor. There is also no visual feedback during the cold-load delay.

## Solution Overview

Add a fullscreen loading screen that:
1. Overlays the `<Canvas>` while assets load, tracking real progress via `useProgress`
2. Activates two entry buttons only when all assets are fully loaded
3. Defers spawning `<Player>` until the user clicks Enter — so the terrain is guaranteed to be in memory before physics begins

## Visual Design

**Style:** Lowpoly — geometric SVG polygon terrain in the background (dark greens, deep teal water, night sky).

**Layout (centered card, semi-transparent):**
```
[ ◇ diamond icon ]
  PORTFOLIO
  ─────────────────
  Loading world...
  [====75%========  ]    ← progress bar, disappears on complete
  [ ♪ Explore with Music ]  [ 🔇 Explore in Silence ]
                             ↑ disabled (greyed) until progress = 100%
```

On click: loading screen fades out (CSS opacity transition), canvas becomes fully visible.

## Architecture

### State — `src/index.jsx`

Two new state variables at the root:

```js
const [entered, setEntered] = useState(false)
const [musicEnabled, setMusicEnabled] = useState(false)
```

The `<LoadingScreen>` and `<Canvas>` are both rendered from the start. The loading screen sits on top via `position: fixed; z-index: 100`. When the user clicks Enter, `entered` flips to `true` and the screen unmounts.

### Asset loading — why Canvas mounts immediately

`useProgress` (from `@react-three/drei`) hooks into Three.js's global `DefaultLoadingManager`. It only sees load events from assets that have actually been requested. The canvas must be mounted (even if visually hidden behind the overlay) so that `useGLTF` calls inside `<Terrain>` and `<Player>` fire and are tracked.

### Preventing fall-through — conditional Player render

`<Player>` is only added to the scene after `entered === true`. By that point `useProgress` has confirmed all assets are done — `Terrain.glb` is in memory and its `RigidBody` is ready. The player spawns into a solid world.

```jsx
// Experience.jsx receives `entered` prop
<Physics>
  {entered && <Player position={[2, 2, 5]} cameraActive={!debugcamera} />}
  <Suspense fallback={null}>
    <Terrain />
  </Suspense>
</Physics>
```

### New component — `src/Components/LoadingScreen/LoadingScreen.jsx`

Props:
- `onEnter(musicEnabled: boolean)` — called when user clicks either button

Internals:
- `useProgress()` → `{ progress, active }` — drives the progress bar and button disabled state
- Local state: `fading` (bool) — triggers CSS fade-out on click before calling `onEnter` (fade duration: 600ms)
- Renders a full-viewport `div` with the lowpoly SVG background and centered card

### Music behavior

`musicEnabled` is passed from `index.jsx` → `Experience` → `Animals.jsx`. The animal ambient sounds (`public/Sounds/Animals/`) respect this flag. No background music track exists yet; the flag is wired to ambient sounds only and is ready to accept a background track later.

## Files Changed

| File | Change |
|------|--------|
| `src/index.jsx` | Add `entered` + `musicEnabled` state; render `<LoadingScreen>`; pass `entered` + `musicEnabled` to `<Experience>` |
| `src/Experience.jsx` | Accept `entered` + `musicEnabled` props; wrap `<Player>` in `{entered && ...}` |
| `src/Components/LoadingScreen/LoadingScreen.jsx` | New file — full loading screen UI |
| `src/Components/Forest/Animals.jsx` | Accept + respect `musicEnabled` prop |
| `src/style.css` | Add fade-out keyframe for loading screen transition |

## Out of Scope

- Background music track (no audio file exists; wiring is ready for it)
- Fancy particle or animation effects on the loading screen beyond CSS transitions
- Per-biome loading tips or splash art
