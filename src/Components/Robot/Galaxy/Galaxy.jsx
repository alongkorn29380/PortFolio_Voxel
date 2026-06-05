import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'

import galaxyVertexShader from './shaders/vertex.glsl'
import galaxyFragmentShader from './shaders/fragment.glsl'

const GalaxyMaterial = shaderMaterial(
    {
        uTime: 0,
        uSize: 30,
    },
    galaxyVertexShader,
    galaxyFragmentShader
)

extend({ GalaxyMaterial })

export default function Galaxy()
{
    const materialRef = useRef()

    const { count, radius, branches, randomness, randomnessPower, insideColor, outsideColor } = useControls('Galaxy', {
        count: { value: 200000, min: 100, max: 1000000, step: 100 },
        radius: { value: 5, min: 0.01, max: 20, step: 0.01 },
        branches: { value: 3, min: 2, max: 20, step: 1 },
        randomness: { value: 0.2, min: 0, max: 2, step: 0.001 },
        randomnessPower: { value: 3, min: 1, max: 10, step: 0.001 },
        insideColor: '#ff6030',
        outsideColor: '#1b3984',
    }, { collapsed: true })

    // Create Galaxy
    const [positions, randomnessArray, colors, scales] = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const randomnessArray = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const scales = new Float32Array(count)

        const colorInside = new THREE.Color(insideColor)
        const colorOutside = new THREE.Color(outsideColor)

        for(let i = 0; i < count; i++) {
            const i3 = i * 3

            // Position
            const particleRadius = Math.random() * radius
            const branchAngle = ((i % branches) / branches) * Math.PI * 2

            positions[i3    ] = Math.cos(branchAngle) * particleRadius
            positions[i3 + 1] = 0
            positions[i3 + 2] = Math.sin(branchAngle) * particleRadius

            // Randomness
            const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * particleRadius
            const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * particleRadius
            const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * particleRadius

            randomnessArray[i3]     = randomX
            randomnessArray[i3 + 1] = randomY
            randomnessArray[i3 + 2] = randomZ

            // Color
            const mixedColor = colorInside.clone()
            mixedColor.lerp(colorOutside, particleRadius / radius)

            colors[i3]     = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b

            // Scale
            scales[i] = Math.random()
        }
        return [positions, randomnessArray, colors, scales]
    }, [count, radius, branches, randomness, randomnessPower, insideColor, outsideColor])

    useFrame((state) => {
        if (materialRef.current) materialRef.current.uTime = state.clock.getElapsedTime()
    })

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-aRandomness" args={[randomnessArray, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
            </bufferGeometry>
            
            {/* เรียกใช้งาน Custom Material ที่เราลงทะเบียนไว้ด้วยชื่อ camelCase */}
            <galaxyMaterial
                ref={materialRef}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors={true}
                uSize={30 * window.devicePixelRatio}
            />
        </points>
    )
}