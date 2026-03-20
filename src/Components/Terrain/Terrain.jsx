import { useGLTF } from "@react-three/drei"
import { RigidBody } from '@react-three/rapier'
import { useEffect } from "react"

import Forest from '../Forest/Forest.jsx'
import Desert from '../Desert/Desert.jsx'
import Magic from '../Magic/Magic.jsx'
import Robot from '../Robot/Robot.jsx'
import Snow from '../Snow/Snow.jsx'
import Water from '../Water/Water.jsx'

import Bridge from '../Bridge/Bridge.jsx'

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
                    (child.name.includes('Tree') && !child.name.includes('Tree_Robot_Blue') && !child.name.includes('Tree_Desert'))
                ) {
                    child.visible = false
                }
            }
        })
    }, [scene])

    return (
        <>
            <RigidBody
                type='fixed'
                colliders="trimesh"
                restitution={ 0.2 }
                friction={ 0 }
            >
                <primitive object={ scene } />
            </RigidBody>

            <Forest nodes={ nodes } />
            <Desert nodes={ nodes } />
            <Magic nodes={ nodes } />
            <Robot nodes={ nodes } />
            <Snow nodes={ nodes } />
            <Water areaSize={ 94.7 } level={ -0.1 } />

            <Bridge nodes={ nodes } />

        </>
    )
}

useGLTF.preload('/Models/Terrain/Terrain.glb')