import ForestBushes from './ForestBushes.jsx'
import ForestTrees from './ForestTrees.jsx'

export default function Forest({ nodes })
{
    return (
        <>
            <ForestBushes nodes={ nodes } />
            <ForestTrees nodes={ nodes } />
        </>
    )
}