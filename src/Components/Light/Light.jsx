import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls, folder } from 'leva'
import { useTime } from '../Context/TimeContext'

export default function Lights() {
    const lightRef = useRef()
    const ambientRef = useRef()
    const { scene } = useThree()
    const { timeRef } = useTime()
    
    const data = {
        day: {
            lightColor: '#ffffff', 
            lightIntensity: 1.2, 
            shadowColor: '#0085db', 
            fogColor: '#b4fbff', 
            near: 6, 
            far: 45
        },
        dusk: {
            lightColor: '#ff4141', 
            lightIntensity: 1.2, 
            shadowColor: '#840f85', 
            fogColor: '#724cff', 
            near: 6, 
            far: 45
        },
        night: {
            lightColor: '#3240ff', 
            lightIntensity: 3.0, 
            shadowColor: '#0032bd', 
            fogColor: '#070e29', 
            near: 10, 
            far: 60 
        },
        dawn: {
            lightColor: '#ff9000', 
            lightIntensity: 1.2, 
            shadowColor: '#db4700', 
            fogColor: '#ffa385', 
            near: 6, 
            far: 45
        }
    }

    const config = useControls('Time System', {
        enableFog: { value: false, label: 'Enable Fog' }, 

        'Day Settings': folder({
            dayColor: { value: data.day.lightColor, label: 'LightColor' },
            dayIntensity: { value: data.day.lightIntensity, label: 'Intensity' },
            dayShadow: { value: data.day.shadowColor, label: 'ShadowColor' },
            dayFog: { value: data.day.fogColor, label: 'FogColor' },
            dayNear: { value: data.day.near, label: 'Near' },
            dayFar: { value: data.day.far, label: 'Far' }
        }, { collapsed: true }),

        'Dusk Settings': folder({
            duskColor: { value: data.dusk.lightColor, label: 'LightColor' },
            duskIntensity: { value: data.dusk.lightIntensity, label: 'Intensity' },
            duskShadow: { value: data.dusk.shadowColor, label: 'ShadowColor' },
            duskFog: { value: data.dusk.fogColor, label: 'FogColor' },
            duskNear: { value: data.dusk.near, label: 'Near' },
            duskFar: { value: data.dusk.far, label: 'Far' }
        }, { collapsed: true }),

        'Night Settings': folder({
            nightColor: { value: data.night.lightColor, label: 'LightColor' },
            nightIntensity: { value: data.night.lightIntensity, label: 'Intensity' },
            nightShadow: { value: data.night.shadowColor, label: 'ShadowColor' },
            nightFog: { value: data.night.fogColor, label: 'FogColor' },
            nightNear: { value: data.night.near, label: 'Near' },
            nightFar: { value: data.night.far, label: 'Far' }
        }, { collapsed: true }),

        'Dawn Settings': folder({
            dawnColor: { value: data.dawn.lightColor, label: 'LightColor' },
            dawnIntensity: { value: data.dawn.lightIntensity, label: 'Intensity' },
            dawnShadow: { value: data.dawn.shadowColor, label: 'ShadowColor' },
            dawnFog: { value: data.dawn.fogColor, label: 'FogColor' },
            dawnNear: { value: data.dawn.near, label: 'Near' },
            dawnFar: { value: data.dawn.far, label: 'Far' }
        }, { collapsed: true }),
    })


    useFrame(() => {
        const currentProgress = timeRef.current
        const radius = 35
        const angle = (currentProgress - 0.25) * Math.PI * 2 
        const x = Math.cos(angle) * (radius + 20) 
        const y = Math.sin(angle) * 30 + 60 
        const z = Math.sin(angle) * 10 + 50 

        if (lightRef.current) {
            lightRef.current.position.set(x, y, z)
            lightRef.current.lookAt(0, 0, 0) 
        }

        const getParams = (key) => {
            const c = config;
            if (key === 'day') return {
                lightColor: c.dayColor, lightIntensity: c.dayIntensity, 
                shadowColor: c.dayShadow, fogColor: c.dayFog, near: c.dayNear, far: c.dayFar
            }
            if (key === 'dusk') return {
                lightColor: c.duskColor, lightIntensity: c.duskIntensity, 
                shadowColor: c.duskShadow, fogColor: c.duskFog, near: c.duskNear, far: c.duskFar
            }
            if (key === 'night') return {
                lightColor: c.nightColor, lightIntensity: c.nightIntensity, 
                shadowColor: c.nightShadow, fogColor: c.nightFog, near: c.nightNear, far: c.nightFar
            }
            if (key === 'dawn') return {
                lightColor: c.dawnColor, lightIntensity: c.dawnIntensity, 
                shadowColor: c.dawnShadow, fogColor: c.dawnFog, near: c.dawnNear, far: c.dawnFar
            }
            return data.day 
        }

        let from, to, alpha
        if (currentProgress < 0.25) { 
            from = getParams('night'); to = getParams('dawn'); alpha = (currentProgress - 0) / 0.25;
        } else if (currentProgress < 0.5) { 
            from = getParams('dawn'); to = getParams('day'); alpha = (currentProgress - 0.25) / 0.25;
        } else if (currentProgress < 0.75) { 
            from = getParams('day'); to = getParams('dusk'); alpha = (currentProgress - 0.5) / 0.25;
        } else { 
            from = getParams('dusk'); to = getParams('night'); alpha = (currentProgress - 0.75) / 0.25;
        }

        const lerpColor = (c1, c2) => new THREE.Color(c1).lerp(new THREE.Color(c2), alpha)
        const lerpVal = (v1, v2) => THREE.MathUtils.lerp(v1, v2, alpha)

        if (scene.fog) {
            scene.fog.color = lerpColor(from.fogColor, to.fogColor)
            
            if (config.enableFog) {
                scene.fog.near = lerpVal(from.near, to.near)
                scene.fog.far = lerpVal(from.far, to.far)
            } else {
                scene.fog.near = 100000
                scene.fog.far = 100000
            }
        }
        
        scene.background = lerpColor(from.shadowColor, to.shadowColor)

        if (lightRef.current) {
            lightRef.current.color = lerpColor(from.lightColor, to.lightColor)
            lightRef.current.intensity = lerpVal(from.lightIntensity, to.lightIntensity)
        }

        if (ambientRef.current) {
            ambientRef.current.color = lerpColor(from.shadowColor, to.shadowColor)
            ambientRef.current.intensity = 1.5 
        }
    })

    return <>
        <fog attach="fog" args={['#000000', 10, 50]} />
        
        <color attach="background" args={['#000000']} />

        <directionalLight
            ref={lightRef}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.001}
            shadow-normalBias={0.6}
            shadow-camera-top={60}
            shadow-camera-right={60}
            shadow-camera-bottom={-60}
            shadow-camera-left={-60}
            shadow-camera-near={1}
            shadow-camera-far={200}
        />
        
        <ambientLight ref={ambientRef} intensity={1.5} />
    </>
}