# Holographic Component — Design Spec
Date: 2026-06-05

## Goal
Fix `Holographic.jsx` so it works as a proper child component inside the Robot scene's existing R3F Canvas. The current file is a leftover standalone tutorial demo; it has no export, creates its own Canvas, and loads a model that is unrelated to the portfolio scene. This spec replaces all of that with a self-contained floating holographic projection.

## What Changes
- **Remove:** `Canvas`, `OrbitControls`, `SceneContent`, `Suzanne`, `useGLTF`, `useControls` for background color
- **Add:** `export default function Holographic()` — no props required
- **Keep:** existing shader files (`vertex.glsl`, `fragment.glsl`, `random2D.glsl`) — no changes needed

## Component Structure

### `Holographic()`
- Renders a `<group position={[0, 0, 0]}>` (user repositions after integration)
- Contains three meshes sharing one `HolographicMaterial` ref:
  | Object | Geometry | Notes |
  |--------|----------|-------|
  | Sphere | `sphereGeometry [0.8, 32, 32]` | slow Y rotation |
  | Ring A | `torusGeometry [1.4, 0.04, 16, 100]` | flat (`rotation.x = π/2`), orbits on X |
  | Ring B | `torusGeometry [1.8, 0.04, 16, 100]` | tilted 45° (`rotation.x = π/4`), orbits Y in reverse |

### Shared Material
- One `holographicMaterial` ref declared once, passed as `material` prop to all three meshes
- Props: `transparent`, `side={THREE.DoubleSide}`, `depthWrite={false}`, `blending={THREE.AdditiveBlending}`
- `uColor` and `uTime` uniforms driven by Leva + `useFrame`

### Animation (`useFrame`)
- `uTime` += `delta * speed` each frame
- `sphereRef.rotation.y` += `delta * 0.3`
- `ringARef.rotation.x` += `delta * 0.5`
- `ringBRef.rotation.y` -= `delta * 0.4`

### Leva Controls
Folder `'Hologram'` (collapsed by default, matching existing scene pattern):
- `color` — default `'#70c1ff'`
- `speed` — `{ value: 1.0, min: 0, max: 5, step: 0.1 }`

## Files Affected
| File | Action |
|------|--------|
| `src/Components/Robot/Holographic/Holographic.jsx` | Rewrite |
| `src/Components/Robot/Holographic/shaders/*` | No change |
| `src/Components/Robot/Robot.jsx` | No change (import already correct) |

## Out of Scope
- Repositioning the group in the scene (user does this after)
- Changes to any other Robot sub-components
- Adding/removing Leva controls from other components
