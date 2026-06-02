import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { playerPos } from '../../../playerStore'
import * as THREE from 'three'

export function useMorphProximity({
    geometry,
    particles,
    indexRef,
    materialRef,
    position,
    proximityRange,
    nearIndex,
    farIndex,
    duration = 3,
}) {
    const morphRef       = useRef({ active: false, elapsed: 0 })
    const objectPosRef   = useRef(new THREE.Vector3())
    const proximityState = useRef('far')
    const [isNear, setIsNear] = useState(false)
    const [showPrompt, setShowPrompt] = useState(false)

    const morph = (index) => {
        geometry.attributes.position        = particles.positions[indexRef.current]
        geometry.attributes.aPositionTarget = particles.positions[index]
        geometry.attributes.position.needsUpdate        = true
        geometry.attributes.aPositionTarget.needsUpdate = true

        morphRef.current.active  = true
        morphRef.current.elapsed = 0
        if (materialRef.current) materialRef.current.uniforms.uProgress.value = 0
        indexRef.current = index
    }

    useFrame((state, delta) => {
        // Proximity check
        objectPosRef.current.set(position[0], position[1], position[2])
        const dist = playerPos.distanceTo(objectPosRef.current)

        if (dist < proximityRange && proximityState.current !== 'near') {
            proximityState.current = 'near'
            setIsNear(true)
            setShowPrompt(false)
            morph(nearIndex)
        } else if (dist >= proximityRange && proximityState.current !== 'far') {
            proximityState.current = 'far'
            setIsNear(false)
            setShowPrompt(false)
            morph(farIndex)
        }

        // Animate progress
        const m = morphRef.current
        if (!m.active || !materialRef.current) return
        m.elapsed += delta
        const t = Math.min(m.elapsed / duration, 1)
        materialRef.current.uniforms.uProgress.value = t
        if (t >= 1) {
            m.active = false
            if (proximityState.current === 'near') setShowPrompt(true)
        }
    })

    return { proximityState, isNear, showPrompt }
}
