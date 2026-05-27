import { Sparkles } from '@react-three/drei'
import { useControls } from 'leva'

export default function Mana()
{
    const { blueCount, blueColor, purpleCount, purpleColor, size, speed, scaleX, scaleY, scaleZ, positionX, positionY, positionZ } = useControls('Mana', {
        blueCount: { value: 2000, min: 0, max: 10000, step: 1 },
        blueColor: { value: '#0008ff' },
        purpleCount: { value: 2000, min: 0, max: 10000, step: 1 },
        purpleColor: { value: '#8b00ff' },
        size: { value: 10, min: 0, max: 20, step: 0.1 },
        speed: { value: 1, min: 0, max: 2, step: 0.1 },
        scaleX: { value: 43.6, min: 0, max: 50, step: 0.1 },
        scaleY: { value: 3.6, min: 0, max: 50, step: 0.1 },
        scaleZ: { value: 46.8, min: 0, max: 50, step: 0.1 },
        positionX: { value: 25, min: -100, max: 100, step: 1 },
        positionY: { value: 2, min: -100, max: 100, step: 1 },
        positionZ: { value: 24, min: -100, max: 100, step: 1 },
    }, { collapsed: true });

    return (
        <>
            <Sparkles
                count={blueCount}
                position={[positionX, positionY, positionZ]}
                scale={[scaleX, scaleY, scaleZ]}
                size={size}
                speed={speed}
                color={blueColor}
            />
            <Sparkles
                count={purpleCount}
                position={[positionX, positionY, positionZ]}
                scale={[scaleX, scaleY, scaleZ]}
                size={size}
                speed={speed}
                color={purpleColor}
            />
        </>
    )
}