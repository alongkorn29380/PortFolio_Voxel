import { useMemo } from "react"
import { useControls, folder } from "leva"
import { RigidBody } from "@react-three/rapier"
import Trees from "../Trees/Trees"

function TreeBuilder({ nodes, nameFilter, colors, leafHeight, scaleMultiplier }) 
{

    const trunks = useMemo(() => {
        const allNodes = Object.values(nodes)
        return allNodes.filter((node) => node.name.includes(nameFilter) && node.isMesh)
    }, [nodes, nameFilter])

    if (trunks.length === 0) return null

    return (
        <group>

            {trunks.map((node) => (
                <RigidBody 
                    key={node.uuid} 
                    type="fixed"       
                    colliders="hull"   
                >
                    <primitive object={node} castShadow receiveShadow />
                </RigidBody>
            ))}

            <Trees 
                data={trunks} 
                colors={colors}
                leafHeight={leafHeight}
                scaleMultiplier={scaleMultiplier}
                uEmission={ 0 }
            />
        </group>
    )
}

export default function DesertTrees({ nodes })
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
    } = useControls('Trees', {
        'Desert Trees': folder({
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

    return (
        <>
            <TreeBuilder
                nodes={nodes} nameFilter="Tree_Desert_Brown" 
                colors={{ top: BrownTop, mid: BrownMid, bottom: BrownBottom }}
                leafHeight={ 1.8 } scaleMultiplier={ 3 }
            />

            <TreeBuilder
                nodes={nodes} nameFilter="Tree_Desert_Gold" 
                colors={{ top: GoldTop, mid: GoldMid, bottom: GoldBottom }}
                leafHeight={ 1.8 } scaleMultiplier={ 3 }
            />

            <TreeBuilder
                nodes={nodes} nameFilter="Tree_Desert_Yellow" 
                colors={{ top: YellowTop, mid: YellowMid, bottom: YellowBottom }}
                leafHeight={ 1.8 } scaleMultiplier={ 3 }
            />
        </>
    )
}
