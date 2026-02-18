import { useGLTF } from "@react-three/drei"
import Water from '../Water/Water.jsx'

export default function Terrain()
{
    const { scene } = useGLTF('/Models/Terrain/Terrain.glb')

    // console.log(scene)

    return (
        <>
            <primitive object={ scene } />
            <Water areaSize={ 100 } level={ -0.2 } />
        </>
    )
}

useGLTF.preload('/Models/Terrain/Terrain.glb')