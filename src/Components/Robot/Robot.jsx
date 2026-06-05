import { Suspense } from 'react'
import RobotBushes from './RobotBushes.jsx'
import RobotTree from './RobotTrees.jsx'
import Sensor from './Sensor.jsx'
import HolographicPlanet from './Holographic/HolographicPlanet.jsx'
import HolographicSatellite from './Holographic/HolographicSatellite.jsx'
import HolographicCosmic from './Holographic/HolographicCosmic.jsx'
import HalftoneCube from './Halftone/HalftoneCube.jsx'
import HalftoneIcosahedron from './Halftone/HalftoneIcosahedron.jsx'
import HalftoneTorusKnot from './Halftone/HalftoneTrousKont.jsx'
import GpgpuRobot from './GPGPU/GpgpuRobot.jsx'
import GpgpuEarth from './GPGPU/GpgpuEarth.jsx'

export default function Robot({ nodes })
{
    return (
        <>
            <RobotBushes nodes={ nodes } />
            <RobotTree nodes={ nodes } />
            <Sensor nodes={ nodes } />
            <HolographicPlanet />
            <HolographicSatellite />
            <HolographicCosmic />
            <HalftoneCube />
            <HalftoneIcosahedron />
            <HalftoneTorusKnot />
            <Suspense fallback={null}>
                <GpgpuRobot />
            </Suspense>
            <Suspense fallback={null}>
                <GpgpuEarth />
            </Suspense>
        </>
    )
}
