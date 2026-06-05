import { useRef, useMemo, useEffect } from 'react'
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
