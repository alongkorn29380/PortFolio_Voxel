import { useMemo } from "react"
import { useControls, folder } from "leva" 

import Bushes from '../Bushes/Bushes.jsx'

export default function ForestBushes({ nodes })
{
    const data = {
        blue: 
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
        blueTop, blueMid, blueBottom, blueemission,
        LemonTop, LemonMid, LemonBottom, lemonemission,
        RedTop, RedMid, RedBottom, redemission
    } = useControls('Bushes', {
        'Robot Bushes': folder({
            blueTop: { value: data.blue.top, label: 'Blue Top' },
            blueMid: { value: data.blue.mid, label: 'Blue Mid' },
            blueBottom: { value: data.blue.bottom, label: 'Blue Bottom' },
            blueemission :{
                value: 1.5, 
                min: 0.0,
                max: 10.0,
                step: 0.1
            },
            LemonTop: { value: data.Lemon.top, label: 'Lemon Top' },
            LemonMid: { value: data.Lemon.mid, label: 'Lemon Mid' },
            LemonBottom: { value: data.Lemon.bottom, label: 'Lemon Bottom' },
            lemonemission :{
                value: 1.5, 
                min: 0.0,
                max: 10.0,
                step: 0.1
            },
            RedTop: { value: data.Red.top, label: 'Red Top' },
            RedMid: { value: data.Red.mid, label: 'Red Mid' },
            RedBottom: { value: data.Red.bottom, label: 'Red Bottom' },
            redemission :{
                value: 1.5, 
                min: 0.0,
                max: 10.0,
                step: 0.1
            }
        }, { collapsed: true })
    }, { collapsed: true })

    const blueBushes = useMemo(() => 
    {
        const group = nodes.Bushes_Robot_Blue
        if (!group) return []
        group.visible = false
        return group.children.length > 0 ? group.children : [group]
    }, [nodes])

    const lemonBushes = useMemo(() => 
    {
        const group = nodes.Bushes_Robot_Lemon
        if (!group) return []
        group.visible = false
        return group.children.length > 0 ? group.children : [group]
    }, [nodes])

    const redBushes = useMemo(() => 
    {
        const group = nodes.Bushes_Robot_Red
        if (!group) return []
        group.visible = false
        return group.children.length > 0 ? group.children : [group]
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

            {lemonBushes.length > 0 && (
                <Bushes 
                    data={lemonBushes} 
                    colors={{ top: LemonTop, mid: LemonMid, bottom: LemonBottom }} 
                    uEmission={ lemonemission }
                />
            )}

            {redBushes.length > 0 && (
                <Bushes 
                    data={redBushes} 
                    colors={{ top: RedTop, mid: RedMid, bottom: RedBottom }} 
                    uEmission={ redemission }
                />
            )}
        </>
    )
}