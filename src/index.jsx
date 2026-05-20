import './style.css'
import { useState, useEffect } from 'react'
import ReactDom from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Leva } from 'leva'

import Experience from './Experience.jsx'
import LoadingScreen from './Components/LoadingScreen/LoadingScreen.jsx'

const root = ReactDom.createRoot(document.querySelector('#root'))

function App()
{
    const [entered, setEntered] = useState(false)
    const [showLoading, setShowLoading] = useState(true)
    const [musicEnabled, setMusicEnabled] = useState(false)
    const [worldReady, setWorldReady] = useState(false)
    const [minTimePassed, setMinTimePassed] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setMinTimePassed(true), 1500)
        return () => clearTimeout(t)
    }, [])

    function handleEnter(withMusic)
    {
        setMusicEnabled(withMusic)
        setEntered(true)                                    // Player mounts immediately
        setTimeout(() => setShowLoading(false), 700)        // screen removed after fade
    }

    return (
        <>
            <Leva collapsed />

            {showLoading && <LoadingScreen onEnter={handleEnter} ready={worldReady && minTimePassed} />}

            <KeyboardControls
                map={[
                    { name: 'forward',  keys: ['ArrowUp',    'KeyW'] },
                    { name: 'backward', keys: ['ArrowDown',  'KeyS'] },
                    { name: 'leftward', keys: ['ArrowLeft',  'KeyA'] },
                    { name: 'rightward',keys: ['ArrowRight', 'KeyD'] },
                    { name: 'jump',     keys: ['Space'] },
                    { name: 'sprint',   keys: ['ShiftLeft'] },
                ]}
            >
                <Canvas
                    shadows
                    camera={{
                        fov: 45,
                        near: 0.1,
                        far: 2000,
                        position: [10, 10, 10],
                    }}
                >
                    <Experience entered={entered} musicEnabled={musicEnabled} onWorldReady={() => setWorldReady(true)} />
                </Canvas>
            </KeyboardControls>
        </>
    )
}

root.render(<App />)
