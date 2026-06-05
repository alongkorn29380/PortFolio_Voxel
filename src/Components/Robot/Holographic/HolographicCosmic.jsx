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
