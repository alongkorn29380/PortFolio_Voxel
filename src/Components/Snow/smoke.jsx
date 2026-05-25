import * as THREE from 'three'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

const SMOKE_COLORS = [  
    new THREE.Color('#555555'),
    new THREE.Color('#777777'),
    new THREE.Color('#999999'),
    new THREE.Color('#bbbbbb'),
    new THREE.Color('#dddddd'),
]

export default function Smoke({ nodes})
{
    const smokeSpawns = useMemo(() => {
        return Object.values(nodes).filter((node) =>
            node.type === "Mesh" && (node.name.startsWith("Smoke") || node.name.startsWith("Spawn_Smoke"))
        )
    }, [nodes])
    
    useEffect(() => {
        smokeSpawns.forEach((node) => {
            node.visible = false
        })
    }, [smokeSpawns])
    return (
        <>
            {smokeSpawns.map((node) => (
                <SingleSmoke key={node.uuid} node={node} count={50} />
            ))}
        </>
    )
}

function SingleSmoke ({ node, count = 50 }) {
    const meshRef = useRef()

    const SMOKE_WIDTH = 1.5;
    const SMOKE_HEIGHT = 2.5;

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            temp.push({
                x: (Math.random() - 0.5) * SMOKE_WIDTH,
                y: Math.random() * 1.5,           
                z: (Math.random() - 0.5) * SMOKE_WIDTH, 
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
                    particle.x = (Math.random() - 0.5) * SMOKE_WIDTH
                    particle.y = 0
                    particle.z = (Math.random() - 0.5) * SMOKE_WIDTH
                }

                particle.y += delta * particle.speed * SMOKE_HEIGHT
                particle.x *= 0.98 
                particle.z *= 0.98
    
                dummy.position.set(particle.x, particle.y, particle.z)
                dummy.rotation.x += particle.rotSpeed * delta
                dummy.rotation.y += particle.rotSpeed * delta
    
                const currentScale = particle.scale * (0.4 + particle.life * 0.6)
                dummy.scale.set(currentScale, currentScale, currentScale)
                
                dummy.updateMatrix()
                meshRef.current.setMatrixAt(i, dummy.matrix)
    
                let colorIndex = (1 - particle.life) * (SMOKE_COLORS.length - 1)
                let idx1 = Math.floor(colorIndex)
                let idx2 = Math.min(idx1 + 1, SMOKE_COLORS.length - 1)
                let lerpFactor = colorIndex - idx1
                
                color.lerpColors(SMOKE_COLORS[idx1], SMOKE_COLORS[idx2], lerpFactor)
                meshRef.current.setColorAt(i, color)
            })
    
            meshRef.current.instanceMatrix.needsUpdate = true
            if (meshRef.current.instanceColor) {
                meshRef.current.instanceColor.needsUpdate = true
            }
        })

    return (
        <group position={node.position}>
            
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