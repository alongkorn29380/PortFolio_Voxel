import { Suspense } from 'react'
import RobotBushes from './RobotBushes.jsx'
import RobotTree from './RobotTrees.jsx'
import Sensor from './Sensor.jsx'
import Holographic from './Holographic/Holographic.jsx'
import HolographicSatellite from './Holographic/HolographicSatellite.jsx'
import HolographicCosmic from './Holographic/HolographicCosmic.jsx'
import Gpgpu from './GPGPU/Gpgpu.jsx'

export default function Robot({ nodes })
{
    return (
        <>
            <RobotBushes nodes={ nodes } />
            <RobotTree nodes={ nodes } />
            <Sensor nodes={ nodes } />
            <Holographic />
            <HolographicSatellite />
            <HolographicCosmic />
            <Suspense fallback={null}>
                <Gpgpu modelPath="/Models/Robots/model.glb" levaFolder="GPGPU Robot" />
            </Suspense>
        </>
    )
}
