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
        blueTop, blueMid, blueBottom,
        greenTop, greenMid, greenBottom,
        purpleTop, purpleMid, purpleBottom
    } = useControls('Bushes', {
        'Magic Bushes': folder({
            blueTop: { value: data.blue.top, label: 'Blue Top' },
            blueMid: { value: data.blue.mid, label: 'Blue Mid' },
            blueBottom: { value: data.blue.bottom, label: 'Blue Bottom' },
            greenTop: { value: data.green.top, label: 'Green Top' },
            greenMid: { value: data.green.mid, label: 'Green Mid' },
            greenBottom: { value: data.green.bottom, label: 'Green Bottom' },
            purpleTop: { value: data.purple.top, label: 'Purple Top' },
            purpleMid: { value: data.purple.mid, label: 'Purple Mid' },
            purpleBottom: { value: data.purple.bottom, label: 'Purple Bottom' }
        })
    })

    const blueBushes = useMemo(() => 
    {
        const group = nodes.Bushes_Magic_Blue
        if (!group) return []
        group.visible = false
        return group.children.length > 0 ? group.children : [group]
    }, [nodes])

    const greenBushes = useMemo(() => 
    {
        const group = nodes.Bushes_Magic_Green
        if (!group) return []
        group.visible = false
        return group.children.length > 0 ? group.children : [group]
    }, [nodes])

    const purpleBushes = useMemo(() => 
    {
        const group = nodes.Bushes_Magic_Purple
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
                    uEmission={ 0.5 }
                />
            )}

            {greenBushes.length > 0 && (
                <Bushes 
                    data={greenBushes} 
                    colors={{ top: greenTop, mid: greenMid, bottom: greenBottom }} 
                    uEmission={ 1.5 }
                />
            )}

            {purpleBushes.length > 0 && (
                <Bushes 
                    data={purpleBushes} 
                    colors={{ top: purpleTop, mid: purpleMid, bottom: purpleBottom }}
                    uEmission={ 1.5 } 
                />
            )}
        </>
    )
}