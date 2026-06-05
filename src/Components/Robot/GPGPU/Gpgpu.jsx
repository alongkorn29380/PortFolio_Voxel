import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js'
import { useControls } from 'leva'

import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'
import gpgpuParticlesShader from './shaders/gpgpu/particles.glsl'

export default function Gpgpu({ modelPath, levaFolder = 'GPGPU' }) {
    const { gl, size } = useThree()
    const pointsRef = useRef()
    const gpgpuRef = useRef({ computation: null, variable: null })

    const { scene: modelScene } = useGLTF(modelPath)

    const baseGeometry = modelScene.children[0].geometry
    const count = baseGeometry.attributes.position.count
    const gpgpuSize = Math.ceil(Math.sqrt(count))
    const totalParticles = gpgpuSize * gpgpuSize

    const {
        uSize,
        uFlowFieldInfluence,
        uFlowFieldStrength,
        uFlowFieldFrequency,
        posX, posY, posZ, scale
    } = useControls(levaFolder, {
        uSize: { value: 0.07, min: 0, max: 1, step: 0.001 },
        uFlowFieldInfluence: { value: 0.5, min: 0, max: 1, step: 0.001 },
        uFlowFieldStrength: { value: 2, min: 0, max: 10, step: 0.001 },
        uFlowFieldFrequency: { value: 0.5, min: 0, max: 1, step: 0.001 },
        posX: { value: 0, min: -10, max: 20, step: 0.1 },
        posY: { value: 0, min: -10, max: 20, step: 0.1 },
        posZ: { value: 0, min: -10, max: 20, step: 0.1 },
        scale: { value: 1, min: 0.1, max: 5, step: 0.05 },
    }, { collapsed: true })

    const { particlesUvArray, sizesArray, positionArray } = useMemo(() => {
        const computation = new GPUComputationRenderer(gpgpuSize, gpgpuSize, gl)
        const baseParticlesTexture = computation.createTexture()

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const i4 = i * 4
            baseParticlesTexture.image.data[i4 + 0] = baseGeometry.attributes.position.array[i3 + 0]
            baseParticlesTexture.image.data[i4 + 1] = baseGeometry.attributes.position.array[i3 + 1]
            baseParticlesTexture.image.data[i4 + 2] = baseGeometry.attributes.position.array[i3 + 2]
            baseParticlesTexture.image.data[i4 + 3] = Math.random()
        }

        const variable = computation.addVariable('uParticles', gpgpuParticlesShader, baseParticlesTexture)
        computation.setVariableDependencies(variable, [variable])

        variable.material.uniforms.uTime = new THREE.Uniform(0)
        variable.material.uniforms.uDeltaTime = new THREE.Uniform(0)
        variable.material.uniforms.uBase = new THREE.Uniform(baseParticlesTexture)
        variable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(0.5)
        variable.material.uniforms.uFlowFieldStrength = new THREE.Uniform(2)
        variable.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(0.5)

        computation.init()
        gpgpuRef.current = { computation, variable }

        const uvArray = new Float32Array(totalParticles * 2)
        const sArray = new Float32Array(totalParticles)
        const pArray = new Float32Array(totalParticles * 3)

        for (let y = 0; y < gpgpuSize; y++) {
            for (let x = 0; x < gpgpuSize; x++) {
                const i = y * gpgpuSize + x
                const i2 = i * 2
                uvArray[i2 + 0] = (x + 0.5) / gpgpuSize
                uvArray[i2 + 1] = (y + 0.5) / gpgpuSize
                sArray[i] = Math.random()
            }
        }

        return { particlesUvArray: uvArray, sizesArray: sArray, positionArray: pArray }
    }, [gpgpuSize, gl, count, baseGeometry, totalParticles, modelPath])

    useEffect(() => {
        if (!gpgpuRef.current.variable) return
        const uniforms = gpgpuRef.current.variable.material.uniforms
        uniforms.uFlowFieldInfluence.value = uFlowFieldInfluence
        uniforms.uFlowFieldStrength.value = uFlowFieldStrength
        uniforms.uFlowFieldFrequency.value = uFlowFieldFrequency
    }, [uFlowFieldInfluence, uFlowFieldStrength, uFlowFieldFrequency])

    const renderUniforms = useMemo(() => ({
        uSize: new THREE.Uniform(0.07),
        uResolution: new THREE.Uniform(new THREE.Vector2()),
        uParticlesTexture: new THREE.Uniform(null)
    }), [])

    useEffect(() => {
        const pixelRatio = Math.min(window.devicePixelRatio, 2)
        renderUniforms.uResolution.value.set(size.width * pixelRatio, size.height * pixelRatio)
    }, [size, renderUniforms])

    useEffect(() => {
        renderUniforms.uSize.value = uSize
    }, [uSize, renderUniforms])

    useFrame((state, delta) => {
        const { computation, variable } = gpgpuRef.current
        if (!computation || !variable) return

        variable.material.uniforms.uTime.value = state.clock.getElapsedTime()
        variable.material.uniforms.uDeltaTime.value = delta
        computation.compute()

        if (pointsRef.current) {
            pointsRef.current.material.uniforms.uParticlesTexture.value =
                computation.getCurrentRenderTarget(variable).texture
        }
    })

    const colorAttribute = baseGeometry.attributes.color

    return (
        <group position={[posX, posY, posZ]} scale={scale}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={totalParticles} array={positionArray} itemSize={3} />
                    <bufferAttribute attach="attributes-aParticlesUv" count={totalParticles} array={particlesUvArray} itemSize={2} />
                    {colorAttribute && (
                        <bufferAttribute attach="attributes-aColor" {...colorAttribute} />
                    )}
                    <bufferAttribute attach="attributes-aSize" count={totalParticles} array={sizesArray} itemSize={1} />
                </bufferGeometry>
                <shaderMaterial
                    vertexShader={particlesVertexShader}
                    fragmentShader={particlesFragmentShader}
                    uniforms={renderUniforms}
                />
            </points>
        </group>
    )
}
