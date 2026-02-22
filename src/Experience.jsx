import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Physics } from '@react-three/rapier'
import { Suspense } from 'react'
import { useControls } from 'leva'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

import Terrain from './components/Terrain/Terrain.jsx'
import Player from './components/Player/Player.jsx'
import Light from './Components/Light/Light.jsx'
import TimeProvider from './Components/Context/TimeContext.jsx'

export default function Experience()
{
    const { debugcamera } = useControls('Camera', {
        debugcamera:{
            value: false,
            label:'Debug Camera (Orbit)'
        }
    }, { collapsed: true })

     const { debug, gravity, restitution, friction } = useControls('Physics Controls', {
        debug: {
            value: false,
            label: 'Show Debug'
        },
        gravity: {
            value: { x: 0, y: -9.81, z: 0 },
            step: 0.1,
            label: 'Gravity'
        },
        restitution: {
            value: 0.2,
            min: 0,
            max: 1,
            step: 0.05,
            label: 'Bounciness'
        },
        friction: {
            value: 1.0,
            min: 0,
            max: 2,
            step: 0.1,
            label: 'Friction'
        }
    },
        { collapsed: true })

    return(
        <>
            {/* Efficiency */}
            <Perf position="top-left" />

            {/* Camera controls */}
            <OrbitControls makeDefault />

            {/* Light and time */}
            <TimeProvider>
            <Light />

                <Physics debug={debug} gravity={[gravity.x, gravity.y, gravity.z]} >

                    <Player 
                        position={[2, 2, 5]} 
                        cameraActive={!debugcamera}
                    />

                    <Suspense fallback={null}>
                        <Terrain />
                    </Suspense>

                </Physics>

               
                <EffectComposer disableNormalPass>
                    <Bloom 
                        luminanceThreshold={ 2 } 
                        mipmapBlur 
                        intensity={ 1.5 } 
                        radius={ 0.4 }    
                    />
                </EffectComposer>

            </TimeProvider>
        </>
    )
}