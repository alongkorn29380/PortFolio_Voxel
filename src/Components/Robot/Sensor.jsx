import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

export default function Sensor({ nodes }) {
    const sensorRef = useRef()

    useFrame((state, delta) => {
        if (sensorRef.current) {
            sensorRef.current.rotation.z += delta * 0.5
        }
    })

    return (
        <group 
            ref={sensorRef} 
            position={nodes.Temp.position}
            rotation={nodes.Temp.rotation} 
        >
            <primitive 
                object={nodes.Temp} 
                position={[0, 0, 0]} 
                rotation={[0, 0, 0]} 
            />
        </group>
    )
}