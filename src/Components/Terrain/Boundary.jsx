import { useRef, useEffect } from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useControls } from 'leva'

const HEIGHT    = 20
const THICKNESS = 1
const SPAN      = 300

function Wall({ x, y, z, hw, hh, hd, color, opacity, show }) {
    const bodyRef = useRef()

    // Push the physics body to the new position whenever Leva values change
    useEffect(() => {
        bodyRef.current?.setTranslation({ x, y, z }, true)
    }, [x, y, z])

    return (
        <>
            {/* Physics collider — updated via ref */}
            <RigidBody ref={bodyRef} type="fixed" colliders={false} position={[x, y, z]}>
                <CuboidCollider args={[hw, hh, hd]} />
            </RigidBody>

            {/* Visual mesh — plain Three.js, moves instantly with Leva */}
            {show && (
                <mesh position={[x, y, z]}>
                    <boxGeometry args={[hw * 2, hh * 2, hd * 2]} />
                    <meshStandardMaterial color={color} transparent opacity={opacity} depthWrite={false} />
                </mesh>
            )}
        </>
    )
}

export default function Boundary() {
    const { show, opacity, north, south, west, east } = useControls('Boundary', {
        show:    { value: false, label: 'Show walls' },
        opacity: { value: 0.4, min: 0, max: 1, step: 0.05 },
        north:   { value: -47.5, min: -300, max: 300, step: 0.5, label: 'North wall (Z)' },
        south:   { value:  47.3, min: -300, max: 300, step: 0.5, label: 'South wall (Z)' },
        west:    { value: -47.8, min: -300, max: 300, step: 0.5, label: 'West wall (X)'  },
        east:    { value:  47, min: -300, max: 300, step: 0.5, label: 'East wall (X)'  },
    }, { collapsed: true })

    const hh = HEIGHT / 2
    const ht = THICKNESS / 2
    const hs = SPAN / 2
    const y  = HEIGHT / 2

    return (
        <>
            <Wall x={0}    y={y} z={north} hw={hs} hh={hh} hd={ht} color="#ff4400" opacity={opacity} show={show} />
            <Wall x={0}    y={y} z={south} hw={hs} hh={hh} hd={ht} color="#ff4400" opacity={opacity} show={show} />
            <Wall x={west} y={y} z={0}     hw={ht} hh={hh} hd={hs} color="#0088ff" opacity={opacity} show={show} />
            <Wall x={east} y={y} z={0}     hw={ht} hh={hh} hd={hs} color="#0088ff" opacity={opacity} show={show} />
        </>
    )
}
