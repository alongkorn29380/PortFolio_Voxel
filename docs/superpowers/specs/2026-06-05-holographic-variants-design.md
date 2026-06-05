# Holographic Variants — Design Spec
Date: 2026-06-05

## Goal
Extend the holographic system with: (1) position + scale Leva controls on the existing component, (2) two new holographic variant components — a satellite cluster and a cosmic cone — sharing the same custom shader material.

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/Components/Robot/Holographic/HolographicMaterial.js` | **Create** | Defines + extends `HolographicMaterial` once for all components |
| `src/Components/Robot/Holographic/Holographic.jsx` | **Modify** | Add position/scale Leva controls; import from shared material |
| `src/Components/Robot/Holographic/HolographicSatellite.jsx` | **Create** | Cube + 3 orbiting cubes variant |
| `src/Components/Robot/Holographic/HolographicCosmic.jsx` | **Create** | Cone + 4 scattered orbiting spheres variant |
| `src/Components/Robot/Robot.jsx` | **Modify** | Add `<HolographicSatellite />` and `<HolographicCosmic />` |

Shaders (`shaders/holographic/vertex.glsl`, `fragment.glsl`, `includes/random2D.glsl`) are **not changed**.

---

## Shared Material — `HolographicMaterial.js`

Exports the `HolographicMaterial` class created with drei's `shaderMaterial`. Calls `extend({ HolographicMaterial })` at module level so it only happens once regardless of how many components import it.

```js
// exports: HolographicMaterial (class)
// side-effects: extend({ HolographicMaterial }) called once at module load
```

Uniforms: `{ uTime: 0, uColor: new THREE.Color('#70c1ff') }`

---

## Updated `Holographic.jsx`

### Changes
- Remove local `shaderMaterial` + `extend` — import `HolographicMaterial` from `./HolographicMaterial.js` instead
- Add to `'Hologram'` Leva folder (collapsed):
  - `posX`: `{ value: 0, min: -5, max: 5, step: 0.1 }`
  - `posY`: `{ value: 0, min: -5, max: 5, step: 0.1 }`
  - `posZ`: `{ value: 0, min: -5, max: 5, step: 0.1 }`
  - `scale`: `{ value: 1, min: 0.1, max: 3, step: 0.05 }`
- Root group: `<group position={[posX, posY, posZ]} scale={scale}>`
- All other logic unchanged

---

## `HolographicSatellite.jsx`

### Geometry
| Object | Type | Args | Notes |
|--------|------|------|-------|
| Core | `boxGeometry` | `[0.6, 0.6, 0.6]` | slow Y rotation |
| Orbit 1 | `boxGeometry` | `[0.2, 0.2, 0.2]` | inside group at `position=[1.2, 0, 0]`, group orbits X |
| Orbit 2 | `boxGeometry` | `[0.2, 0.2, 0.2]` | inside group at `position=[1.5, 0, 0]`, group orbits Y faster |
| Orbit 3 | `boxGeometry` | `[0.2, 0.2, 0.2]` | inside group at `position=[1.8, 0, 0]`, group orbits Z reverse |

Orbiting pattern: each orbit uses a parent `<group ref={orbitRefN}>` that rotates; the child mesh is offset on X by the orbit radius. This produces circular orbit without manual trig.

### Leva Folder: `'Hologram Satellite'` (collapsed)
- `color`: default `'#70c1ff'`
- `speed`: `{ value: 1.0, min: 0, max: 5, step: 0.1 }`
- `posX`, `posY`, `posZ`: `{ value: 0, min: -5, max: 5, step: 0.1 }`
- `scale`: `{ value: 1, min: 0.1, max: 3, step: 0.05 }`

### Animation (`useFrame`, delta-based)
- `material.uTime = (material.uTime + delta * speed) % (Math.PI * 2000)`
- `material.uColor.set(color)`
- Core: `rotation.y += delta * 0.4`
- Orbit 1 group: `rotation.x += delta * 0.6`
- Orbit 2 group: `rotation.y += delta * 0.9`
- Orbit 3 group: `rotation.z -= delta * 0.5`

### Material
Own `useMemo` instance of `HolographicMaterial` — same props as original: `transparent`, `DoubleSide`, `depthWrite=false`, `AdditiveBlending`. `useEffect` disposes on unmount.

---

## `HolographicCosmic.jsx`

### Geometry
| Object | Type | Args | Notes |
|--------|------|------|-------|
| Core | `coneGeometry` | `[0.5, 1.2, 8]` | slow Y + slight X rotation |
| Sphere 1 | `sphereGeometry` | `[0.15, 16, 16]` | orbit group radius 1.0, orbits X fast |
| Sphere 2 | `sphereGeometry` | `[0.2, 16, 16]` | orbit group radius 1.5, orbits Y medium |
| Sphere 3 | `sphereGeometry` | `[0.12, 16, 16]` | orbit group radius 1.8, orbits Z |
| Sphere 4 | `sphereGeometry` | `[0.1, 16, 16]` | orbit group radius 2.2, group pre-tilted `[π/4, 0, π/6]`, orbits Y slow |

Same orbit pattern as Satellite (parent group rotates, child offset on X).

### Leva Folder: `'Hologram Cosmic'` (collapsed)
- `color`: default `'#70c1ff'`
- `speed`: `{ value: 1.0, min: 0, max: 5, step: 0.1 }`
- `posX`, `posY`, `posZ`: `{ value: 0, min: -5, max: 5, step: 0.1 }`
- `scale`: `{ value: 1, min: 0.1, max: 3, step: 0.05 }`

### Animation (`useFrame`, delta-based)
- `material.uTime = (material.uTime + delta * speed) % (Math.PI * 2000)`
- `material.uColor.set(color)`
- Core: `rotation.y += delta * 0.25`, `rotation.x += delta * 0.1`
- Sphere 1 group: `rotation.x += delta * 1.1`
- Sphere 2 group: `rotation.y += delta * 0.7`
- Sphere 3 group: `rotation.z += delta * 0.8`
- Sphere 4 group: `rotation.y -= delta * 0.4`

### Material
Own `useMemo` instance — same setup as Satellite. `useEffect` disposes on unmount.

---

## Updated `Robot.jsx`

```jsx
import HolographicSatellite from './Holographic/HolographicSatellite.jsx'
import HolographicCosmic from './Holographic/HolographicCosmic.jsx'

// add to JSX:
<HolographicSatellite />
<HolographicCosmic />
```

---

## Out of Scope
- Changing any shader files
- Sharing a single material instance across all three holographic components (each owns its own for independent color/time control)
- Repositioning any component in the scene (user adjusts via Leva after)
