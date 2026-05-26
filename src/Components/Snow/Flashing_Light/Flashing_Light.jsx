import React, { useRef } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { useControls } from 'leva'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

import LightVertexShader from './shaders/vertex.glsl'
import LightFragmentShader from './shaders/fragment.glsl'

// Shader Configuration
const BlinkMaterial = shaderMaterial(
    {
        uTime: 0,
        uSpeed: 20.0,
        uOffset: 0.0,
        uColor: new THREE.Color(0, 0, 0)
    },
    LightVertexShader,
    LightFragmentShader
)

extend({ BlinkMaterial })

export default function Flashing_Light({ nodes }) {

    const blueRef = useRef()
    const purpleRef = useRef()
    const whiteRef = useRef()

    const { 
        Blue_Light, Purple_Light, White_Light, 
        Blue_Speed, Purple_Speed, White_Speed,
        Purple_Offset, White_Offset 
    } = useControls('Color_Light',
        {
            Blue_Light: '#1b88ef',
            Blue_Speed: { value: 7, min: 1, max: 100, step: 1 }, 

            Purple_Light: '#eb5cf8',
            Purple_Speed: { value: 12, min: 1, max: 100, step: 1 }, 
            Purple_Offset: { value: 0.3, min: 0, max: 10, step: 0.1 },

            White_Light: '#c1bfb7',
            White_Speed: { value: 10, min: 1, max: 100, step: 1 }, 
            White_Offset: { value: 4.0, min: 0, max: 10, step: 0.1 },
        }, { collapsed: true }
    )

    useFrame((state, delta) => {
        if (blueRef.current) {
            blueRef.current.uTime += delta
            blueRef.current.uSpeed = Blue_Speed
            blueRef.current.uOffset = 0.0
            blueRef.current.uColor = new THREE.Color(Blue_Light)
        }

        if (purpleRef.current) {
            purpleRef.current.uTime += delta
            purpleRef.current.uSpeed = Purple_Speed 
            purpleRef.current.uOffset = Purple_Offset
            purpleRef.current.uColor = new THREE.Color(Purple_Light)
        }

        if (whiteRef.current) {
            whiteRef.current.uTime += delta
            whiteRef.current.uSpeed = White_Speed 
            whiteRef.current.uOffset = White_Offset
            whiteRef.current.uColor = new THREE.Color(White_Light)
        }
    })
    
    return (
        <group dispose={null}>
            {/* Wire */}
            <mesh
                geometry={ nodes.Wrie.geometry }
                material={ nodes.Wrie.material }
                position={ nodes.Wrie.position }
                rotation={ nodes.Wrie.rotation }
                scale={ nodes.Wrie.scale }
            />

            {/* Light Inner */}
            <mesh
                geometry={ nodes.Inner_All.geometry }
                position={ nodes.Inner_All.position }
                rotation={ nodes.Inner_All.rotation }
                scale={ nodes.Inner_All.scale }
            >
            </mesh>
            
            {/* Blue Light */}
            <mesh
                geometry={ nodes.Ice_Blue.geometry }
                position={ nodes.Ice_Blue.position }
                rotation={ nodes.Ice_Blue.rotation }
                scale={ nodes.Ice_Blue.scale }
            >
                <blinkMaterial ref={blueRef} />
            </mesh>

            {/* Purple Light */}
            <mesh
                geometry={ nodes.Purple.geometry }
                position={ nodes.Purple.position }
                rotation={ nodes.Purple.rotation }
                scale={ nodes.Purple.scale }
            >
                <blinkMaterial ref={purpleRef} />
            </mesh>

            {/* White Light */}
            <mesh
                geometry={ nodes.Warm_White.geometry }
                position={ nodes.Warm_White.position }
                rotation={ nodes.Warm_White.rotation }
                scale={ nodes.Warm_White.scale }
            >
                <blinkMaterial ref={whiteRef} />
            </mesh>
        </group>
    )
}