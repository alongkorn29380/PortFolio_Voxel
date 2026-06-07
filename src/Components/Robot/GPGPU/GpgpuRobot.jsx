import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js'
import { useControls, folder } from 'leva'

import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'
import gpgpuParticlesShader from './shaders/gpgpu/particles.glsl'

export default function GpgpuRobot() {
    const { gl, size } = useThree()
    const pointsRef = useRef()
    const gpgpuRef = useRef({ computation: null, variable: null })

    const { scene: modelScene } = useGLTF('/Models/Robots/Robot.glb')

    const { baseGeometry, modelTexture } = useMemo(() => {
        let best = null
        modelScene.traverse((child) => {
            if (child.isMesh && child.geometry?.attributes.position) {
                if (!best || child.geometry.attributes.position.count > best.geometry.attributes.position.count)
                    best = child
            }
        })
        const mat = Array.isArray(best?.material) ? best.material[0] : best?.material
        return { baseGeometry: best.geometry, modelTexture: mat?.map ?? null }
    }, [modelScene])

    const count = baseGeometry.attributes.position.count
    const gpgpuSize = Math.ceil(Math.sqrt(count))
    const totalParticles = gpgpuSize * gpgpuSize

    const {
        uSize, uFlowFieldInfluence, uFlowFieldStrength, uFlowFieldFrequency,
        posX, posY, posZ, scale,
    } = useControls('GPGPU', {
        Robot: folder({
            uSize:               { value: 0.07, min: 0, max: 1,  step: 0.001 },
            uFlowFieldInfluence: { value: 0.5,  min: 0, max: 1,  step: 0.001 },
            uFlowFieldStrength:  { value: 2,    min: 0, max: 10, step: 0.001 },
            uFlowFieldFrequency: { value: 0.5,  min: 0, max: 1,  step: 0.001 },
            posX:  { value: -7.2, min: -20, max: 20, step: 0.1 },
            posY:  { value: 1.5, min: -20, max: 20, step: 0.1 },
            posZ:  { value: 0.3, min: -20, max: 20, step: 0.1 },
            scale: { value: 0.35, min: 0, max: 5,  step: 0.05 },
        }, { collapsed: true }),
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

        variable.material.uniforms.uTime              = new THREE.Uniform(0)
        variable.material.uniforms.uDeltaTime         = new THREE.Uniform(0)
        variable.material.uniforms.uBase              = new THREE.Uniform(baseParticlesTexture)
        variable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(0.5)
        variable.material.uniforms.uFlowFieldStrength  = new THREE.Uniform(2)
        variable.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(0.5)

        computation.init()
        gpgpuRef.current = { computation, variable }

        const uvArray = new Float32Array(totalParticles * 2)
        const sArray  = new Float32Array(totalParticles)
        const pArray  = new Float32Array(totalParticles * 3)

        for (let y = 0; y < gpgpuSize; y++) {
            for (let x = 0; x < gpgpuSize; x++) {
                const i  = y * gpgpuSize + x
                const i2 = i * 2
                uvArray[i2 + 0] = (x + 0.5) / gpgpuSize
                uvArray[i2 + 1] = (y + 0.5) / gpgpuSize
                sArray[i] = Math.random()
            }
        }

        return { particlesUvArray: uvArray, sizesArray: sArray, positionArray: pArray }
    }, [gpgpuSize, gl, count, baseGeometry, totalParticles])

    const modelUvArray = useMemo(() => {
        const dst = new Float32Array(totalParticles * 2)
        const src = baseGeometry.attributes.uv
        if (!src) return dst
        const len = Math.min(src.count, totalParticles)
        for (let i = 0; i < len; i++) {
            dst[i * 2]     = src.array[i * 2]
            dst[i * 2 + 1] = src.array[i * 2 + 1]
        }
        return dst
    }, [baseGeometry, totalParticles])

    const colorArray = useMemo(() => {
        const dst = new Float32Array(totalParticles * 3).fill(1)

        // 1. Vertex colors
        const colorSrc = baseGeometry.attributes.color
        if (colorSrc) {
            const isBytes = colorSrc.array instanceof Uint8Array
            const stride  = colorSrc.itemSize
            const len     = Math.min(colorSrc.count, totalParticles)
            for (let i = 0; i < len; i++) {
                const s = i * stride; const d = i * 3
                dst[d]     = isBytes ? colorSrc.array[s]     / 255 : colorSrc.array[s]
                dst[d + 1] = isBytes ? colorSrc.array[s + 1] / 255 : colorSrc.array[s + 1]
                dst[d + 2] = isBytes ? colorSrc.array[s + 2] / 255 : colorSrc.array[s + 2]
            }
            return dst
        }

        // 2. Sample texture via canvas (pre-bake at load time)
        const uvSrc = baseGeometry.attributes.uv
        if (modelTexture?.image && uvSrc) {
            try {
                const img = modelTexture.image
                const W = img.width  || 512
                const H = img.height || 512
                const canvas = document.createElement('canvas')
                canvas.width = W; canvas.height = H
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, W, H)
                const { data } = ctx.getImageData(0, 0, W, H)
                const len = Math.min(uvSrc.count, totalParticles)
                for (let i = 0; i < len; i++) {
                    const u  = ((uvSrc.array[i * 2]     % 1) + 1) % 1
                    const v  = ((uvSrc.array[i * 2 + 1] % 1) + 1) % 1
                    const px = Math.floor(u * W)
                    const py = Math.floor((1 - v) * H)   // flip Y
                    const idx = (py * W + px) * 4
                    dst[i * 3]     = data[idx]     / 255
                    dst[i * 3 + 1] = data[idx + 1] / 255
                    dst[i * 3 + 2] = data[idx + 2] / 255
                }
            } catch (_) { /* canvas tainted — leave white */ }
        }

        return dst
    }, [baseGeometry, totalParticles, modelTexture])

    useEffect(() => {
        if (!gpgpuRef.current.variable) return
        const uniforms = gpgpuRef.current.variable.material.uniforms
        uniforms.uFlowFieldInfluence.value = uFlowFieldInfluence
        uniforms.uFlowFieldStrength.value  = uFlowFieldStrength
        uniforms.uFlowFieldFrequency.value = uFlowFieldFrequency
    }, [uFlowFieldInfluence, uFlowFieldStrength, uFlowFieldFrequency])

    const renderUniforms = useMemo(() => ({
        uSize:             new THREE.Uniform(0.07),
        uResolution:       new THREE.Uniform(new THREE.Vector2()),
        uParticlesTexture: new THREE.Uniform(null),
        uTexture:          new THREE.Uniform(null),
        uHasTexture:       new THREE.Uniform(false),
    }), [])

    // Colors pre-baked into aColor — GPU texture sampling not needed
    useEffect(() => {
        renderUniforms.uHasTexture.value = false
    }, [renderUniforms])

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

        variable.material.uniforms.uTime.value      = state.clock.getElapsedTime()
        variable.material.uniforms.uDeltaTime.value = delta
        computation.compute()

        if (pointsRef.current)
            pointsRef.current.material.uniforms.uParticlesTexture.value =
                computation.getCurrentRenderTarget(variable).texture
    })

    return (
        <group position={[posX, posY, posZ]} scale={scale}>
            <points ref={pointsRef} frustumCulled={false}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position"     count={totalParticles} array={positionArray}    itemSize={3} />
                    <bufferAttribute attach="attributes-aParticlesUv" count={totalParticles} array={particlesUvArray}  itemSize={2} />
                    <bufferAttribute attach="attributes-aColor"       count={totalParticles} array={colorArray}        itemSize={3} />
                    <bufferAttribute attach="attributes-aSize"        count={totalParticles} array={sizesArray}        itemSize={1} />
                    <bufferAttribute attach="attributes-aModelUv"     count={totalParticles} array={modelUvArray}      itemSize={2} />
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
