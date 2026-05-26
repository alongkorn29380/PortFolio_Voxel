import { useControls } from 'leva'

export default function Ball({ nodes }) {

    // Control
    const { Red_ball_color, Blue_ball_color, Green_ball_color } = useControls('Color Ball', 
        {
            Red_ball_color: '#de0029', 
            Blue_ball_color: '#f4f0ec', 
            Green_ball_color: '#c79656', 
        }, { collapsed: true })

    return (
        <group dispose={null}>

            {/* Red_ball */}
            <mesh 
                geometry={ nodes.Red_ball.geometry } 
                position={ nodes.Red_ball.position }
                rotation={ nodes.Red_ball.rotation }
                scale={ nodes.Red_ball.scale }
            >
                <meshStandardMaterial color={Red_ball_color} metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Blue_ball*/}
            <mesh 
                geometry={ nodes.Blue_ball.geometry } 
                position={ nodes.Blue_ball.position }
                rotation={ nodes.Blue_ball.rotation }
                scale={ nodes.Blue_ball.scale}
            >
                <meshStandardMaterial color={Blue_ball_color} metalness={0.6} roughness={0.2} />
            </mesh>

            {/* Green_ball*/}
            <mesh 
                geometry={ nodes.green_ball.geometry } 
                position={ nodes.green_ball.position }
                rotation={ nodes.green_ball.rotation }
                scale={ nodes.green_ball.scale }
            >
                <meshStandardMaterial color={Green_ball_color} metalness={0.8} roughness={0.2} />
            </mesh>
        </group>
    )
}