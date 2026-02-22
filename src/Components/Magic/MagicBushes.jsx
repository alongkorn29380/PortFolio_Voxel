import { useMemo } from "react"
import { useControls, folder } from "leva" 

import Bushes from '../Bushes/Bushes.jsx'

export default function ForestBushes({ nodes })
{
    const data = {
        blue: 
        { 
            top: '#E0FFFF', 
            mid: '#88CCFF', 
            bottom: '#224466' 
        },
        green:
        { 
            top: '#00FFCC', 
            mid: '#0088AA', 
            bottom: '#002233' 
        },
        purple: 
        { 
            top: '#AA00FF', 
            mid: '#220044', 
            bottom: '#050011' 
        }
    }

    const { 
        blueTop, blueMid, blueBottom, blueemission,
        greenTop, greenMid, greenBottom, greenemission,
        purpleTop, purpleMid, purpleBottom, purpleemission
    } = useControls('Bushes', {
        'Magic Bushes': folder({
            blueTop: { value: data.blue.top, label: 'Blue Top' },
            blueMid: { value: data.blue.mid, label: 'Blue Mid' },
            blueBottom: { value: data.blue.bottom, label: 'Blue Bottom' },
            blueemission:
            {
                value: 1.5,
                min: 0.0,
                max: 10.0,
                step: 0.1
            },

            greenTop: { value: data.green.top, label: 'Green Top' },
            greenMid: { value: data.green.mid, label: 'Green Mid' },
            greenBottom: { value: data.green.bottom, label: 'Green Bottom' },
            greenemission:
            {
                value: 1.5,
                min: 0.0,
                max: 10.0,
                step: 0.1
            },

            purpleTop: { value: data.purple.top, label: 'Purple Top' },
            purpleMid: { value: data.purple.mid, label: 'Purple Mid' },
            purpleBottom: { value: data.purple.bottom, label: 'Purple Bottom' },
            purpleemission:
            {
                value: 1.5,
                min: 0.0,
                max: 10.0,
                step: 0.1
            },
        }, { collapsed: true })
    }, { collapsed: true })

    const blueBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Magic_Blue') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    const greenBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Magic_Green') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    const purpleBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Magic_Purple') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    return (
        <>
            {blueBushes.length > 0 && (
                <Bushes
                    data = { blueBushes }
                    colors = {{ top: blueTop, mid: blueMid, bottom: blueBottom }}
                    uEmission={ blueemission }
                />
            )}

            {greenBushes.length > 0 && (
                <Bushes 
                    data={greenBushes} 
                    colors={{ top: greenTop, mid: greenMid, bottom: greenBottom }} 
                    uEmission={ greenemission }
                />
            )}

            {purpleBushes.length > 0 && (
                <Bushes 
                    data={purpleBushes} 
                    colors={{ top: purpleTop, mid: purpleMid, bottom: purpleBottom }}
                    uEmission={ purpleemission } 
                />
            )}
        </>
    )
}