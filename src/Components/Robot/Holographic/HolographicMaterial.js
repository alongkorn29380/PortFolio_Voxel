import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

import holographicVertexShader from './shaders/holographic/vertex.glsl'
import holographicFragmentShader from './shaders/holographic/fragment.glsl'

const HolographicMaterial = shaderMaterial(
    { 
        uTime: 0, 
        uColor: new THREE.Color('#70c1ff') 
    },
    holographicVertexShader,
    holographicFragmentShader
)

extend({ HolographicMaterial })

export { HolographicMaterial }
