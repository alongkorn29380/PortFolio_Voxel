import { useMemo } from "react"
import { useControls, folder } from "leva" 

import Bushes from '../Bushes/Bushes.jsx'

export default function ForestBushes({ nodes })
{
    const data = {
        Green: 
        { 
            top: '#8ab060', 
            mid: '#5a6e38', 
            bottom: '#425228' 
        },
        Orange:
        { 
            top: '#ffb366', 
            mid: '#e67300', 
            bottom: '#994d00' 
        },
        Pink: 
        { 
            top: '#ff99cc', 
            mid: '#d147a3', 
            bottom: '#801a5e' 
        }
    }

    const { 
        GreenTop, GreenMid, GreenBottom,
        OrangeTop, OrangeMid, OrangeBottom,
        PinkTop, PinkMid, PinkBottom
    } = useControls('Bushes', {
        'Forest Bushes': folder({
            GreenTop: { value: data.Green.top, label: 'Green Top' },
            GreenMid: { value: data.Green.mid, label: 'Green Mid' },
            GreenBottom: { value: data.Green.bottom, label: 'Green Bottom' },

            OrangeTop: { value: data.Orange.top, label: 'Orange Top' },
            OrangeMid: { value: data.Orange.mid, label: 'Orange Mid' },
            OrangeBottom: { value: data.Orange.bottom, label: 'Orange Bottom' },
            
            PinkTop: { value: data.Pink.top, label: 'Pink Top' },
            PinkMid: { value: data.Pink.mid, label: 'Pink Mid' },
            PinkBottom: { value: data.Pink.bottom, label: 'Pink Bottom' },
        }, { collapsed: true })
    }, { collapsed: true })

    const greenBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Forest_Green') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    const orangeBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Forest_Orange') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    const pinkBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Forest_Pink') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    return (
        <>
            {greenBushes.length > 0 && (
                <Bushes
                    data = { greenBushes }
                    colors = {{ top: GreenTop, mid: GreenMid, bottom: GreenBottom }}
                />
            )}

            {pinkBushes.length > 0 && (
                <Bushes 
                    data={pinkBushes} 
                    colors={{ top: PinkTop, mid: PinkMid, bottom: PinkBottom }} 
                />
            )}

            {orangeBushes.length > 0 && (
                <Bushes 
                    data={orangeBushes} 
                    colors={{ top: OrangeTop, mid: OrangeMid, bottom: OrangeBottom }} 
                />
            )}
        </>
    )
}