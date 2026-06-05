# Halftone Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two broken Halftone files — a typo + missing shader args in `HalftoneMaterial.js`, and a full rewrite of `HalftoneCube.jsx` which was a broken copy-paste from HolographicCosmic.

**Architecture:** `HalftoneMaterial.js` is a minimal fix (two lines). `HalftoneCube.jsx` is rewritten from scratch as a single icosahedron with halftone lighting — no time animation, rotation driven by `delta * speed`, `uResolution` kept in sync with canvas size via `useThree().size`.

**Tech Stack:** React 19, React Three Fiber v9, Three.js 0.182, @react-three/drei (shaderMaterial), Leva, Vite + vite-plugin-glsl

---

### Task 1: Fix HalftoneMaterial.js

**Files:**
- Modify: `src/Components/Robot/Halftone/HalftoneMaterial.js`

- [ ] **Step 1: Replace the file**

Write `src/Components/Robot/Halftone/HalftoneMaterial.js` with this exact content:

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

Changes from original:
- Line 6: `fagment.glsl` → `fragment.glsl`
- `shaderMaterial(uniforms)` → `shaderMaterial(uniforms, halftoneVertexShader, halftoneFragmentShader)`

- [ ] **Step 2: Commit**

```bash
git add src/Components/Robot/Halftone/HalftoneMaterial.js
git commit -m "fix: correct shader import typo and pass shaders to HalftoneMaterial"
```

---

### Task 2: Rewrite HalftoneCube.jsx

**Files:**
- Modify: `src/Components/Robot/Halftone/HalftoneCube.jsx`

- [ ] **Step 1: Replace the file**

Write `src/Components/Robot/Halftone/HalftoneCube.jsx` with this exact content:

```jsx
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'

import { HalftoneMaterial } from './HalftoneMaterial.js'

export default function HalftoneCube() {
    const meshRef = useRef()
    const { size } = useThree()

    const {
        color, shadowColor, lightColor,
        shadowRepetitions, lightRepetitions,
        speed, posX, posY, posZ, scale
    } = useControls('Halftone', {
        color: '#ff794d',
        shadowColor: '#8e19b8',
        lightColor: '#e5ffe0',
        shadowRepetitions: { value: 100, min: 1, max: 300, step: 1 },
        lightRepetitions: { value: 130, min: 1, max: 300, step: 1 },
        speed: { value: 0.5, min: 0, max: 5, step: 0.1 },
        posX: { value: 11.1, min: -5, max: 20, step: 0.1 },
        posY: { value: 1.8, min: -5, max: 20, step: 0.1 },
        posZ: { value: 10.7, min: -5, max: 20, step: 0.1 },
        scale: { value: 1, min: 0.1, max: 3, step: 0.05 }
    }, { collapsed: true })

    const material = useMemo(() => new HalftoneMaterial(), [])

    useEffect(() => {
        material.uResolution.set(size.width, size.height)
    }, [material, size])

    useEffect(() => {
        return () => material.dispose()
    }, [material])

    useFrame((_, delta) => {
        material.uColor.set(color)
        material.uShadowColor.set(shadowColor)
        material.uLightColor.set(lightColor)
        material.uShadowRepetitions = shadowRepetitions
        material.uLightRepetitions = lightRepetitions

        if (meshRef.current) meshRef.current.rotation.y += delta * speed
    })

    return (
        <group position={[posX, posY, posZ]} scale={scale}>
            <mesh ref={meshRef} material={material}>
                <icosahedronGeometry args={[1, 1]} />
            </mesh>
        </group>
    )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/Components/Robot/Halftone/HalftoneCube.jsx
git commit -m "fix: rewrite HalftoneCube as icosahedron with halftone lighting"
```

---

### Task 3: Verify in browser (manual)

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: Vite starts with no compile errors.

- [ ] **Step 2: Check in browser**

Verify:
- No console errors about HalftoneMaterial or HalftoneCube
- `Halftone` folder appears in Leva panel (collapsed)
- Halftone dot pattern visible on the icosahedron faces
- `shadowRepetitions` and `lightRepetitions` sliders visibly change the dot density
- `color`, `shadowColor`, `lightColor` pickers change the material colors
- `posX/Y/Z` and `scale` reposition/resize the object
- Mesh rotates slowly on Y axis

- [ ] **Step 3: Stop the dev server** (`Ctrl+C`)
