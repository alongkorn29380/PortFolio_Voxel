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
        BrownTop, BrownMid, BrownBottom,
        GoldTop, GoldMid, GoldBottom,
        YellowTop, YellowMid, YellowBottom
    } = useControls('Bushes', {
        'Desert Bushes': folder({
            BrownTop: { value: data.Brown.top, label: 'Brown Top' },    
            BrownMid: { value: data.Brown.mid, label: 'Brown Mid' },
            BrownBottom: { value: data.Brown.bottom, label: 'Brown Bottom' },

            GoldTop: { value: data.Gold.top, label: 'Gold Top' },
            GoldMid: { value: data.Gold.mid, label: 'Gold Mid' },
            GoldBottom: { value: data.Gold.bottom, label: 'Gold Bottom' },
            
            YellowTop: { value: data.Yellow.top, label: 'Yellow Top' },
            YellowMid: { value: data.Yellow.mid, label: 'Yellow Mid' },
            YellowBottom: { value: data.Yellow.bottom, label: 'Yellow Bottom' },
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
                    colors={{ top: BrownTop, mid: BrownMid, bottom: BrownBottom }} 
                />
            )}

            {goldBushes.length > 0 && (
                <Bushes 
                    data={goldBushes} 
                    colors={{ top: GoldTop, mid: GoldMid, bottom: GoldBottom }} 
                />
            )}

            {YellowBushes.length > 0 && (
                <Bushes 
                    data={YellowBushes}
                    colors={{ top: YellowTop, mid: YellowMid, bottom: YellowBottom }}
                />
            )}
        </>
    )
}