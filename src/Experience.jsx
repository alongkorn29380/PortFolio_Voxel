import { Perf } from 'r3f-perf'
import { Suspense } from 'react'
import Terrain from './components/Terrain/Terrain'

export default function Experience(){
    return(
        <>
            <Perf position="top-left" />

            <ambientLight intensity={1.5} /> 
            
            <directionalLight position={[5, 5, 5]} intensity={2} />

            <Suspense fallback={null}>
                <Terrain />
            </Suspense>
        </>
    )
}