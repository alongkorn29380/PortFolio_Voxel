import { useGLTF, useTexture } from '@react-three/drei'
import { useMemo, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { RigidBody } from '@react-three/rapier'

import Flashing_Light from './Flashing_Light/Flashing_Light.jsx'
import Ball from './Ball.jsx'   

function SingleSnowGlobe({ scene, position, rotation, scale }) {
    const groupRef = useRef()

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.2 * delta 
        }
    })

    const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])

    const extractedNodes = useMemo(() => {
        const nodesMap = {}
        clonedScene.traverse((child) => {
            if (child.isMesh) {
                nodesMap[child.name] = child
                
                if (['Wrie', 'Inner_All', 'Ice_Blue', 'Purple', 'Warm_White',
                     'Red_ball', 'Blue_ball', 'green_ball'].includes(child.name)) {
                    child.visible = false
                }
            }
        })
        return nodesMap
    }, [clonedScene])

    return (
        <RigidBody type="fixed" colliders="cuboid" position={position} rotation={rotation}>
            <group ref={groupRef} scale={scale}>
                <primitive object={clonedScene} />
                
                {extractedNodes.Wrie && <Flashing_Light nodes={extractedNodes} />}
                {extractedNodes.Red_ball && <Ball nodes={extractedNodes} />}
            </group>
        </RigidBody>
    )
}

export default function SnowGlobe({ nodes }) {
    const { scene } = useGLTF('/Models/Snow/Snow_Globe.glb')
    const christmasTexture = useTexture('/Textures/ChristmasTree/ChristmasTree.png')

    const spawns = useMemo(() => {
        if (!nodes) return []
        return Object.values(nodes).filter((node) =>
            node.type === "Mesh" && node.name.startsWith("Snow_Globe")
        )
    }, [nodes])

    useEffect(() => {
        if (!scene || !christmasTexture) return

        spawns.forEach((node) => { node.visible = false })

        christmasTexture.flipY = false
        christmasTexture.needsUpdate = true

        scene.traverse((child) => {
            if (!child.isMesh) return
            if (child.name.toLowerCase().includes('christmastree')) {
                if (child.material) {
                    child.material.map = christmasTexture
                    child.material.needsUpdate = true
                }
            }
        })
    }, [spawns, scene, christmasTexture])

    return (
        <>
            {spawns.map((node) => (
                <SingleSnowGlobe
                    key={node.uuid}
                    scene={scene}
                    position={[node.position.x, node.position.y, node.position.z]}
                    rotation={node.rotation}
                    scale={[1.5, 1.5, 1.5]}
                />
            ))}
        </>
    )
}

useGLTF.preload('/Models/Snow/Snow_Globe.glb')