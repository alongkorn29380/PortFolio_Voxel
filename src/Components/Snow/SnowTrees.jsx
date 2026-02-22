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

export default function SnowTrees({ nodes })
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
    } = useControls('Trees', {
        'Snow Trees': folder({
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

    return (
        <>
            <TreeBuilder
                nodes={nodes} nameFilter="Tree_Snow_Blue" 
                colors={{ top: BlueTop, mid: BlueMid, bottom: BlueBottom }}
                leafHeight={ 1.8 } scaleMultiplier={ 3 }
            />

            <TreeBuilder
                nodes={nodes} nameFilter="Tree_Snow_Green" 
                colors={{ top: GreenTop, mid: GreenMid, bottom: GreenBottom }}
                leafHeight={ 1.8 } scaleMultiplier={ 3 }
            />

            <TreeBuilder
                nodes={nodes} nameFilter="Tree_Snow_White" 
                colors={{ top: WhiteTop, mid: WhiteMid, bottom: WhiteBottom }}
                leafHeight={ 1.8 } scaleMultiplier={ 3 }
            />
        </>
    )
}
