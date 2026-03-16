import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useTime } from '../Context/TimeContext.jsx'

export default function Lamp({ nodes }) {
    const { timeRef } = useTime()
    
    const lampNodes = useMemo(() => {
        return Object.values(nodes).filter((node) => 
            node.type === "Mesh" && node.name.startsWith("Lamp_Glass")
        )
    }, [nodes])

    return (
        <>
            {lampNodes.map((node, index) => (
                <SingleLamp key={node.uuid} node={node} timeRef={timeRef} />
            ))}
        </>
    )
}

function SingleLamp({ node, timeRef }) {
    const materialRef = useRef()
    const sparklesRef = useRef()

    useFrame((state, delta) => {
        if (!materialRef.current) return

        const time = timeRef.current || 0
        const isNight = time > 0.70 || time < 0.30

        const targetIntensity = isNight ? 5 : 0
        materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
            materialRef.current.emissiveIntensity,
            targetIntensity,
            delta * 5
        )

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

            <Sparkles 
                ref={sparklesRef}
                count={20}
                position={[0, 3.5, 0]} 
                scale={[2, 2, 2]} 
                size={4}
                speed={0.5}
                color="#e4af02" 
            />
        </group>
    )
}