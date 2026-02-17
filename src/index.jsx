import './style.css'
import ReactDom from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { Leva } from 'leva'

const root = ReactDom.createRoot(document.querySelector('#root'))

root.render(
  <>
    <Leva collapsed />
      <Canvas 
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 2000,
          position:[ 10, 10, 10]
        }}
      >
        <Experience />
      </Canvas>
  </>
)