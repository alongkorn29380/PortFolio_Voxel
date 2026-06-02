import './style.css'
import { useState, useEffect } from 'react'
import ReactDom from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Leva } from 'leva'

import Experience from './Experience.jsx'
import LoadingScreen from './Components/LoadingScreen/LoadingScreen.jsx'
import MarkerModal from './Components/Marker/Performance/Sensor_DashBoard/MarkerModal.jsx'

const root = ReactDom.createRoot(document.querySelector('#root'))

function App()
{
    const [entered, setEntered] = useState(false)
    const [showLoading, setShowLoading] = useState(true)
    const [musicEnabled, setMusicEnabled] = useState(false)
    const [worldReady, setWorldReady] = useState(false)
    const [minTimePassed, setMinTimePassed] = useState(false)
    const [markerModalOpen, setMarkerModalOpen] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setMinTimePassed(true), 1500)
        return () => clearTimeout(t)
    }, [])

    useEffect(() => {
        const onOpen  = () => setMarkerModalOpen(true)
        const onClose = (e) => { if (e.code === 'Escape') setMarkerModalOpen(false) }
        window.addEventListener('openMarkerModal', onOpen)
        window.addEventListener('keydown', onClose)
        return () => {
            window.removeEventListener('openMarkerModal', onOpen)
            window.removeEventListener('keydown', onClose)
        }
    }, [])

    function handleEnter(withMusic)
    {
        setMusicEnabled(withMusic)
        setEntered(true)                                    
        setTimeout(() => setShowLoading(false), 700)        
    }

    return (
        <>
            <Leva collapsed />

            {showLoading && <LoadingScreen onEnter={handleEnter} ready={worldReady && minTimePassed} />}
            {markerModalOpen && <MarkerModal onClose={() => setMarkerModalOpen(false)} />}

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
