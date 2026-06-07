import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Physics } from '@react-three/rapier'
import { Suspense, useEffect, useState } from 'react'
import { useControls } from 'leva'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useThree } from '@react-three/fiber'

import Terrain from './Components/Terrain/Terrain.jsx'
import Player from './Components/Player/Player.jsx'
import Light from './Components/Light/Light.jsx'
import TimeProvider from './Components/Context/TimeContext.jsx'

function WorldReadySignal({ onReady }) {
    useEffect(() => { onReady?.() }, [])
    return null
}

function ShaderPrewarm() {
    const { gl, scene, camera } = useThree()
    useEffect(() => { gl.compile(scene, camera) }, [])
    return null
}

export default function Experience({ entered, musicEnabled, onWorldReady })
{
    const [playerReady, setPlayerReady] = useState(false)

    const { debugcamera } = useControls('Camera', {
        debugcamera: { value: false, label: 'Debug Camera (Orbit)' }
    }, { collapsed: true })

    const { debug, gravity, restitution, friction } = useControls('Physics Controls', {
        debug:       { value: false, label: 'Show Debug' },
        gravity:     { value: { x: 0, y: -9.81, z: 0 }, step: 0.1, label: 'Gravity' },
        restitution: { value: 0.2, min: 0, max: 1, step: 0.05, label: 'Bounciness' },
        friction:    { value: 1.0, min: 0, max: 2, step: 0.1,  label: 'Friction' }
    }, { collapsed: true })

    function handleWorldReady() {
        setPlayerReady(true)
        onWorldReady?.()
    }

    return (
        <>
            <Perf position="top-left" />

            {(!entered || debugcamera) && <OrbitControls makeDefault />}

            {playerReady && !entered && <ShaderPrewarm />}

            <TimeProvider>
                <Light />

                <Physics debug={debug} gravity={[gravity.x, gravity.y, gravity.z]}>

                    <Suspense fallback={null}>
                        {playerReady && (
                            <Player
                                position={[4, 2, 5]}
                                cameraActive={entered && !debugcamera}
                            />
                        )}
                    </Suspense>

                    <Suspense fallback={null}>
                        <Terrain musicEnabled={musicEnabled} />
                        <WorldReadySignal onReady={handleWorldReady} />
                    </Suspense>

                </Physics>

                <EffectComposer disableNormalPass>
                    <Bloom
                        luminanceThreshold={2}
                        mipmapBlur
                        intensity={0.8}
                        radius={0.4}
                    />
                </EffectComposer>

            </TimeProvider>
        </>
    )
}
