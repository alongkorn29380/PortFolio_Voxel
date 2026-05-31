import { RigidBody, CapsuleCollider, useRapier } from "@react-three/rapier"
import { useGLTF, useKeyboardControls, useAnimations } from "@react-three/drei"
import { Suspense, useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from 'three'
import { useControls } from 'leva'
import { playerPos } from '../../playerStore'

useGLTF.preload("/Models/Human/Chibi.glb")

// Pre-allocated reusable objects — never created inside useFrame
const _targetVel      = new THREE.Vector3()
const _cameraPosition = new THREE.Vector3()
const _cameraTarget   = new THREE.Vector3()
const _targetQuat     = new THREE.Quaternion()
const _rotationAxis   = new THREE.Vector3(0, 1, 0)

export default function Player({ cameraActive, ...props })
{
    const { scene, animations } = useGLTF("/Models/Human/Chibi.glb")
    const body      = useRef()
    const modelRef  = useRef()
    const logoMesh  = useRef(null)

    const [subscribeKeys, getKeys] = useKeyboardControls()
    const rapier = useRapier()

    const { actions } = useAnimations(animations, modelRef)
    const animationState = useRef("Standing")
    const isGrounded     = useRef(false)

    const [smoothedCameraPosition] = useState(() => new THREE.Vector3(2, -20, 5))
    const [smoothedCameraTarget]   = useState(() => new THREE.Vector3(2, 2.25, 5))
    const introTimer = useRef(0)

    const { logoColor, logoIntensity } = useControls("Logo Glow", {
        logoColor: '#141717',
        logoIntensity: { value: 10, min: 0, max: 50, step: 0.5 }
    }, { collapsed: true })

    const { cameraX, cameraY, cameraZ } = useControls("Camera Model", {
        cameraX: { value: 7, min: 0, max: 100, step: 1.0 },
        cameraY: { value: 7, min: 0, max: 100, step: 1.0 },
        cameraZ: { value: 4, min: 0, max: 100, step: 1.0 }
    }, { collapsed: true })

    useEffect(() => {
        const onTeleport = (e) => {
            if (!body.current) return
            const { x, y, z } = e.detail
            body.current.setTranslation({ x, y, z }, true)
            body.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
        }
        window.addEventListener('teleport', onTeleport)
        return () => window.removeEventListener('teleport', onTeleport)
    }, [])

    useEffect(() =>
    {
        actions["Standing"]?.play()
        animationState.current = "Standing"

        // Traverse once — cache logo mesh, set shadows
        scene.traverse((child) =>
        {
            if (!child.isMesh) return
            child.castShadow = true

            if (child.name === "Logo003")
            {
                logoMesh.current = child
                child.material = new THREE.MeshStandardMaterial()
                child.material.toneMapped = false
                child.material.needsUpdate = true
            }
        })
    }, [actions, scene])

    useFrame((state, delta) =>
    {
        if (!body.current) return

        // Logo glow — direct ref, no traverse
        if (logoMesh.current)
        {
            logoMesh.current.material.color.set(logoColor)
            logoMesh.current.material.emissive.set(logoColor)
            logoMesh.current.material.emissiveIntensity = logoIntensity
        }

        // Ground detection
        const bodyOrigin = body.current.translation()
        playerPos.set(bodyOrigin.x, bodyOrigin.y, bodyOrigin.z)
        const ray = new rapier.rapier.Ray(
            { x: bodyOrigin.x, y: bodyOrigin.y + 0.8, z: bodyOrigin.z },
            { x: 0, y: -1, z: 0 }
        )
        isGrounded.current = rapier.world.castRay(ray, 0.85, true, null, null, null, null, body.current) !== null

        // Movement
        const { forward, backward, leftward, rightward, sprint } = getKeys()
        const isMoving = forward || backward || leftward || rightward
        const SPEED = sprint ? 3.5 : 2
        const vel = body.current.linvel()

        _targetVel.set(0, 0, 0)
        if (forward)   _targetVel.z -= SPEED
        if (backward)  _targetVel.z += SPEED
        if (leftward)  _targetVel.x -= SPEED
        if (rightward) _targetVel.x += SPEED

        body.current.setLinvel({ x: _targetVel.x, y: vel.y, z: _targetVel.z }, true)

        // Animation
        const fallName = actions.Falling ? "Falling" : (actions.Fall ? "Fall" : "Jump")
        const newState = !isGrounded.current ? fallName
                       : isMoving            ? (sprint ? "Run" : "Walk")
                       :                       "Standing"

        if (!isMoving) body.current.setLinvel({ x: 0, y: vel.y, z: 0 }, true)

        if (newState !== animationState.current && actions[newState])
        {
            actions[animationState.current]?.fadeOut(0.1)
            actions[newState]?.reset().fadeIn(0.1).play()
            animationState.current = newState
        }

        // Rotation
        if (isMoving && isGrounded.current && modelRef.current)
        {
            _targetQuat.setFromAxisAngle(_rotationAxis, Math.atan2(_targetVel.x, _targetVel.z))
            modelRef.current.quaternion.slerp(_targetQuat, delta * 15)
        }

        // Camera — intro pan from top, lerp speed 0.4 → 5 over 4 s
        if (cameraActive)
        {
            _cameraPosition.copy(bodyOrigin).add({ x: cameraX, y: cameraY, z: cameraZ })
            _cameraTarget.copy(bodyOrigin)
            _cameraTarget.y += 0.25

            introTimer.current = Math.min(introTimer.current + delta, 4)
            const lerpSpeed = 0.4 + (introTimer.current / 4) * 4.6

            smoothedCameraPosition.lerp(_cameraPosition, lerpSpeed * delta)
            smoothedCameraTarget.lerp(_cameraTarget, lerpSpeed * delta)

            state.camera.position.copy(smoothedCameraPosition)
            state.camera.lookAt(smoothedCameraTarget)
        }
    })

    return (
        <Suspense fallback={null}>
            <RigidBody
                {...props}
                ref={body}
                colliders={false}
                enabledRotations={[false, false, false]}
                castShadow
                friction={0}
            >
                <CapsuleCollider args={[0.3, 0.45]} position={[0.02, 0.85, 0]} />
                <group ref={modelRef} scale={0.1} position={[0, 0.1, 0]}>
                    <primitive object={scene} />
                </group>
            </RigidBody>
        </Suspense>
    )
}
