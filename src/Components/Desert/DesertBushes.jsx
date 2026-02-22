import { useMemo } from 'react'
import { useControls, folder } from 'leva'

import Bushes from '../Bushes/Bushes.jsx'

export default function DesertBushes({ nodes })
{
    const data = {
        Brown: 
        {
            top: '#FF7755',
            mid: '#883311',
            bottom: '#220500'
        },
        Gold: 
        {
            top: '#FFEE88',
            mid: '#CCAA00',
            bottom: '#443300'
        },
        Yellow:
        {
            top: '#F5DEB3',
            mid: '#D2B48C',
            bottom: '#8B4513'
        }
    }

    const {
        brownTop, brownMid, brownBottom,
        goldTop, goldMid, goldBottom,
        yellowTop, yellowMid, yellowBottom
    } = useControls('Bushes', {
        'Desert Bushes': folder({
            brownTop: { value: data.Brown.top, label: 'Brown Top' },    
            brownMid: { value: data.Brown.mid, label: 'Brown Mid' },
            brownBottom: { value: data.Brown.bottom, label: 'Brown Bottom' },
            goldTop: { value: data.Gold.top, label: 'Gold Top' },
            goldMid: { value: data.Gold.mid, label: 'Gold Mid' },
            goldBottom: { value: data.Gold.bottom, label: 'Gold Bottom' },
            yellowTop: { value: data.Yellow.top, label: 'Yellow Top' },
            yellowMid: { value: data.Yellow.mid, label: 'Yellow Mid' },
            yellowBottom: { value: data.Yellow.bottom, label: 'Yellow Bottom' },
        }, { collapsed: true })
    }, { collapsed: true })

    const brownBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Desert_Brown') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    const goldBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Desert_Gold') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    const YellowBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Desert_Yellow') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    return (
        <>
            {brownBushes.length > 0 && (
                <Bushes 
                    data={brownBushes} 
                    colors={{ top: brownTop, mid: brownMid, bottom: brownBottom }} 
                />
            )}

            {goldBushes.length > 0 && (
                <Bushes 
                    data={goldBushes} 
                    colors={{ top: goldTop, mid: goldMid, bottom: goldBottom }} 
                />
            )}

            {YellowBushes.length > 0 && (
                <Bushes 
                    data={YellowBushes}
                    colors={{ top: yellowTop, mid: yellowMid, bottom: yellowBottom }}
                />
            )}
        </>
    )
}