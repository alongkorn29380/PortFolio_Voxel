import * as THREE from 'three'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

const FIRE_COLORS = [
    new THREE.Color('#ffffff'), 
    new THREE.Color('#ffdd00'), 
    new THREE.Color('#ff5500'), 
    new THREE.Color('#ff0000'), 
    new THREE.Color('#222222'), 
]

export default function Fire({ nodes }) {
    const fireSpawns = useMemo(() => {
        return Object.values(nodes).filter((node) => 
            node.type === "Mesh" && (node.name.startsWith("Fire") || node.name.startsWith("Spawn_Fire"))
        )
    }, [nodes])

    useEffect(() => {
        fireSpawns.forEach((node) => {
            node.visible = false
        })
    }, [fireSpawns])

    return (
        <>
            {fireSpawns.map((node) => (
                <SingleFire key={node.uuid} node={node} count={50} />
            ))}
        </>
    )
}

function SingleFire({ node, count = 50 }) {
    const meshRef = useRef()
    
    const FIRE_WIDTH = 1.2;
    const FIRE_HEIGHT = 2.0;
    
    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            temp.push({
                x: (Math.random() - 0.5) * FIRE_WIDTH,
                y: Math.random() * 1.5,           
                z: (Math.random() - 0.5) * FIRE_WIDTH, 
                speed: 0.5 + Math.random() * 1.5, 
                rotSpeed: (Math.random() - 0.5) * 5, 
                life: Math.random(), 
                scale: 0.15 + Math.random() * 0.3 
            })
        }
        return temp
    }, [count])

    const dummy = useMemo(() => new THREE.Object3D(), [])
    const color = useMemo(() => new THREE.Color(), [])

    useFrame((state, delta) => {
        if (!meshRef.current) return

        particles.forEach((particle, i) => {
            particle.life -= delta * particle.speed * 0.5

            if (particle.life < 0) {
                particle.life = 1
                particle.x = (Math.random() - 0.5) * FIRE_WIDTH
                particle.y = 0 
                particle.z = (Math.random() - 0.5) * FIRE_WIDTH
            }

            particle.y += delta * particle.speed * FIRE_HEIGHT
            particle.x *= 0.98 
            particle.z *= 0.98

            dummy.position.set(particle.x, particle.y, particle.z)
            dummy.rotation.x += particle.rotSpeed * delta
            dummy.rotation.y += particle.rotSpeed * delta

            const currentScale = particle.scale * (0.4 + particle.life * 0.6)
            dummy.scale.set(currentScale, currentScale, currentScale)
            
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)

            let colorIndex = (1 - particle.life) * (FIRE_COLORS.length - 1)
            let idx1 = Math.floor(colorIndex)
            let idx2 = Math.min(idx1 + 1, FIRE_COLORS.length - 1)
            let lerpFactor = colorIndex - idx1
            
            color.lerpColors(FIRE_COLORS[idx1], FIRE_COLORS[idx2], lerpFactor)
            meshRef.current.setColorAt(i, color)
        })

        meshRef.current.instanceMatrix.needsUpdate = true
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true
        }
    })

    return (
        <group position={node.position}>
            
            <pointLight 
                color="#ff8800" 
                distance={15} 
                intensity={5} 
                decay={1.5} 
                position={[0, 0.5, 0]} 
            />

            <instancedMesh 
                ref={meshRef} 
                args={[null, null, count]}
                castShadow
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial 
                    toneMapped={false} 
                    transparent
                    opacity={0.8}
                />
            </instancedMesh>
        </group>
    )
}