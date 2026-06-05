import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

import halftoneVertexShader from './shaders/halftone/vertex.glsl'
import halftoneFragmentShader from './shaders/halftone/fragment.glsl'

const HalftoneMaterial = shaderMaterial(
    {
        uColor: new THREE.Color('#ff794d'),
        uShadeColor: new THREE.Color('#26132f'),
        uResolution: new THREE.Vector2(0, 0),
        uShadowRepetitions: 100,
        uShadowColor: new THREE.Color('#8e19b8'),
        uLightRepetitions: 130,
        uLightColor: new THREE.Color('#e5ffe0')
    },
    halftoneVertexShader,
    halftoneFragmentShader
)

extend({ HalftoneMaterial })

export { HalftoneMaterial }
