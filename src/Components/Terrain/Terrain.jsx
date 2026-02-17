import { useGLTF } from "@react-three/drei";

export default function Terrain(){
    const { scene } = useGLTF('/Models/Terrain/Terrain.glb')

    console.log(scene)

    return(
        <primitive object={scene} />
    )
}

useGLTF.preload('/Models/Terrain/Terrain.glb')