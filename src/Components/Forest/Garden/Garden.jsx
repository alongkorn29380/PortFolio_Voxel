import * as THREE from 'three'
import { useGLTF, Clone, shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from "@react-three/fiber"
import { useControls, folder } from "leva"
import { useMemo } from "react"

import gardenVertexShader from './shaders/vertex.glsl'
import gardenFragmentShader from './shaders/fragment.glsl'

const GardenMaterial = shaderMaterial(
    {
        uTime: 0,
        uWindStrength: 0.4,
        uWindSpeed: 2.5,
        uTexture: null,
        uUseTexture: false,
        uAlphaTest: 0.5,
        uColor: new THREE.Color('#ffffff'),
        ...THREE.UniformsLib.lights, 
        ...THREE.UniformsLib.fog 
    },
    gardenVertexShader,
    gardenFragmentShader
)
extend({ GardenMaterial })

function CropSpawner({ nodes, keyword, model, offset = [0, 0, 0], windStrength, windSpeed }) {
    const spawns = useMemo(() => {
        return Object.values(nodes).filter(node => node.name.includes(keyword) && node.isMesh)
    }, [nodes, keyword])

    const { readyModel, materials } = useMemo(() => {
        const cloned = model.clone()
        const mats = []

        cloned.traverse((child) => {
            if (child.isMesh) {
                const newMat = new GardenMaterial()
                
                newMat.uColor = child.material.color || new THREE.Color('#ffffff')
                
                if (child.material.map) {
                    newMat.uTexture = child.material.map
                    newMat.uUseTexture = true
                }
                newMat.lights = true 
                newMat.fog = true

                child.material = newMat
                mats.push(newMat)
            }
        })
        return { readyModel: cloned, materials: mats }
    }, [model])

    useFrame((state, delta) => {
        materials.forEach(mat => {
            mat.uTime += delta
            mat.uWindStrength = windStrength
            mat.uWindSpeed = windSpeed
        })
    })

    return spawns.map((spawnPoint) => (
        <Clone 
            key={spawnPoint.uuid} 
            object={readyModel} 
            position={[
                spawnPoint.position.x + offset[0], 
                spawnPoint.position.y + offset[1], 
                spawnPoint.position.z + offset[2]
            ]} 
            rotation={spawnPoint.rotation} 
        />
    ))
}

export default function Garden({ nodes }) {
    const { scene: carrotModel } = useGLTF('/Models/Forest/Carrots.glb')
    const { scene: riceModel } = useGLTF('/Models/Forest/Rices.glb')

    const { windStrength, windSpeed } = useControls('Farm Settings', {
        'Wind': folder({
            windStrength: 
            { 
                value: 0.4, 
                min: 0, 
                max: 0.5, 
                step: 0.01 
            },
            windSpeed: 
            { 
                value: 2.5, 
                min: 0, 
                max: 5.0, 
                step: 0.1 
            }
        })
    })

    return (
        <group>
            <CropSpawner 
                nodes={nodes} 
                keyword="PlaneCarrot" 
                model={carrotModel} 
                offset={[ -0.1, 0.24, -0.1 ]} 
                windStrength={windStrength} 
                windSpeed={windSpeed} 
            />

            <CropSpawner 
                nodes={nodes} 
                keyword="PlaneRice" 
                model={riceModel} 
                offset={[ -0.1, 0.2, 0 ]} 
                windStrength={windStrength} 
                windSpeed={windSpeed} 
            />
        </group>
    )
}

useGLTF.preload('/Models/Forest/Carrots.glb')
useGLTF.preload('/Models/Forest/Rices.glb')