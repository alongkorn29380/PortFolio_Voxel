# Holographic Variants Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add position/scale Leva controls to the existing Holographic component and create two new holographic variants — a satellite cluster and a cosmic cone — all sharing a single extracted material module.

**Architecture:** Extract `HolographicMaterial` into a shared `HolographicMaterial.js` module so `extend()` is called exactly once. Each component owns its own material instance via `useMemo` for independent color/time control. Orbit animations use rotating parent groups with child meshes offset on X — no manual trig needed.

**Tech Stack:** React 19, React Three Fiber v9, Three.js 0.182, @react-three/drei (shaderMaterial), Leva, Vite + vite-plugin-glsl

---

### Task 1: Create shared HolographicMaterial module

**Files:**
- Create: `src/Components/Robot/Holographic/HolographicMaterial.js`

- [ ] **Step 1: Create the file**

Write `src/Components/Robot/Holographic/HolographicMaterial.js` with this exact content:

```js
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

import holographicVertexShader from './shaders/holographic/vertex.glsl'
import holographicFragmentShader from './shaders/holographic/fragment.glsl'

const HolographicMaterial = shaderMaterial(
    { uTime: 0, uColor: new THREE.Color('#70c1ff') },
    holographicVertexShader,
    holographicFragmentShader
)

extend({ HolographicMaterial })

export { HolographicMaterial }
```

- [ ] **Step 2: Commit**

```bash
git add src/Components/Robot/Holographic/HolographicMaterial.js
git commit -m "feat: extract HolographicMaterial into shared module"
```

---

### Task 2: Update Holographic.jsx — shared material + position/scale controls

**Files:**
- Modify: `src/Components/Robot/Holographic/Holographic.jsx`

- [ ] **Step 1: Replace the entire file**

Write `src/Components/Robot/Holographic/Holographic.jsx` with this exact content:

```jsx
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'

import { HolographicMaterial } from './HolographicMaterial.js'

export default function Holographic() {
    const sphereRef = useRef()
    const ringARef = useRef()
    const ringBRef = useRef()

    const { color, speed, posX, posY, posZ, scale } = useControls('Hologram', {
        color: '#70c1ff',
        speed: { value: 1.0, min: 0, max: 5, step: 0.1 },
        posX: { value: 0, min: -5, max: 5, step: 0.1 },
        posY: { value: 0, min: -5, max: 5, step: 0.1 },
        posZ: { value: 0, min: -5, max: 5, step: 0.1 },
        scale: { value: 1, min: 0.1, max: 3, step: 0.05 }
    }, { collapsed: true })

    const material = useMemo(() => {
        const mat = new HolographicMaterial()
        mat.transparent = true
        mat.side = THREE.DoubleSide
        mat.depthWrite = false
        mat.blending = THREE.AdditiveBlending
        return mat
    }, [])

    useEffect(() => {
        return () => material.dispose()
    }, [material])

    useFrame((_, delta) => {
        material.uTime = (material.uTime + delta * speed) % (Math.PI * 2000)
        material.uColor.set(color)

        if (sphereRef.current) sphereRef.current.rotation.y += delta * 0.3
        if (ringARef.current) ringARef.current.rotation.x += delta * 0.5
        if (ringBRef.current) ringBRef.current.rotation.y -= delta * 0.4
    })

    return (
        <group position={[posX, posY, posZ]} scale={scale}>
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

Key changes from previous version:
- Removed `shaderMaterial`, `extend`, shader imports — replaced by `import { HolographicMaterial } from './HolographicMaterial.js'`
- Removed `extend` import from `@react-three/fiber`
- Added `posX`, `posY`, `posZ`, `scale` to Leva controls
- Root `<group>` now uses `position={[posX, posY, posZ]} scale={scale}`

- [ ] **Step 2: Commit**

```bash
git add src/Components/Robot/Holographic/Holographic.jsx
git commit -m "feat: add position/scale Leva controls to Holographic"
```

---

### Task 3: Create HolographicSatellite.jsx

**Files:**
- Create: `src/Components/Robot/Holographic/HolographicSatellite.jsx`

- [ ] **Step 1: Create the file**

Write `src/Components/Robot/Holographic/HolographicSatellite.jsx` with this exact content:

```jsx
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'

import { HolographicMaterial } from './HolographicMaterial.js'

export default function HolographicSatellite() {
    const coreRef = useRef()
    const orbit1Ref = useRef()
    const orbit2Ref = useRef()
    const orbit3Ref = useRef()

    const { color, speed, posX, posY, posZ, scale } = useControls('Hologram Satellite', {
        color: '#70c1ff',
        speed: { value: 1.0, min: 0, max: 5, step: 0.1 },
        posX: { value: 0, min: -5, max: 5, step: 0.1 },
        posY: { value: 0, min: -5, max: 5, step: 0.1 },
        posZ: { value: 0, min: -5, max: 5, step: 0.1 },
        scale: { value: 1, min: 0.1, max: 3, step: 0.05 }
    }, { collapsed: true })

    const material = useMemo(() => {
        const mat = new HolographicMaterial()
        mat.transparent = true
        mat.side = THREE.DoubleSide
        mat.depthWrite = false
        mat.blending = THREE.AdditiveBlending
        return mat
    }, [])

    useEffect(() => {
        return () => material.dispose()
    }, [material])

    useFrame((_, delta) => {
        material.uTime = (material.uTime + delta * speed) % (Math.PI * 2000)
        material.uColor.set(color)

        if (coreRef.current) coreRef.current.rotation.y += delta * 0.4
        if (orbit1Ref.current) orbit1Ref.current.rotation.x += delta * 0.6
        if (orbit2Ref.current) orbit2Ref.current.rotation.y += delta * 0.9
        if (orbit3Ref.current) orbit3Ref.current.rotation.z -= delta * 0.5
    })

    return (
        <group position={[posX, posY, posZ]} scale={scale}>
            <mesh ref={coreRef} material={material}>
                <boxGeometry args={[0.6, 0.6, 0.6]} />
            </mesh>

            <group ref={orbit1Ref}>
                <mesh position={[1.2, 0, 0]} material={material}>
                    <boxGeometry args={[0.2, 0.2, 0.2]} />
                </mesh>
            </group>

            <group ref={orbit2Ref}>
                <mesh position={[1.5, 0, 0]} material={material}>
                    <boxGeometry args={[0.2, 0.2, 0.2]} />
                </mesh>
            </group>

            <group ref={orbit3Ref}>
                <mesh position={[1.8, 0, 0]} material={material}>
                    <boxGeometry args={[0.2, 0.2, 0.2]} />
                </mesh>
            </group>
        </group>
    )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/Components/Robot/Holographic/HolographicSatellite.jsx
git commit -m "feat: add HolographicSatellite component"
```

---

### Task 4: Create HolographicCosmic.jsx

**Files:**
- Create: `src/Components/Robot/Holographic/HolographicCosmic.jsx`

- [ ] **Step 1: Create the file**

Write `src/Components/Robot/Holographic/HolographicCosmic.jsx` with this exact content:

```jsx
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'

import { HolographicMaterial } from './HolographicMaterial.js'

export default function HolographicCosmic() {
    const coreRef = useRef()
    const orbit1Ref = useRef()
    const orbit2Ref = useRef()
    const orbit3Ref = useRef()
    const orbit4Ref = useRef()

    const { color, speed, posX, posY, posZ, scale } = useControls('Hologram Cosmic', {
        color: '#70c1ff',
        speed: { value: 1.0, min: 0, max: 5, step: 0.1 },
        posX: { value: 0, min: -5, max: 5, step: 0.1 },
        posY: { value: 0, min: -5, max: 5, step: 0.1 },
        posZ: { value: 0, min: -5, max: 5, step: 0.1 },
        scale: { value: 1, min: 0.1, max: 3, step: 0.05 }
    }, { collapsed: true })

    const material = useMemo(() => {
        const mat = new HolographicMaterial()
        mat.transparent = true
        mat.side = THREE.DoubleSide
        mat.depthWrite = false
        mat.blending = THREE.AdditiveBlending
        return mat
    }, [])

    useEffect(() => {
        return () => material.dispose()
    }, [material])

    useFrame((_, delta) => {
        material.uTime = (material.uTime + delta * speed) % (Math.PI * 2000)
        material.uColor.set(color)

        if (coreRef.current) {
            coreRef.current.rotation.y += delta * 0.25
            coreRef.current.rotation.x += delta * 0.1
        }
        if (orbit1Ref.current) orbit1Ref.current.rotation.x += delta * 1.1
        if (orbit2Ref.current) orbit2Ref.current.rotation.y += delta * 0.7
        if (orbit3Ref.current) orbit3Ref.current.rotation.z += delta * 0.8
        if (orbit4Ref.current) orbit4Ref.current.rotation.y -= delta * 0.4
    })

    return (
        <group position={[posX, posY, posZ]} scale={scale}>
            <mesh ref={coreRef} material={material}>
                <coneGeometry args={[0.5, 1.2, 8]} />
            </mesh>

            <group ref={orbit1Ref}>
                <mesh position={[1.0, 0, 0]} material={material}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                </mesh>
            </group>

            <group ref={orbit2Ref}>
                <mesh position={[1.5, 0, 0]} material={material}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                </mesh>
            </group>

            <group ref={orbit3Ref}>
                <mesh position={[1.8, 0, 0]} material={material}>
                    <sphereGeometry args={[0.12, 16, 16]} />
                </mesh>
            </group>

            <group ref={orbit4Ref} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
                <mesh position={[2.2, 0, 0]} material={material}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                </mesh>
            </group>
        </group>
    )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/Components/Robot/Holographic/HolographicCosmic.jsx
git commit -m "feat: add HolographicCosmic component"
```

---

### Task 5: Update Robot.jsx

**Files:**
- Modify: `src/Components/Robot/Robot.jsx`

- [ ] **Step 1: Replace the file**

Write `src/Components/Robot/Robot.jsx` with this exact content:

```jsx
import RobotBushes from './RobotBushes.jsx'
import RobotTree from './RobotTrees.jsx'
import Sensor from './Sensor.jsx'
import Holographic from './Holographic/Holographic.jsx'
import HolographicSatellite from './Holographic/HolographicSatellite.jsx'
import HolographicCosmic from './Holographic/HolographicCosmic.jsx'

export default function Robot({ nodes })
{
    return (
        <>
            <RobotBushes nodes={ nodes } />
            <RobotTree nodes={ nodes } />
            <Sensor nodes={ nodes } />
            <Holographic />
            <HolographicSatellite />
            <HolographicCosmic />
        </>
    )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/Components/Robot/Robot.jsx
git commit -m "feat: add HolographicSatellite and HolographicCosmic to Robot scene"
```

---

### Task 6: Verify in browser (manual)

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: Vite starts with no compile errors.

- [ ] **Step 2: Check in browser**

Verify:
- No console errors
- Three distinct holographic projections visible in the Robot scene
- `Hologram`, `Hologram Satellite`, `Hologram Cosmic` folders in the Leva panel (all collapsed by default)
- Each folder's `posX/Y/Z` and `scale` sliders reposition/resize their object independently
- Each folder's `color` and `speed` controls affect only their own object

- [ ] **Step 3: Stop the dev server** (`Ctrl+C`)
