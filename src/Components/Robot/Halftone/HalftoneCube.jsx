import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls, folder } from 'leva'

import { HalftoneMaterial } from './HalftoneMaterial.js'

export default function HalftoneCube() {
    const meshRef = useRef()
    const { size } = useThree()

    const {
        color, shadowColor, lightColor,
        shadowRepetitions, lightRepetitions,
        speed, posX, posY, posZ, scale
    } = useControls('Halftone', {
        Cube: folder ({
            color: '#ff794d',
            shadowColor: '#8e19b8',
            lightColor: '#e5ffe0',
            shadowRepetitions: { value: 100, min: 1, max: 300, step: 1 },
            lightRepetitions: { value: 130, min: 1, max: 300, step: 1 },
            speed: { value: 0.5, min: 0, max: 5, step: 0.1 },
            posX: { value: -7.5, min: -20, max: 20, step: 0.1 },
            posY: { value: 1.8, min: -20, max: 20, step: 0.1 },
            posZ: { value: 12.4, min: -20, max: 20, step: 0.1 },
            scale: { value: 1, min: 0.1, max: 3, step: 0.05 }
        }, { collapsed: true })
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
                <boxGeometry args={[1, 1, 1]} />
            </mesh>
        </group>
    )
}
