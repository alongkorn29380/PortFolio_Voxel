import { useMemo } from "react"
import { useControls, folder } from "leva"
import { RigidBody } from "@react-three/rapier"
import Trees from "../Trees/Trees"

function TreeBuilder({ nodes, nameFilter, colors, emission, leafHeight, scaleMultiplier }) 
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
                uEmission={emission}
                leafHeight={leafHeight}
                scaleMultiplier={scaleMultiplier} 
            />
        </group>
    )
}

export default function MagicTrees({ nodes })
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
    } = useControls('Trees', {
        'Magic Trees': folder({
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

    return (
        <>
            <TreeBuilder
                nodes={nodes} nameFilter="Tree_Magic_Blue" 
                colors={{ top: BlueTop, mid: BlueMid, bottom: BlueBottom }}
                emission={BlueEmission} leafHeight={ 1.8 } scaleMultiplier={ 3 }
            />

            <TreeBuilder
                nodes={nodes} nameFilter="Tree_Magic_Green" 
                colors={{ top: GreenTop, mid: GreenMid, bottom: GreenBottom }}
                emission={GreenEmission} leafHeight={ 1.8 } scaleMultiplier={ 3 }
            />

            <TreeBuilder
                nodes={nodes} nameFilter="Tree_Magic_Purple" 
                colors={{ top: PurpleTop, mid: PurpleMid, bottom: PurpleBottom }}
                emission={PurpleEmission} leafHeight={ 1.8 } scaleMultiplier={ 3 }
            />
        </>
    )
}
