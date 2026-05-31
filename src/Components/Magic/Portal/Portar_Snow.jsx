import { shaderMaterial, Html } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { useControls, folder } from 'leva'
import * as THREE from 'three'
import { playerPos } from '../../../playerStore'

import portalVertexShader from './shaders/vertex.glsl'
import portalFragmentShader from './shaders/fragment.glsl'

const PortalColors = {
    colorStart: '#609ee5',
    colorEnd: '#ffffff'
}

const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color(PortalColors.colorStart),
        uColorEnd: new THREE.Color(PortalColors.colorEnd),
    },
    portalVertexShader,
    portalFragmentShader
)

extend({ PortalMaterial })

const MATERIAL_PROPS = {
    side: THREE.DoubleSide,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
}

export default function Portal({ nodes })
{
    const { colorStart, colorEnd } = useControls('Portals', {
        Snow: folder({
            colorStart: { value: PortalColors.colorStart },
            colorEnd: { value: PortalColors.colorEnd },
        }, { collapsed: true })
    }, { collapsed: true })

    const matA = useRef()
    const matB = useRef()

    const [nearPortal, setNearPortal] = useState(null)
    const nearRef = useRef(null)

    const [posA] = useState(() => {
        const pos = new THREE.Vector3()
        nodes['Portal_Light003'].getWorldPosition(pos)
        return pos
    })

    const [posB] = useState(() => {
        const pos = new THREE.Vector3()
        nodes['Portal_Light006'].getWorldPosition(pos)
        return pos
    })

    useEffect(() => {
        const onKey = (e) => {
            if (e.code !== 'Enter' || !nearRef.current) return
            const dest = nearRef.current === 'A' ? posB : posA
            window.dispatchEvent(new CustomEvent('teleport', {
                detail: { x: dest.x, y: dest.y, z: dest.z }
            }))
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [posA, posB])

    useFrame((state, delta) => {
        matA.current.uTime += delta
        matB.current.uTime += delta

        const distA = playerPos.distanceTo(posA)
        const distB = playerPos.distanceTo(posB)

        const next = distA < 2 ? 'A' : distB < 2 ? 'B' : null
        if (next !== nearRef.current) {
            nearRef.current = next
            setNearPortal(next)
        }
    })

    const promptPos = nearPortal === 'A'
        ? [posA.x, posA.y + 1.5, posA.z]
        : [posB.x, posB.y + 1.5, posB.z]

     const shaderProps = (ref) => ({
            ref,
            uColorStart: new THREE.Color(colorStart),
            uColorEnd: new THREE.Color(colorEnd),
            ...MATERIAL_PROPS,
    })

    return (
        <>
            {/* Portal A */}
            <mesh
                geometry={nodes['Portal_Light003'].geometry}
                position={nodes['Portal_Light003'].position}
                rotation={nodes['Portal_Light003'].rotation}
                frustumCulled={false}
                renderOrder={1}
            >
                <portalMaterial {...shaderProps(matA)} />
            </mesh>

            {/* Portal B */}
            <mesh
                geometry={nodes['Portal_Light006'].geometry}
                position={nodes['Portal_Light006'].position}
                rotation={nodes['Portal_Light006'].rotation}
                frustumCulled={false}
                renderOrder={1}
            >
                <portalMaterial {...shaderProps(matB)} />
            </mesh>

            {nearPortal && (
                <Html position={promptPos} center style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.75)',
                        color: '#fff',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontFamily: 'sans-serif',
                        whiteSpace: 'nowrap',
                    }}>
                        Press <strong>Enter</strong> to teleport (Snow)
                    </div>
                </Html>
            )}
        </>
    )
}