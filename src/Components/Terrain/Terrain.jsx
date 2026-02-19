import { useGLTF } from "@react-three/drei"
import Water from '../Water/Water.jsx'
import { RigidBody } from '@react-three/rapier'

export default function Terrain()
{
    const { scene } = useGLTF('/Models/Terrain/Terrain.glb')

    // console.log(scene)

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
        </>
    )
}

useGLTF.preload('/Models/Terrain/Terrain.glb')