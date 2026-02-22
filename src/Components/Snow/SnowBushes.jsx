import { useMemo } from "react"
import { useControls, folder } from "leva" 

import Bushes from '../Bushes/Bushes.jsx'

export default function ForestBushes({ nodes })
{
    const data = {
        blue: 
        { 
            top: '#CCFFFF', 
            mid: '#44CCFF', 
            bottom: '#004488' 
        },
        green:
        { 
            top: '#AAFFFF', 
            mid: '#448888', 
            bottom: '#113333' 
        },
        white: 
        { 
            top: '#FFFFFF', 
            mid: '#BBDDFF', 
            bottom: '#6688AA' 
        }
    }

    const { 
        blueTop, blueMid, blueBottom,
        greenTop, greenMid, greenBottom,
        whiteTop, whiteMid, whiteBottom
    } = useControls('Bushes', {
        'Snow Bushes': folder({
            blueTop: { value: data.blue.top, label: 'Blue Top' },
            blueMid: { value: data.blue.mid, label: 'Blue Mid' },
            blueBottom: { value: data.blue.bottom, label: 'Blue Bottom' },
            greenTop: { value: data.green.top, label: 'Green Top' },
            greenMid: { value: data.green.mid, label: 'Green Mid' },
            greenBottom: { value: data.green.bottom, label: 'Green Bottom' },
            whiteTop: { value: data.white.top, label: 'White Top' },
            whiteMid: { value: data.white.mid, label: 'White Mid' },
            whiteBottom: { value: data.white.bottom, label: 'White Bottom' },
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
                    colors = {{ top: blueTop, mid: blueMid, bottom: blueBottom }}
                />
            )}

            {greenBushes.length > 0 && (
                <Bushes 
                    data={greenBushes} 
                    colors={{ top: greenTop, mid: greenMid, bottom: greenBottom }} 
                />
            )}

            {whiteBushes.length > 0 && (
                <Bushes 
                    data={whiteBushes} 
                    colors={{ top: whiteTop, mid: whiteMid, bottom: whiteBottom }} 
                />
            )}
        </>
    )
}