import { useMemo } from "react"
import { useControls, folder } from "leva" 

import Bushes from '../Bushes/Bushes.jsx'

export default function ForestBushes({ nodes })
{
    const data = {
        Blue: 
        { 
            top: '#88CCFF', 
            mid: '#0044FF', 
            bottom: '#000022' 
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

    const { 
        BlueTop, BlueMid, BlueBottom, BlueEmission,
        LemonTop, LemonMid, LemonBottom, LemonEmission,
        RedTop, RedMid, RedBottom, RedEmission
    } = useControls('Bushes', {
        'Robot Bushes': folder({
            BlueTop: { value: data.Blue.top, label: 'Blue Top' },
            BlueMid: { value: data.Blue.mid, label: 'Blue Mid' },
            BlueBottom: { value: data.Blue.bottom, label: 'Blue Bottom' },
            BlueEmission :{
                value: 1.5, 
                min: 0.0,
                max: 10.0,
                step: 0.1
            },

            LemonTop: { value: data.Lemon.top, label: 'Lemon Top' },
            LemonMid: { value: data.Lemon.mid, label: 'Lemon Mid' },
            LemonBottom: { value: data.Lemon.bottom, label: 'Lemon Bottom' },
            LemonEmission :{
                value: 1.5, 
                min: 0.0,
                max: 10.0,
                step: 0.1
            },
            
            RedTop: { value: data.Red.top, label: 'Red Top' },
            RedMid: { value: data.Red.mid, label: 'Red Mid' },
            RedBottom: { value: data.Red.bottom, label: 'Red Bottom' },
            RedEmission :{
                value: 1.5, 
                min: 0.0,
                max: 10.0,
                step: 0.1
            }
        }, { collapsed: true })
    }, { collapsed: true })

    const blueBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Robot_Blue') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    const lemonBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Robot_Lemon') && node.isMesh)
        bushes.forEach(bush => bush.visible = false)
        return bushes
    }, [nodes])

    const redBushes = useMemo(() => 
    {
        const allNodes = Object.values(nodes)
        const bushes = allNodes.filter((node) => node.name.includes('Bushes_Robot_Red') && node.isMesh)
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

            {lemonBushes.length > 0 && (
                <Bushes 
                    data={lemonBushes} 
                    colors={{ top: LemonTop, mid: LemonMid, bottom: LemonBottom }} 
                    uEmission={ LemonEmission }
                />
            )}

            {redBushes.length > 0 && (
                <Bushes 
                    data={redBushes} 
                    colors={{ top: RedTop, mid: RedMid, bottom: RedBottom }} 
                    uEmission={ RedEmission }
                />
            )}
        </>
    )
}