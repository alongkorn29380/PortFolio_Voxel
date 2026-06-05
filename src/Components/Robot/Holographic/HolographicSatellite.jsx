import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useControls, folder } from 'leva'
import * as THREE from 'three'

import { HolographicMaterial } from './HolographicMaterial.js'

export default function HolographicSatellite() {
    const coreRef = useRef()
    const orbit1Ref = useRef()
    const orbit2Ref = useRef()
    const orbit3Ref = useRef()

    const { color, speed, posX, posY, posZ, scale } = useControls('Hologram', {
        Satellite: folder ({
            color: '#70c1ff',
            speed: { value: 1.1, min: 0, max: 20, step: 0.1 },
            posX: { value: 5.7, min: -5, max: 20, step: 0.1 },
            posY: { value: 1.8, min: -5, max: 20, step: 0.1 },
            posZ: { value: 12.4, min: -5, max: 20, step: 0.1 },
            scale: { value: 1, min: 0.1, max: 3, step: 0.05 }
        }, { collapsed: true })
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
