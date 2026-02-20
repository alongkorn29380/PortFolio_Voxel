import { useMemo } from "react"
import { useControls, folder } from "leva" 

import Bushes from '../Bushes/Bushes.jsx'

export default function ForestBushes({ nodes })
{
    const data = {
        green: 
        { 
            top: '#8ab060', 
            mid: '#5a6e38', 
            bottom: '#425228' 
        },
        orange:
        { 
            top: '#ffb366', 
            mid: '#e67300', 
            bottom: '#994d00' 
        },
        pink: 
        { 
            top: '#ff99cc', 
            mid: '#d147a3', 
            bottom: '#801a5e' 
        }
    }

    const { 
        greenTop, greenMid, greenBottom,
        orangeTop, orangeMid, orangeBottom,
        pinkTop, pinkMid, pinkBottom
    } = useControls('Bushes', {
        'Forest Bushes': folder({
            greenTop: { value: data.green.top, label: 'Green Top' },
            greenMid: { value: data.green.mid, label: 'Green Mid' },
            greenBottom: { value: data.green.bottom, label: 'Green Bottom' },
            orangeTop: { value: data.orange.top, label: 'Orange Top' },
            orangeMid: { value: data.orange.mid, label: 'Orange Mid' },
            orangeBottom: { value: data.orange.bottom, label: 'Orange Bottom' },
            pinkTop: { value: data.pink.top, label: 'Pink Top' },
            pinkMid: { value: data.pink.mid, label: 'Pink Mid' },
            pinkBottom: { value: data.pink.bottom, label: 'Pink Bottom' },
        })
    })

    const greenBushes = useMemo(() => 
    {
        const group = nodes.Bushes_Forest_Green
        if (!group) return []
        group.visible = false
        return group.children.length > 0 ? group.children : [group]
    }, [nodes])

    const orangeBushes = useMemo(() => 
    {
        const group = nodes.Bushes_Forest_Orange
        if (!group) return []
        group.visible = false
        return group.children.length > 0 ? group.children : [group]
    }, [nodes])

    const pinkBushes = useMemo(() => 
    {
        const group = nodes.Bushes_Forest_Pink
        if (!group) return []
        group.visible = false
        return group.children.length > 0 ? group.children : [group]
    }, [nodes])

    return (
        <>
            {greenBushes.length > 0 && (
                <Bushes
                    data = { greenBushes }
                    colors = {{ top: greenTop, mid: greenMid, bottom: greenBottom }}
                />
            )}

            {pinkBushes.length > 0 && (
                <Bushes 
                    data={pinkBushes} 
                    colors={{ top: pinkTop, mid: pinkMid, bottom: pinkBottom }} 
                />
            )}

            {orangeBushes.length > 0 && (
                <Bushes 
                    data={orangeBushes} 
                    colors={{ top: orangeTop, mid: orangeMid, bottom: orangeBottom }} 
                />
            )}
        </>
    )
}