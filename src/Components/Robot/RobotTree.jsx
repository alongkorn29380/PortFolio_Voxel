import { useMemo } from "react"
import { useControls, folder } from "leva" 
import Trees from '../Trees/Trees.jsx'

export default function RobotTreeBlue({ nodes })
{
    const data = {
        blueTree: 
        { 
            top: '#4da6ff', 
            mid: '#0066cc', 
            bottom: '#003366' 
        } 
    }

    const { blueTreeTop, blueTreeMid, blueTreeBottom, scaleMultiplier, leafHeight, emission } = useControls('Trees', {
        'Robot Tree Blue': folder({
            blueTreeTop: { value: data.blueTree.top, label: 'Blue Top' },
            blueTreeMid: { value: data.blueTree.mid, label: 'Blue Mid' },
            blueTreeBottom: { value: data.blueTree.bottom, label: 'Blue Bottom' },
            scaleMultiplier: { value: 0.5, min: 0.1, max: 3.0, step: 0.05, label: 'Leaf Size' },
            leafHeight: { value: 1.5, min: -5.0, max: 10.0, step: 0.1, label: 'Leaf Height' },
            emission: { value: 1.5, min: 0.0, max: 10.0, step: 0.1, label: 'Glow (Emission)' }
        })
    })

    const treePositions = useMemo(() => {
        const group = nodes.Tree_Robot_Blue 
        if (!group) return []
        return group.children && group.children.length > 0 ? group.children : [group]
    }, [nodes])

    if (treePositions.length === 0) return null

    return (
        <Trees 
            data={treePositions} 
            colors={{ top: blueTreeTop, mid: blueTreeMid, bottom: blueTreeBottom }}
            scaleMultiplier={scaleMultiplier}
            leafHeight={leafHeight}
            uEmission={emission} 
        />
    )
}