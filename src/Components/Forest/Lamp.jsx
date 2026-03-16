

export default function Lamp({ nodes }) {
    return (
        <group>
            <mesh 
                geometry={ nodes.Lamp_Glass.geometry } 
                position={ nodes.Lamp_Glass.position }
                scale={ nodes.Lamp_Glass.scale }
            >
                <meshStandardMaterial 
                    color={[1.5, 1.2, 0]} 
                    emissive="#e4af02" 
                    emissiveIntensity={ 5 } 
                    toneMapped={false} 
                />
            </mesh>
        </group>
    )
}