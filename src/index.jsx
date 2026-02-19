import './style.css'
import ReactDom from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Leva } from 'leva'

import Experience from './Experience.jsx'

const root = ReactDom.createRoot(document.querySelector('#root'))

root.render(
  <>
    <Leva collapsed />
    <KeyboardControls
      map={ [
          { name: 'forward',  keys: [ 'ArrowUp', 'KeyW' ] },
          { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
          { name: 'leftward',     keys: [ 'ArrowLeft', 'KeyA' ] },
          { name: 'rightward',    keys: [ 'ArrowRight', 'KeyD' ] },
          { name: 'jump' ,    keys: [ 'Space' ] },
          { name: 'sprint',      keys: [ 'ShiftLeft' ] }
          ] }
    >
      <Canvas
        shadows
        camera={ {
            fov: 45,
            near: 0.1,
            far: 2000,
            position: [ 10, 10, 10 ]
        } }
      >
          <Experience />
      </Canvas>
    </KeyboardControls>
  </>
)