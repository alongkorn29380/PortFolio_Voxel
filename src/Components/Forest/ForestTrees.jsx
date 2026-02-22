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

export default function ForestTrees({ nodes })
{
    const data = {
        Green: 
        { 
            top: '#8ab060', 
            mid: '#5a6e38', 
            bottom: '#425228' 
        },
        Orange:
        { 
            top: '#ffb366', 
            mid: '#e67300', 
            bottom: '#994d00' 
        },
        Pink: 
        { 
            top: '#ff99cc', 
            mid: '#d147a3', 
            bottom: '#801a5e' 
        }
    }

    const { 
        GreenTop, GreenMid, GreenBottom,
        OrangeTop, OrangeMid, OrangeBottom,
        PinkTop, PinkMid, PinkBottom
    } = useControls('Trees', {
        'Forest Trees': folder({
            GreenTop: { value: data.Green.top, label: 'Green Top' },
            GreenMid: { value: data.Green.mid, label: 'Green Mid' },
            GreenBottom: { value: data.Green.bottom, label: 'Green Bottom' },

            OrangeTop: { value: data.Orange.top, label: 'Orange Top' },
            OrangeMid: { value: data.Orange.mid, label: 'Orange Mid' },
            OrangeBottom: { value: data.Orange.bottom, label: 'Orange Bottom' },
            
            PinkTop: { value: data.Pink.top, label: 'Pink Top' },
            PinkMid: { value: data.Pink.mid, label: 'Pink Mid' },
            PinkBottom: { value: data.Pink.bottom, label: 'Pink Bottom' },
        }, { collapsed: true })
    }, { collapsed: true })

    return (
        <>
            <TreeBuilder
                nodes={nodes} nameFilter="Tree_Forest_Green" 
                colors={{ top: GreenTop, mid: GreenMid, bottom: GreenBottom }}
                leafHeight={ 1.8 } scaleMultiplier={ 3 }
            />

            <TreeBuilder
                nodes={nodes} nameFilter="Tree_Forest_Orange" 
                colors={{ top: OrangeTop, mid: OrangeMid, bottom: OrangeBottom }}
                leafHeight={ 1.8 } scaleMultiplier={ 3 }
            />

            <TreeBuilder
                nodes={nodes} nameFilter="Tree_Forest_Pink" 
                colors={{ top: PinkTop, mid: PinkMid, bottom: PinkBottom }}
                leafHeight={ 1.8 } scaleMultiplier={ 3 }
            />
        </>
    )
}
