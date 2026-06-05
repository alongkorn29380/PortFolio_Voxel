import './style.css'
import { useState, useEffect } from 'react'
import ReactDom from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Leva } from 'leva'

import Experience from './Experience.jsx'
import LoadingScreen from './Components/LoadingScreen/LoadingScreen.jsx'
import MarkerSensor_DashBoard from './Components/Marker/Performance/Sensor_DashBoard/MarkerSensor_DashBoard.jsx'
import MarkerArm_Robotic from './Components/Marker/Performance/Arm_Robotic/MarkerArm_Robotic.jsx'
import MarkerResume from './Components/Marker/Performance/Resume/MarkerResume.jsx'
import MarkerCalendar from './Components/Marker/Performance/Calendar/MarkerCalendar.jsx'
import MarkerSnow_Globe from './Components/Marker/Performance/Snow_Globe/MarkerSnow_Globe.jsx'
import MarkerChristmas from './Components/Marker/Performance/Christmas/MarkerChristmas.jsx'
import MarkerOld_Terrain from './Components/Marker/Performance/Old_Terrain/MarkerOld_Terrain.jsx'
import { flattenJSON } from 'three/src/animation/AnimationUtils.js'

const root = ReactDom.createRoot(document.querySelector('#root'))

function App()
{
    const [entered, setEntered] = useState(false)
    const [showLoading, setShowLoading] = useState(true)
    const [musicEnabled, setMusicEnabled] = useState(false)
    const [worldReady, setWorldReady] = useState(false)
    const [minTimePassed, setMinTimePassed] = useState(false)

    const [sensorModalOpen, setSensorModalOpen] = useState(false)   
    const [armModalOpen, setArmModalOpen] = useState(false)
    const [resumeModalOpen, setResumeModalOpen] = useState(false)
    const [calendarModalOpen, setCalendarModalOpen] = useState(false)
    const [snowModalOpen, setSnowModalOpen] = useState(false)
    const [christmasModalOpen, setChristmasModalOpen] = useState(false)
    const [oldModalOpen, setOldModalOpen] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setMinTimePassed(true), 1500)
        return () => clearTimeout(t)
    }, [])

    useEffect(() => {
        const onSensor = () => setSensorModalOpen(true)
        const onArm = () => setArmModalOpen(true)
        const onResume = () => setResumeModalOpen(true)
        const onCalendar = () => setCalendarModalOpen(true) 
        const onSnow = () => setSnowModalOpen(true)
        const onChristmas = () => setChristmasModalOpen(true)
        const onOld = () => setOldModalOpen(true)
        const onEscape = (e) => {
            if (e.code !== 'Escape') return
            setSensorModalOpen(false)
            setArmModalOpen(false)
            setResumeModalOpen(false)
            setCalendarModalOpen(false)
            setSnowModalOpen(false)
            setChristmasModalOpen(false)
            setOldModalOpen(false)
        }
        window.addEventListener('openMarkerSensor_DashBoard', onSensor)
        window.addEventListener('openMarkerArm_Robotic', onArm)
        window.addEventListener('openMarkerResume', onResume)
        window.addEventListener('openMarkerCalendar', onCalendar)
        window.addEventListener('openMarkerSnow_Globe', onSnow)
        window.addEventListener('openMarkerChristmas', onChristmas)
        window.addEventListener('openMarkerOld_Terrain', onOld)
        window.addEventListener('keydown', onEscape)
        return () => {
            window.removeEventListener('openMarkerSensor_DashBoard', onSensor)
            window.removeEventListener('openMarkerArm_Robotic', onArm)
            window.removeEventListener('openMarkerResume', onResume)
            window.removeEventListener('openMarkerCalendar', onCalendar)
            window.removeEventListener('openMarkerSnow_Globe', onSnow)
            window.removeEventListener('openMarkerChristmas', onChristmas)
            window.removeEventListener('openMarkerOld_Terrain', onOld)
            window.removeEventListener('keydown', onEscape)
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
            {sensorModalOpen && <MarkerSensor_DashBoard onClose={() => setSensorModalOpen(false)} />}
            {armModalOpen    && <MarkerArm_Robotic      onClose={() => setArmModalOpen(false)} />}
            {resumeModalOpen && <MarkerResume           onClose={() => setResumeModalOpen(false)} />}
            {calendarModalOpen && <MarkerCalendar       onClose={() => setCalendarModalOpen(false)} />}
            {snowModalOpen     && <MarkerSnow_Globe     onClose={() => setSnowModalOpen(false)} />}
            {christmasModalOpen && <MarkerChristmas     onClose={() => setChristmasModalOpen(false)} />}
            {oldModalOpen       && <MarkerOld_Terrain   onClose={() => setOldModalOpen(false)} />}

            <KeyboardControls
                map={[
                    { name: 'forward',   keys: ['ArrowUp',    'KeyW'] },
                    { name: 'backward',  keys: ['ArrowDown',  'KeyS'] },
                    { name: 'leftward',  keys: ['ArrowLeft',  'KeyA'] },
                    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
                    { name: 'jump',      keys: ['Space'] },
                    { name: 'sprint',    keys: ['ShiftLeft'] },
                ]}
            >
                <Canvas
                    shadows
                    dpr={[1, 1.5]}
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
