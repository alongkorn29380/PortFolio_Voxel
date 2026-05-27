import { useRef, useMemo } from 'react'
import { useFrame, useLoader, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'

import snowImg1 from '/Textures/SnowFalls/snow_1.png'
import snowImg2 from '/Textures/SnowFalls/snow_2.png'
import snowImg3 from '/Textures/SnowFalls/snow_3.png'

import SnowFallVertexShader from './shaders/vertex.glsl'
import SnowFallFragmentShader from './shaders/fragment.glsl'

// Shader
const SnowFallMaterial = shaderMaterial(
    {
        map: null,
        uSize: 30.0,
        opacity: 0.9,
        color: new THREE.Color('#ffffff')
    },
    SnowFallVertexShader,
    SnowFallFragmentShader
)

extend({ SnowFallMaterial })

function createSnowData(count, minX, maxX, minZ, maxZ, areaHeight) {
  const positions = new Float32Array(count * 3)
  const rotations = new Float32Array(count)
  const particlesData = []

  for (let i = 0; i < count; i++) {
    const x = minX + Math.random() * (maxX - minX)
    const y = Math.random() * areaHeight
    const z = minZ + Math.random() * (maxZ - minZ)

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    rotations[i] = Math.random() * Math.PI * 2 

    particlesData.push({
      initialX: x,
      initialZ: z,
      velocityY: 0.02 + Math.random() * 0.005,
      wobbleSpeed: 0.5 + Math.random() * 1.5,
      wobbleAmp: 0.3 + Math.random() * 0.7,        
      randomOffset: Math.random() * 100,
      rotationSpeed: (Math.random() - 0.5) * 0.05 
    })
  }

  return { positions, rotations, particlesData }
}

// Group Snow
function SnowGroup({ texture, count, size, minX, maxX, minZ, maxZ, areaHeight }) {
  const pointsRef = useRef()

  const material = useMemo(() => {
    const mat = new SnowFallMaterial()
    mat.uniforms.map.value = texture
    mat.transparent = true
    mat.depthWrite = false
    return mat
  }, [texture])

  const { positions, rotations, particlesData } = useMemo(
    () => createSnowData(count, minX, maxX, minZ, maxZ, areaHeight),
    [count, minX, maxX, minZ, maxZ, areaHeight]
  )

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    material.uniforms.uSize.value = size

    if (pointsRef.current) {
      const currentPositions = pointsRef.current.geometry.attributes.position.array
      const currentRotations = pointsRef.current.geometry.attributes.rotation.array

      for (let i = 0; i < count; i++) {
        const data = particlesData[i]

        currentPositions[i * 3 + 1] -= data.velocityY
        currentPositions[i * 3] = data.initialX + Math.sin(time * data.wobbleSpeed + data.randomOffset) * data.wobbleAmp
        currentPositions[i * 3 + 2] = data.initialZ + Math.cos(time * data.wobbleSpeed + data.randomOffset) * (data.wobbleAmp * 0.5)

        // Rotation
        currentRotations[i] += data.rotationSpeed

        if (currentPositions[i * 3 + 1] < 0) {
          currentPositions[i * 3 + 1] = areaHeight
          
          data.initialX = minX + Math.random() * (maxX - minX)
          data.initialZ = minZ + Math.random() * (maxZ - minZ)
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.geometry.attributes.rotation.needsUpdate = true 
    }
  })

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry key={count}>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-rotation"
          count={rotations.length}
          array={rotations}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  )
}

export default function SnowFall() {
  const [tex1, tex2, tex3] = useLoader(THREE.TextureLoader, [
    snowImg1,
    snowImg2,
    snowImg3
  ])

  useMemo(() => {
    [tex1, tex2, tex3].forEach(t => t.minFilter = THREE.LinearFilter)
  }, [tex1, tex2, tex3])

  // Controls
  const { posY, count, snowSize, minX, maxX, minZ, maxZ, areaHeight } = useControls('Snow Fall Zone', {
    posY:       { value: 0,    min: -10,  max: 50,   step: 0.5 },
    areaHeight: { value: 15,   min: 5,    max: 50,   step: 1   },
    snowSize:   { value: 8,   min: 5,    max: 100,  step: 1   },
    count:      { value: 300,  min: 10,   max: 500,  step: 10  },
    
    // Position
    minX:       { value: -49,  min: -100, max: 100,  step: 1   },
    maxX:       { value: -3,  min: -100, max: 100,  step: 1   },
    minZ:       { value: 6,   min: -100, max: 100,  step: 1   },
    maxZ:       { value: 48,   min: -100, max: 100,  step: 1   },
  }, { collapsed: true })

  return (
    <group position={[0, posY, 0]}>
      <SnowGroup texture={tex1} count={count} size={snowSize} minX={minX} maxX={maxX} minZ={minZ} maxZ={maxZ} areaHeight={areaHeight} />
      <SnowGroup texture={tex2} count={count} size={snowSize} minX={minX} maxX={maxX} minZ={minZ} maxZ={maxZ} areaHeight={areaHeight} />
      <SnowGroup texture={tex3} count={count} size={snowSize} minX={minX} maxX={maxX} minZ={minZ} maxZ={maxZ} areaHeight={areaHeight} />
    </group>
  )
}