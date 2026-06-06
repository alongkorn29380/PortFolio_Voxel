import { Sparkles } from '@react-three/drei'
import { useControls, folder } from 'leva'

export default function Mana()
{
    const {
        blueCount, blueColor, purpleCount, purpleColor, size, speed,
        s1_scaleX, s1_scaleY, s1_scaleZ, s1_posX, s1_posY, s1_posZ,
        s2_scaleX, s2_scaleY, s2_scaleZ, s2_posX, s2_posY, s2_posZ,
    } = useControls('Mana', {
        blueCount:   { value: 2000, min: 0, max: 10000, step: 1 },
        blueColor:   { value: '#0008ff' },
        purpleCount: { value: 2000, min: 0, max: 10000, step: 1 },
        purpleColor: { value: '#8b00ff' },
        size:        { value: 10, min: 0, max: 20, step: 0.1 },
        speed:       { value: 1,  min: 0, max: 2,  step: 0.1 },
        'Segment 1': folder({
            s1_scaleX: { value: 44.7, min: 0, max: 50,   step: 0.1, label: 'scaleX' },
            s1_scaleY: { value: 3.6,  min: 0, max: 50,   step: 0.1, label: 'scaleY' },
            s1_scaleZ: { value: 30.6, min: 0, max: 50,   step: 0.1, label: 'scaleZ' },
            s1_posX:   { value: 25,   min: -100, max: 100, step: 1, label: 'positionX' },
            s1_posY:   { value: 2,    min: -100, max: 100, step: 1, label: 'positionY' },
            s1_posZ:   { value: 31,   min: -100, max: 100, step: 1, label: 'positionZ' },
        }, { collapsed: true }),
        'Segment 2': folder({
            s2_scaleX: { value: 32, min: 0, max: 50,   step: 0.1, label: 'scaleX' },
            s2_scaleY: { value: 3.6,  min: 0, max: 50,   step: 0.1, label: 'scaleY' },
            s2_scaleZ: { value: 46.8, min: 0, max: 50,   step: 0.1, label: 'scaleZ' },
            s2_posX:   { value: 30,   min: -100, max: 100, step: 1, label: 'positionX' },
            s2_posY:   { value: 2,    min: -100, max: 100, step: 1, label: 'positionY' },
            s2_posZ:   { value: 24,   min: -100, max: 100, step: 1, label: 'positionZ' },
        }, { collapsed: true }),
    }, { collapsed: true })

    return (
        <>
            {/* Segment 1 */}
            <Sparkles count={blueCount}   position={[s1_posX, s1_posY, s1_posZ]} scale={[s1_scaleX, s1_scaleY, s1_scaleZ]} size={size} speed={speed} color={blueColor} />
            <Sparkles count={purpleCount} position={[s1_posX, s1_posY, s1_posZ]} scale={[s1_scaleX, s1_scaleY, s1_scaleZ]} size={size} speed={speed} color={purpleColor} />

            {/* Segment 2 */}
            <Sparkles count={blueCount}   position={[s2_posX, s2_posY, s2_posZ]} scale={[s2_scaleX, s2_scaleY, s2_scaleZ]} size={size} speed={speed} color={blueColor} />
            <Sparkles count={purpleCount} position={[s2_posX, s2_posY, s2_posZ]} scale={[s2_scaleX, s2_scaleY, s2_scaleZ]} size={size} speed={speed} color={purpleColor} />
        </>
    )
}
