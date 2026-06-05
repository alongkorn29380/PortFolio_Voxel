# Halftone Fix — Design Spec
Date: 2026-06-05

## Goal
Fix two broken files in the Halftone system: `HalftoneMaterial.js` (typo + missing shader args) and `HalftoneCube.jsx` (copy-paste disaster from HolographicCosmic — missing material, undeclared refs, wrong uniforms). Result: a working single icosahedron rendered with the halftone lighting shader.

## Files Affected

| File | Action |
|------|--------|
| `src/Components/Robot/Halftone/HalftoneMaterial.js` | Fix typo + missing shader arguments |
| `src/Components/Robot/Halftone/HalftoneCube.jsx` | Full rewrite |

Shaders are **not changed**.

---

## `HalftoneMaterial.js` Fixes

1. **Typo**: line 6 `fagment.glsl` → `fragment.glsl`
2. **Missing shaders**: `shaderMaterial(uniforms)` → `shaderMaterial(uniforms, halftoneVertexShader, halftoneFragmentShader)`

Final correct form:
```js
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

import halftoneVertexShader from './shaders/halftone/vertex.glsl'
import halftoneFragmentShader from './shaders/halftone/fragment.glsl'

const HalftoneMaterial = shaderMaterial(
    {
        uColor: new THREE.Color('#ff794d'),
        uShadeColor: new THREE.Color('#26132f'),
        uResolution: new THREE.Vector2(0, 0),
        uShadowRepetitions: 100,
        uShadowColor: new THREE.Color('#8e19b8'),
        uLightRepetitions: 130,
        uLightColor: new THREE.Color('#e5ffe0')
    },
    halftoneVertexShader,
    halftoneFragmentShader
)

extend({ HalftoneMaterial })

export { HalftoneMaterial }
```

---

## `HalftoneCube.jsx` Rewrite

### Geometry
Single `icosahedronGeometry [1, 1]` — angular faces show the halftone lighting facets well.

### Material
- Created via `useMemo` → `new HalftoneMaterial()`
- `uResolution` set via `useThree().size` in a `useEffect` that re-runs when canvas size changes — required for the halftone dot grid to scale correctly
- `useEffect` disposes material on unmount

### Animation (`useFrame`)
- `mesh.rotation.y += delta * speed` — slow rotation shows the halftone effect across all faces
- `material.uColor.set(color)`
- `material.uShadowColor.set(shadowColor)`
- `material.uLightColor.set(lightColor)`
- `material.uShadowRepetitions = shadowRepetitions`
- `material.uLightRepetitions = lightRepetitions`

### Leva Controls — folder `'Halftone'` (collapsed)
| Control | Default | Range |
|---------|---------|-------|
| `color` | `'#ff794d'` | — |
| `shadowColor` | `'#8e19b8'` | — |
| `lightColor` | `'#e5ffe0'` | — |
| `shadowRepetitions` | 100 | min 1, max 300, step 1 |
| `lightRepetitions` | 130 | min 1, max 300, step 1 |
| `speed` | 0.5 | min 0, max 5, step 0.1 |
| `posX` | 11.1 | min -5, max 20, step 0.1 |
| `posY` | 1.8 | min -5, max 20, step 0.1 |
| `posZ` | 10.7 | min -5, max 20, step 0.1 |
| `scale` | 1 | min 0.1, max 3, step 0.05 |

### Export
`export default function HalftoneCube()` — no props.

Root element: `<group position={[posX, posY, posZ]} scale={scale}>` wrapping a single `<mesh>`.

---

## Out of Scope
- Adding `HalftoneCube` to `Robot.jsx` (it may already be wired up elsewhere, or user will do it)
- Changing any shader files
- Changing `uShadeColor` (it's in the material uniforms but the fragment shader doesn't use it — left as-is)
