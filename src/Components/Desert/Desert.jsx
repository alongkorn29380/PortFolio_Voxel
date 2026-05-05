import DesertBushes from './DesertBushes.jsx'
import DesertTrees from './DesertTrees.jsx'
import PathwayLights from './Pathway_lights.jsx'

export default function Desert({ nodes }) 
{
    return (
        <>
            <DesertBushes nodes={ nodes } />
            <DesertTrees nodes={ nodes } />
            <PathwayLights nodes={nodes} />
        </>
    )
}