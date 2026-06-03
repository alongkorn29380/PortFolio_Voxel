    import { useRef, useMemo, useEffect } from 'react'
    import { useGLTF, Html } from '@react-three/drei'
    import { useThree } from '@react-three/fiber'
    import { useControls, folder } from 'leva'
    import * as THREE from 'three'

    import { buildParticles, buildGeometry, buildUniforms } from '../particleUtils'
    import { useMorphProximity } from '../useMorphProximity'
    import particlesVertexShader from '../shaders/particles/vertex.glsl'    
    import particlesFragmentShader from '../shaders/particles/fragment.glsl'

    const CUBE = 0
    const TEXT = 1

    export default function Snow_Globe(){
        const { size, viewport } = useThree()
        const materialRef = useRef()
        const indexRef = useRef(CUBE)

        const { scene: modelScene } = useGLTF('/Markers/Snow_Globe.glb', '/draco/')

        const particles = useMemo(() => buildParticles(modelScene), [modelScene])
        const geometry = useMemo(() => buildGeometry(particles, CUBE, TEXT), [particles])
        const uniforms = useMemo(() => buildUniforms(size.width, size.height, viewport.dpr), [])

        useEffect(() => {
            if (materialRef.current)
                materialRef.current.uniforms.uResolution.value.set(
                    size.width * viewport.dpr,  
                    size.height * viewport.dpr
                )
        }, [size, viewport.dpr])

        const { scale, position, rotation, proximityRange } = useControls('Marker', {
            Snow_Globe: folder({ 
                Transform: folder({
                    scale: { value: 0.2, min: 0.1, max: 5, step: 0.1 },
                    position: { value: [-27, 2, 12], step: 0.1 },
                    rotation: { value: [0, 1.5, 0], step: 0.01 },
                }),
                Particles: folder({ 
                    pointSize: {
                        value: 0.04, min: 0, max: 2, step: 0.01,
                        onChange: (v) => { if (materialRef.current) materialRef.current.uniforms.uSize.value = v },
                    },
                    colorA: { value: '#e52007', onChange: (v) => materialRef.current?.uniforms.uColorA.value.set(v) },
                    colorB: { value: '#2a0cc4', onChange: (v) => materialRef.current?.uniforms.uColorB.value.set(v) },
                    proximityRange: { value: 2.0, min: 1, max: 20, step: 0.5, label: 'Proximity Range' },
                }),
            }, { collapsed: true}),
        }, { collapsed: true })

        const { proximityState, showPrompt, hidePrompt } = useMorphProximity({
                geometry, particles, indexRef, materialRef,
                position, proximityRange,
                nearIndex: TEXT,
                farIndex:  CUBE,
        })

        useEffect(() => {
            const onKey = (e) => {
                if (e.code !== 'Enter') return
                if (proximityState.current === 'near') {
                    hidePrompt()
                    window.dispatchEvent(new CustomEvent('openMarkerSnow_Globe'))
                }
            }
            window.addEventListener('keydown', onKey)
            return () => window.removeEventListener('keydown', onKey)
        }, [hidePrompt])

        return (
            <>
                <points geometry={geometry} frustumCulled={false} scale={scale} position={position} rotation={rotation}>
                    <shaderMaterial
                        ref={materialRef}
                        vertexShader={particlesVertexShader}
                        fragmentShader={particlesFragmentShader}
                        uniforms={uniforms}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </points>

                {showPrompt && (
                    <Html
                        position={[position[0], position[1] + 1, position[2]]}
                        center
                        style={{ pointerEvents: 'none' }}
                    >
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.75)',
                            color: '#fff',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontFamily: 'sans-serif',
                            whiteSpace: 'nowrap',
                        }}>
                            Press <strong>Enter</strong> to open
                        </div>
                    </Html>
                )}
            </>
        )
    }

    useGLTF.preload('/Markers/Snow_Globe.glb')