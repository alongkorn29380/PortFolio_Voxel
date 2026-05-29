import { useFrame } from "@react-three/fiber"
import { useRef, useState, useMemo } from "react"
import * as THREE from "three"

export default function Energy_Core({ nodes }) 
{

    console.log("Energy_Core nodes:", nodes)

    // Platforms
    const platforms = Object.values(nodes).filter((node) => 
        node.name.includes("Rotating_Platform")
    )

    // Stone_Slab
    const stoneSlab = Object.values(nodes).filter((node) =>
        node.name.includes("Stone_Slab") && node.isMesh
    )

    const slabWorldData = useMemo(() =>
        stoneSlab.map(slab => {
            const pos = new THREE.Vector3()
            const quat = new THREE.Quaternion()
            slab.getWorldPosition(pos)
            slab.getWorldQuaternion(quat)
            return { pos: pos.clone(), quat: quat.clone() }
        }),
    [])

    return (
        <group>
            {platforms.map((platform) => (
                <SinglePlatformItem key={platform.uuid} platform={platform} />
            ))}

            {stoneSlab.map((slab, i) => (
                <SingleStoneSlabItem key={slab.uuid} slab={slab} worldPos={slabWorldData[i].pos} worldQuat={slabWorldData[i].quat} />
            ))}
        </group>
    )
}

function SingleStoneSlabItem({ slab, worldPos, worldQuat })
{
    const groupRef = useRef()
    const baseY = worldPos.y
    const [randomOffset] = useState(() => (Math.random() - 0.3) * 0.1)
    const [phase] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) =>
    {
        if (groupRef.current) {
            groupRef.current.position.y = baseY + randomOffset + Math.sin(state.clock.elapsedTime * 1.5 + phase) * 0.2;
        }
    });

    return (
        <group ref={groupRef} position={worldPos} quaternion={worldQuat}>
            <primitive
                object={slab}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]} />
        </group>
    )
}

function SinglePlatformItem({ platform })
{
    const groupRef = useRef()
    
    const [euler] = useState(() => new THREE.Euler().copy(platform.rotation))

    useFrame((state, delta) => 
    {
        if (groupRef.current) {
            euler.y += delta * 0.5
    
            const quaternion = new THREE.Quaternion().setFromEuler(euler)
            groupRef.current.setRotationFromQuaternion(quaternion)
        }
    })

    return (
        <group ref={groupRef} position={platform.position}>
            <primitive 
                object={platform} 
                position={[0, 0, 0]} 
                rotation={[0, 0, 0]} 
            />
        </group>
    )
}