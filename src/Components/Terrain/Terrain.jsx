import { useGLTF } from "@react-three/drei"
import { RigidBody } from '@react-three/rapier'
import { useEffect } from "react"

import Water from '../Water/Water.jsx'

import ForestBushes from '../Forest/ForestBushes.jsx'
import DesertBushes from '../Desert/DesertBushes.jsx'
import MagicBushes from '../Magic/MagicBushes.jsx'
import SnowBushes from '../Snow/SnowBushes.jsx'
import RobotBushes from '../Robot/RobotBushes.jsx'

import RobotTree from "../Robot/RobotTree.jsx"

export default function Terrain()
{
    const { scene, nodes } = useGLTF('/Models/Terrain/Terrain.glb')

    // console.log(scene, nodes)

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.receiveShadow = true 
                child.castShadow = true    

                if (
                    child.name.includes('Bushes') || 
                    (child.name.includes('Tree') && !child.name.includes('Tree_Robot_Blue'))
                ) {
                    child.visible = false
                }
            }
        })
    }, [scene])

    return (
        <>
        <RigidBody
            type = 'fixed'
            colliders = "trimesh"
            restitution = { 0.2 }
            friction = { 0 }
        >
            <primitive object={ scene } />
        </RigidBody>

        <Water areaSize = { 100 } level = { - 0.2 } />

        <ForestBushes nodes = { nodes} />
        <DesertBushes nodes = { nodes} />
        <MagicBushes nodes = { nodes} />
        <SnowBushes nodes = { nodes} />
        <RobotBushes nodes = { nodes} />

        <RobotTree nodes = { nodes } />
        </>
    )
}

useGLTF.preload('/Models/Terrain/Terrain.glb')