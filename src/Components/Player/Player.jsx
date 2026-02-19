import { RigidBody, CapsuleCollider, useRapier } from "@react-three/rapier"
import { useGLTF, useKeyboardControls, useAnimations } from "@react-three/drei"
import { Suspense, useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from 'three'
import { useControls } from 'leva'

export default function Player({cameraActive, ...props}) {

    const { scene, animations } = useGLTF("/Models/Human/Chibi.glb")
    const body = useRef()
    const modelRef = useRef()

    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const rapier = useRapier()

    const { actions } = useAnimations(animations, modelRef)
    const animationState = useRef("Standing")
    const isGrounded = useRef(false)

    const [ smoothedCameraPosition] = useState(()=> new THREE.Vector3(10, 10, 10))
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

    // Debug
    const { logoColor, logoIntensity } = useControls("Logo Glow", {
        logoColor: '#141717',
        logoIntensity: { 
            value: 10, 
            min: 0, 
            max: 50, 
            step: 0.5 }
    },
        { collapsed: true })
    
    const { cameraX, cameraY, cameraZ } = useControls("Camera Model", {
        cameraX: {
            value: 7,
            min: 0,
            max: 100,
            step: 1.0,
        },

        cameraY: {
            value: 7,
            min: 0,
            max: 100,
            step: 1.0,
        },

        cameraZ: {
            value: 4,
            min: 0,
            max: 100,
            step: 1.0
        }
    }, { collapsed: true})

    
    useEffect(() =>
    {
        const idleAction = actions["Standing"]
        idleAction?.play();
        animationState.current = "Standing"

        scene.traverse((child) => {
            if (child.isMesh) { 
                child.castShadow = true;
            }
            if (child.isMesh && child.name === "Logo003") {
                child.material = new THREE.MeshStandardMaterial()
                child.material.toneMapped = false 
                child.material.needsUpdate = true
            }
        })

    }, [ actions , scene]); 

    
    useFrame((state, delta) =>
    {
        if (!body.current) return; 

        scene.traverse((child) => {
            if (child.isMesh && child.name === "Logo003") {
                child.material.color.set(logoColor)
                child.material.emissive.set(logoColor)
                child.material.emissiveIntensity = logoIntensity
            }
        })

       // Ground Detection
        const colliderCenterY = 2.0
        const colliderHalfHeight = 2.0

        const rapierWorld = rapier.world;
        const bodyOrigin = body.current.translation(); 
        const rayStartPoint = { 
            x: bodyOrigin.x, 
            y: bodyOrigin.y + colliderCenterY, 
            z: bodyOrigin.z 
        };
        const dir = { x: 0, y: -1, z: 0 };
        const ray = new rapier.rapier.Ray(rayStartPoint, dir);
        const rayLength = colliderHalfHeight + 0.1; 
        const hit = rapierWorld.castRay(
            ray, rayLength, true, null, null, null, null, body.current
        )
        isGrounded.current = hit !== null; 

        // Coontrol
        const { forward, backward, leftward, rightward, sprint } = getKeys()
        const isMoving = forward || backward || leftward || rightward

        // Physics
        const WALK_SPEED = 2
        const RUN_SPEED = 3.5
        const SPEED = sprint ? RUN_SPEED : WALK_SPEED;
        const vel = body.current.linvel(); 

        const targetVel = new THREE.Vector3()
            if (forward) targetVel.z -= SPEED
            if (backward) targetVel.z += SPEED
            if (leftward) targetVel.x -= SPEED
            if (rightward) targetVel.x += SPEED
        
        const impulse = new THREE.Vector3()
            impulse.x = targetVel.x - vel.x
            impulse.z = targetVel.z - vel.z

        body.current.applyImpulse(impulse, true)

        // Animation State Managment
        const idleActionName = "Standing"
        const walkActionName = "Walk"
        const runActionName = "Run"
        const jumpActionName = "Jump"
        const fallActionName = actions.Falling ? "Falling" : (actions.Fall ? "Fall" : jumpActionName)

        let newState
        if(!isGrounded.current)
        {
            newState = fallActionName
        }
        else if(isMoving)
        {
            newState = sprint ? runActionName : walkActionName
        }
        else
        {
            newState = idleActionName
            body.current.setLinvel({ x: 0, y: vel.y, z: 0}, true)
        }
        
        // Animation Transition
        if(newState !== animationState.current && actions[newState])
        {
            const oldAction = actions[animationState.current]
            const newAction = actions[newState]
            oldAction?.fadeOut(0.1)
            newAction?.reset().fadeIn(0.1).play()
            animationState.current = newState
        }

        // Rotation Model
        if(isMoving && isGrounded.current && modelRef.current)
        {
            const targetAngle = Math.atan2(targetVel.x, targetVel.z) 
            const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0, 1, 0),
                targetAngle
            )
            modelRef.current.quaternion.slerp(targetQuaternion, delta * 15)
        }

        // Camera
        if(cameraActive)
        {
            const bodyPosition = body.current.translation()

            const cameraPosition = new THREE.Vector3()
            cameraPosition.copy(bodyPosition)
            cameraPosition.z += cameraZ
            cameraPosition.y += cameraY
            cameraPosition.x += cameraX

            const cameraTarget = new THREE.Vector3()
            cameraTarget.copy(bodyPosition)
            cameraTarget.y += 0.25

            smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
            smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

            state.camera.position.copy(smoothedCameraPosition)
            state.camera.lookAt(smoothedCameraTarget)

        }
    })
    
    return(
        <Suspense fallback={null} >
        <RigidBody
            {...props}
            ref={body}
            colliders={false}
            enabledRotations={[false, false, false]}
            castShadow
            friction={0} 
        >
            <CapsuleCollider args={[0.9, 0.5]} position={[0, 1.5, 0]} />
            
            <group ref={modelRef} scale={0.1} position={[0, 0.1, 0]}>
                <primitive object={scene} />
            </group>
        </RigidBody>
    </Suspense>
    )
}