# Holographic Component Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `Holographic.jsx` from a broken standalone demo into a working R3F child component that renders a floating sphere + two orbiting holographic rings inside the existing Robot scene.

**Architecture:** One file is rewritten. The existing GLSL shaders are untouched. A single `HolographicMaterial` instance is created via `useMemo` and shared imperatively across all three meshes, avoiding the null-ref problem of the original declarative approach.

**Tech Stack:** React 19, React Three Fiber v9, Three.js 0.182, @react-three/drei, Leva, Vite + vite-plugin-glsl

---

### Task 1: Rewrite Holographic.jsx

**Files:**
- Modify: `src/Components/Robot/Holographic/Holographic.jsx` (full rewrite)

- [ ] **Step 1: Replace the entire file with the new component**

Open `src/Components/Robot/Holographic/Holographic.jsx` and replace all content with:

```jsx
import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'

import holographicVertexShader from './shaders/holographic/vertex.glsl'
import holographicFragmentShader from './shaders/holographic/fragment.glsl'

const HolographicMaterial = shaderMaterial(
    { uTime: 0, uColor: new THREE.Color('#70c1ff') },
    holographicVertexShader,
    holographicFragmentShader
)

extend({ HolographicMaterial })

export default function Holographic() {
    const sphereRef = useRef()
    const ringARef = useRef()
    const ringBRef = useRef()

    const { color, speed } = useControls('Hologram', {
        color: '#70c1ff',
        speed: { value: 1.0, min: 0, max: 5, step: 0.1 }
    }, { collapsed: true })

    const material = useMemo(() => {
        const mat = new HolographicMaterial()
        mat.transparent = true
        mat.side = THREE.DoubleSide
        mat.depthWrite = false
        mat.blending = THREE.AdditiveBlending
        return mat
    }, [])

    useFrame((_, delta) => {
        material.uTime += delta * speed
        material.uColor.set(color)

        if (sphereRef.current) sphereRef.current.rotation.y += delta * 0.3
        if (ringARef.current) ringARef.current.rotation.x += delta * 0.5
        if (ringBRef.current) ringBRef.current.rotation.y -= delta * 0.4
    })

    return (
        <group position={[0, 0, 0]}>
            <mesh ref={sphereRef} material={material}>
                <sphereGeometry args={[0.8, 32, 32]} />
            </mesh>

            <mesh ref={ringARef} rotation={[Math.PI / 2, 0, 0]} material={material}>
                <torusGeometry args={[1.4, 0.04, 16, 100]} />
            </mesh>

            <mesh ref={ringBRef} rotation={[Math.PI / 4, Math.PI / 4, 0]} material={material}>
                <torusGeometry args={[1.8, 0.04, 16, 100]} />
            </mesh>
        </group>
    )
}
```

---

### Task 2: Verify in browser

**Files:** (no changes)

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: Vite starts on `http://localhost:5173` (or similar), no compile errors.

- [ ] **Step 2: Open the app and navigate to the Robot scene**

Check that:
- No console errors about `Holographic` being undefined
- The holographic sphere and two rings appear in the scene
- The rings orbit and the sphere rotates smoothly
- The `Hologram` folder appears in the Leva panel
- Changing `color` and `speed` in Leva updates the effect in real time

- [ ] **Step 3: Stop the dev server** (`Ctrl+C`)

---

### Task 3: Commit

**Files:** (no changes beyond Task 1)

- [ ] **Step 1: Stage and commit**

```bash
git add src/Components/Robot/Holographic/Holographic.jsx
git commit -m "fix: rewrite Holographic as proper R3F child component

Replace standalone Canvas demo with a self-contained floating
holographic projection (sphere + 2 orbiting rings) that works
inside the existing Robot scene Canvas.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

Expected: commit succeeds with 1 file changed.
