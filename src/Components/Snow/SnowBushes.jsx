import { useMemo } from "react"
import { useControls, folder } from "leva" 

import Bushes from '../Bushes/Bushes.jsx'

export default function ForestBushes({ nodes })
{
    const data = {
        Blue: 
        { 
            top: '#CCFFFF', 
            mid: '#44CCFF', 
            bottom: '#004488' 
        },
        Green:
        { 
            top: '#AAFFFF', 
            mid: '#448888', 
            bottom: '#113333' 
        },
        White: 
        { 
            top: '#FFFFFF', 
            mid: '#BBDDFF', 
            bottom: '#6688AA' 
        }
    }

    const { 
        BlueTop, BlueMid, BlueBottom,
        GreenTop, GreenMid, GreenBottom,
        WhiteTop, WhiteMid, WhiteBottom
    } = useControls('Bushes', {
        'Snow Bushes': folder({
            BlueTop: { value: data.Blue.top, label: 'Blue Top' },
            BlueMid: { value: data.Blue.mid, label: 'Blue Mid' },
            BlueBottom: { value: data.Blue.bottom, label: 'Blue Bottom' },

            GreenTop: { value: data.Green.top, label: 'Green Top' },
            GreenMid: { value: data.Green.mid, label: 'Green Mid' },
            GreenBottom: { value: data.Green.bottom, label: 'Green Bottom' },
            
            WhiteTop: { value: data.White.top, label: 'White Top' },
            WhiteMid: { value: data.White.mid, label: 'White Mid' },
            WhiteBottom: { value: data.White.bottom, label: 'White Bottom' },
        }, { collapsed: true })
    }, { collapsed: true })

    const blueBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Snow_Blue') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    const greenBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Snow_Green') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    const whiteBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Snow_White') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    return (
        <>
            {blueBushes.length > 0 && (
                <Bushes
                    data = { blueBushes }
                    colors = {{ top: BlueTop, mid: BlueMid, bottom: BlueBottom }}
                />
            )}

            {greenBushes.length > 0 && (
                <Bushes 
                    data={greenBushes} 
                    colors={{ top: GreenTop, mid: GreenMid, bottom: GreenBottom }} 
                />
            )}

            {whiteBushes.length > 0 && (
                <Bushes 
                    data={whiteBushes} 
                    colors={{ top: WhiteTop, mid: WhiteMid, bottom: WhiteBottom }} 
                />
            )}
        </>
    )
}