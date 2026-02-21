import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { shaderMaterial, useTexture } from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'

import bushesVertexShader from './shaders/vertex.glsl'
import bushesFragmentShader from './shaders/fragment.glsl'

const BushesMaterial = shaderMaterial(
    {
        uTime: 0,
        uDisplacementStrength: 0.15,
        uAlphaTest: 0.5,
        uColorTop: new THREE.Color('#ffffff'),
        uColorMid: new THREE.Color('#ffffff'),
        uColorBottom: new THREE.Color('#ffffff'),
        uTexture: null,
        uAmbientColor: new THREE.Color('#ffffff'),
        uLightIntensity: 1.0,
        uEmission: 0.0,
        ...THREE.UniformsLib.fog
    },
    bushesVertexShader,
    bushesFragmentShader
)

extend({ BushesMaterial })

export default function Bushes({ data = [], colors, uEmission = 0, ...props })
{
    const instancedMeshRef = useRef()
    const materialRef = useRef()
    const { scene } = useThree()

    const { displacementStrength, alphaTest } = useControls('Bushes', 
        {
            displacementStrength:
            {
                value: 0.15,
                min: 0.00,
                max: 1.00,
                step: 0.01,
                order: -2
            },
            alphaTest:
            {
                value: 0.5,
                min: 0.0,
                max: 1.00,
                step: 0.01,
                order: -1
            }
        },
        { collapsed: true }
    )

    const texture = useTexture('/Textures/Bushes/Bushes_texture.png')
    texture.colorSpace = THREE.SRGBColorSpace

    // Create bushes geometry
    const bushesGeometry = useMemo(() => 
    {
        const planes = []
        const size = 2.5
        const resolution = 10
        for (let i = 0; i < resolution; i++) 
        {
            const offset = (i / (resolution - 1) - 0.5) * size
            const jitter = () => (Math.random() - 0.5) * 0.1

            const p1 = new THREE.PlaneGeometry(size, size)
            p1.rotateX(Math.PI * 0.5)
            p1.translate(jitter(), offset, jitter())
            planes.push(p1)

            const p2 = new THREE.PlaneGeometry(size, size)
            p2.translate(jitter(), jitter(), offset)
            planes.push(p2)

            const p3 = new THREE.PlaneGeometry(size, size)
            p3.rotateY(Math.PI * 0.5)
            p3.translate(offset, jitter(), jitter())
            planes.push(p3)
        }

        // Convert it into a cube
        const merged = mergeGeometries(planes)
        const positions = merged.attributes.position.array
        const normals = new Float32Array(positions.length)
        for (let i = 0; i < positions.length; i += 3) {
            const v = new THREE.Vector3(positions[i], positions[i+1], positions[i+2]).normalize()
            normals[i] = v.x; normals[i+1] = v.y; normals[i+2] = v.z
        }
        merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
        return merged
    }, [])

    const dummy = useMemo(() => new THREE.Object3D(), [])

    useEffect(() => {
        if (!instancedMeshRef.current || !bushesGeometry || data.length === 0) return

        for (let i = 0; i < data.length; i++) {
            const node = data[i]
            dummy.position.copy(node.position)
            dummy.rotation.copy(node.rotation)
            dummy.scale.copy(node.scale)

            dummy.updateMatrix()
            instancedMeshRef.current.setMatrixAt(i, dummy.matrix)
        }
        instancedMeshRef.current.instanceMatrix.needsUpdate = true
    }, [data, bushesGeometry, dummy])

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uDisplacementStrength.value = displacementStrength
            materialRef.current.uniforms.uAlphaTest.value = alphaTest
            materialRef.current.uniforms.uEmission.value = uEmission 
            
            if(colors) {
                materialRef.current.uniforms.uColorTop.value.set(colors.top)
                materialRef.current.uniforms.uColorMid.value.set(colors.mid)
                materialRef.current.uniforms.uColorBottom.value.set(colors.bottom)
            }
            
            materialRef.current.uniforms.uTime.value += delta
            
            if (scene.fog) materialRef.current.uniforms.uAmbientColor.value = scene.fog.color
            const sun = scene.getObjectByProperty('type', 'DirectionalLight')
            if (sun) materialRef.current.uniforms.uLightIntensity.value = sun.intensity
        }
    })
    if (data.length === 0) return null

    return (
        <instancedMesh 
            ref={instancedMeshRef} 
            args={[bushesGeometry, 
            undefined, data.length]} 
            {...props} 
            receiveShadow 
            castShadow>

            <bushesMaterial 
                ref={materialRef} 
                side={THREE.DoubleSide} 
                uTexture={texture} 
                transparent 
                fog 
            />
        </instancedMesh>
    )
}
