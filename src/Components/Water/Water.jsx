import { shaderMaterial, useDepthBuffer } from '@react-three/drei'
import { useRef } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'

import waterVertexShader from './shaders/vertex.glsl'
import waterFragmentShader from './shaders/fragment.glsl'

const ColorWater = {
    deep: '#006885',
    shallow: '#38c9dd'
}

const WaterMaterial = shaderMaterial(
    {
        uTime: 0,
        uDepthMap: null,
        uResolution: new THREE.Vector2(),
        cameraNear: 0,
        cameraFar: 0,
        uFoamThreshold: 1.0,
        uColorDeep : new THREE.Color(ColorWater.deep),
        uColorShallow : new THREE.Color(ColorWater.shallow),
        uOpacity: 0.6
    },
    waterVertexShader,
    waterFragmentShader
)
extend({ WaterMaterial })

export default function Water({ areaSize = 50, level = -0.3 })
{
    const materialRef = useRef()
    const {size, camera} = useThree()
    const depthBuffer = useDepthBuffer({ size: 1024, frames: 1 })

    // Debug
    const { FoamThreshold, opacity, colorDeep, colorShallow } = useControls('Water', {
        FoamThreshold:{
            value: 1.0,
            min: 0.0,
            max: 5.0,
            step:0.1
        },
        opacity: {
            value:0.5,
            min: 0.0,
            max: 1.0,
            step: 0.01
        },
        colorDeep: ColorWater.deep,
        colorShallow: ColorWater.shallow,
    }, { collapsed: true } )


    useFrame((state, delta) => {
        if (materialRef.current)
        {
            materialRef.current.uTime += delta
            materialRef.current.uDepthMap = depthBuffer
            materialRef.current.uResolution.set(size.width, size.height)
            materialRef.current.cameraNear = camera.near
            materialRef.current.cameraFar = camera.far
            materialRef.current.uFoamThreshold = FoamThreshold
            materialRef.current.uColorDeep.set(colorDeep)
            materialRef.current.uColorShallow.set(colorShallow)
            materialRef.current.uOpacity = opacity
        }
    })

    return(
        <mesh 
            rotation = {[ - Math.PI / 2, 0, 0]} 
            position = {[ 0, level, 0]}
            renderOrder = { 1 } 
        >
            <planeGeometry args={[areaSize, areaSize]} />
            <waterMaterial 
                ref={materialRef} 
                transparent 
                depthWrite={false} 
                side={THREE.DoubleSide} 
            />
        </mesh>
    )
}

