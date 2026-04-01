import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PositionalAudio } from '@react-three/drei'

export default function Animals({ nodes })
{
    const animalNodes = useMemo(() => 
    {
        return Object.values(nodes).filter((node) =>
            node.name.includes("Cow") ||
            node.name.includes("Sheep") ||
            node.name.includes("Pig") ||
            node.name.includes("Chicken")
        )
    }, [nodes])

    return (
        <group>
            {animalNodes.map((node) => (
                <SingleAnimal key={ node.uuid } node={ node } />
            ))}
        </group>
    )
}

function SingleAnimal({ node })
{
    const audioRef = useRef()
    const groupRef = useRef() 
    const timerRef = useRef(0)
    const nextPlayRef = useRef(Math.random() * 20 + 10) 

    let soundFile = null
    if (node.name.includes("Cow")) soundFile = "/Sounds/Animals/Cow.mp3"
    if (node.name.includes("Sheep")) soundFile = "/Sounds/Animals/Sheep.mp3"
    if (node.name.includes("Pig")) soundFile = "/Sounds/Animals/Pig.mp3"
    if (node.name.includes("Chicken")) soundFile = "/Sounds/Animals/Chicken.mp3"


    useFrame((state, delta) => {
        if (!audioRef.current || !soundFile || !groupRef.current) return
        
        const animalPos = new THREE.Vector3()
        groupRef.current.getWorldPosition(animalPos)
        const distance = state.camera.position.distanceTo(animalPos)
        
        const maxDistance = 15 
        const minDistance = 5  
        const maxVolume = 0.5 

        let currentVol = 0
        if (distance > maxDistance) {
            currentVol = 0 
        } else if (distance < minDistance) {
            currentVol = maxVolume 
        } else {
            currentVol = maxVolume * (1 - (distance - minDistance) / (maxDistance - minDistance))
        }
        

        audioRef.current.setVolume(currentVol)

        timerRef.current += delta
        if (timerRef.current > nextPlayRef.current) {
            if (currentVol > 0 && !audioRef.current.isPlaying) {
                audioRef.current.play()
            }
            timerRef.current = 0
            nextPlayRef.current = Math.random() * 20 + 20 
        }
    })

    return (
        <group ref={groupRef} position={ node.position } rotation={ node.rotation } scale={ node.scale } >
            
            <mesh geometry={node.geometry} material={node.material} castShadow receiveShadow />

            {soundFile && (
                <PositionalAudio 
                    ref={audioRef}
                    url={soundFile} 
                    loop={false}
                    autoplay={false}
                />
            )}
        </group>
    )
}