import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useTime } from '../Context/TimeContext.jsx'

export default function Bridge( { nodes })
{
    const { timeRef } = useTime()   

    const lightNodes = useMemo(() => {
        return Object.values(nodes).filter((node) => 
            node.type === "Mesh" && node.name.startsWith("Bridge_Glass")
        )
    }, [nodes])

    return (
        <>
            {lightNodes.map((node, index) => (
                <SingleLamp key={node.uuid} node={node} timeRef={timeRef} />
            ))}
        </>
    )
}

function SingleLamp({ node, timeRef })
{
    const materialRef = useRef()
    const sparklesRef = useRef()
    const lightRef = useRef()   

    useFrame((state, delta) => 
    {
        if (!materialRef.current) return

        const time = timeRef.current || 0
        const isNight = time > 0.70 || time < 0.30  

        const targetEmissive = isNight ? 5 : 0
        materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
            materialRef.current.emissiveIntensity,
            targetEmissive,
            delta * 5
        )

        if (lightRef.current) {
            const targetLightIntensity = isNight ? 1 : 0 
            lightRef.current.intensity = THREE.MathUtils.lerp(
                lightRef.current.intensity,
                targetLightIntensity,
                delta * 5
            )
        }
        
        if (sparklesRef.current) {
            sparklesRef.current.visible = isNight
        }
    })

    return (
        <group position={node.position}>

            <mesh 
                geometry={node.geometry} 
                scale={node.scale}
                rotation={node.rotation} 
            >
                <meshStandardMaterial 
                    ref={materialRef}
                    color={[1.5, 1.2, 0]} 
                    emissive="#e4af02" 
                    emissiveIntensity={0} 
                    toneMapped={false} 
                />
            </mesh>

            <pointLight 
                ref={lightRef}
                position={[0, 3.5, 0]} 
                color="#e4af02" 
                distance={30} 
                decay={1} 
                intensity={0} 
            />

            <Sparkles 
                ref={sparklesRef}
                count={5}
                position={[0, 2, 0]} 
                scale={[1, 1, 1]} 
                size={4}
                speed={0.5}
                color="#e4af02" 
            />
        </group>
    )
}