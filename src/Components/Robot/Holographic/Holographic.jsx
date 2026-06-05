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
        mat.uTime = 0
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
