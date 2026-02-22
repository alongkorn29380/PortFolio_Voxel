import { useMemo } from "react"
import { useControls, folder } from "leva" 

import Bushes from '../Bushes/Bushes.jsx'

export default function ForestBushes({ nodes })
{
    const data = {
        Blue: 
        { 
            top: '#E0FFFF', 
            mid: '#88CCFF', 
            bottom: '#224466' 
        },
        Green:
        { 
            top: '#00FFCC', 
            mid: '#0088AA', 
            bottom: '#002233' 
        },
        Purple: 
        { 
            top: '#AA00FF', 
            mid: '#220044', 
            bottom: '#050011' 
        }
    }

    const { 
        BlueTop, BlueMid, BlueBottom, BlueEmission,
        GreenTop, GreenMid, GreenBottom, GreenEmission,
        PurpleTop, PurpleMid, PurpleBottom, PurpleEmission
    } = useControls('Bushes', {
        'Magic Bushes': folder({
            BlueTop: { value: data.Blue.top, label: 'Blue Top' },
            BlueMid: { value: data.Blue.mid, label: 'Blue Mid' },
            BlueBottom: { value: data.Blue.bottom, label: 'Blue Bottom' },
            BlueEmission:
            {
                value: 1.5,
                min: 0.0,
                max: 10.0,
                step: 0.1
            },

            GreenTop: { value: data.Green.top, label: 'Green Top' },
            GreenMid: { value: data.Green.mid, label: 'Green Mid' },
            GreenBottom: { value: data.Green.bottom, label: 'Green Bottom' },
            GreenEmission:
            {
                value: 1.5,
                min: 0.0,
                max: 10.0,
                step: 0.1
            },

            PurpleTop: { value: data.Purple.top, label: 'Purple Top' },
            PurpleMid: { value: data.Purple.mid, label: 'Purple Mid' },
            PurpleBottom: { value: data.Purple.bottom, label: 'Purple Bottom' },
            PurpleEmission:
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
                    colors = {{ top: BlueTop, mid: BlueMid, bottom: BlueBottom }}
                    uEmission={ BlueEmission }
                />
            )}

            {greenBushes.length > 0 && (
                <Bushes 
                    data={greenBushes} 
                    colors={{ top: GreenTop, mid: GreenMid, bottom: GreenBottom }} 
                    uEmission={ GreenEmission }
                />
            )}

            {purpleBushes.length > 0 && (
                <Bushes 
                    data={purpleBushes} 
                    colors={{ top: PurpleTop, mid: PurpleMid, bottom: PurpleBottom }}
                    uEmission={ PurpleEmission } 
                />
            )}
        </>
    )
}