import ForestBushes from './ForestBushes.jsx'
import ForestTrees from './ForestTrees.jsx'
import Windmill_House from './Windmill_House.jsx'

export default function Forest({ nodes })
{
    return (
        <>
            <ForestBushes nodes={ nodes } />
            <ForestTrees nodes={ nodes } />
            <Windmill_House nodes={ nodes } />
        </>
    )
}