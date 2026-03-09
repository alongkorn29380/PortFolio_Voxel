import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Windmill_House({ nodes })
{
    const turbineRef = useRef()
    useFrame((state, delta) => 
    {
        turbineRef.current.rotation.y += delta * 1
    })

    return (
        <primitive 
            ref={ turbineRef } 
            object={ nodes.Turbine } 
        />
    )
}