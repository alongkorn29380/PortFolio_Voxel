import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier"; 

export default function Windmill_House({ nodes })
{
    const rbRef = useRef()
    
    const [euler] = useState(() => new THREE.Euler().copy(nodes.Turbine.rotation))

    useFrame((state, delta) => 
    {
        if (rbRef.current) {
            euler.y += delta * 1
    
            const quaternion = new THREE.Quaternion().setFromEuler(euler)
            rbRef.current.setNextKinematicRotation(quaternion)
        }
    })

    return (

        <RigidBody 
            ref={rbRef} 
            type="kinematicPosition" 
            colliders="trimesh" 
            position={nodes.Turbine.position}
        >
            <primitive 
                object={ nodes.Turbine } 
                position={[0, 0, 0]} 
                rotation={[0, 0, 0]} 
            />
        </RigidBody>
    )
}