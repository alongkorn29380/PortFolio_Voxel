import { useMemo } from "react"
import { useControls, folder } from "leva" 
import Trees from '../Trees/Trees.jsx'

function TreeBuilder({ nodes, nameFilter, colors, emission, leafHeight, scaleMultiplier }) 
{

    const trunks = useMemo(() => {
        const allNodes = Object.values(nodes)
        return allNodes.filter((node) => node.name.includes(nameFilter) && node.isMesh)
    }, [nodes, nameFilter])

    if (trunks.length === 0) return null

    return (
        <group>

            {trunks.map((node) => (
                <primitive key={node.uuid} object={node} castShadow receiveShadow />
            ))}

            <Trees 
                data={trunks} 
                colors={colors}
                uEmission={emission}
                leafHeight={leafHeight}
                scaleMultiplier={scaleMultiplier} 
            />
        </group>
    )
}

export default function RobotTreeBlue({ nodes })
{
    const data = {
        Blue: 
        { 
            top: '#4da6ff',
             mid: '#0066cc', 
             bottom: '#003366' 
        },
        Lemon:
        { 
            top: '#BBFF00', 
            mid: '#44AA00', 
            bottom: '#052205' 
        },
        Red:
        { 
            top: '#FF0000', 
            mid: '#880000', 
            bottom: '#220000' 
        }
    }

    const { BlueTop, BlueMid, BlueBottom, BlueEmission,
        LemonTop, LemonMid, LemonBottom, LemonEmission,
        RedTop, RedMid, RedBottom, RedEmission
    } = useControls('Trees', {
        'Robot Tree': folder({
            BlueTop: { value: data.Blue.top, label: 'Blue Top' },
            BlueMid: { value: data.Blue.mid, label: 'Blue Mid' },
            BlueBottom: { value: data.Blue.bottom, label: 'Blue Bottom' },
            BlueEmission: { value: 1.5, min: 0.0, max: 10.0, step: 0.1 },

            LemonTop: { value: data.Lemon.top, label: 'Lemon Top' },
            LemonMid: { value: data.Lemon.mid, label: 'Lemon Mid' },
            LemonBottom: { value: data.Lemon.bottom, label: 'Lemon Bottom' },
            LemonEmission: { value: 1.5, min: 0.0, max: 10.0, step: 0.1 },

            RedTop: { value: data.Red.top, label: 'Red Top' },
            RedMid: { value: data.Red.mid, label: 'Red Mid' },
            RedBottom: { value: data.Red.bottom, label: 'Red Bottom' },
            RedEmission: { value: 1.5, min: 0.0, max: 10.0, step: 0.1 }
        })
    })

    return (
        <>
            
            <TreeBuilder 
                nodes={nodes} nameFilter="Tree_Robot_Blue" 
                colors={{ top: BlueTop, mid: BlueMid, bottom: BlueBottom }}
                emission={BlueEmission} leafHeight={1.8} scaleMultiplier={3} 
            />

            <TreeBuilder 
                nodes={nodes} nameFilter="Tree_Robot_Lemon" 
                colors={{ top: LemonTop, mid: LemonMid, bottom: LemonBottom }}
                emission={LemonEmission} leafHeight={1.8} scaleMultiplier={3} 
            />

            <TreeBuilder 
                nodes={nodes} nameFilter="Tree_Robot_Red" 
                colors={{ top: RedTop, mid: RedMid, bottom: RedBottom }}
                emission={RedEmission} leafHeight={1.8} scaleMultiplier={3} 
            />
        </>
    )
}