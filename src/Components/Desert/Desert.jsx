import DesertBushes from './DesertBushes.jsx'
import DesertTrees from './DesertTrees.jsx'

export default function Desert({ nodes }) 
{
    return (
        <>
            <DesertBushes nodes={ nodes } />
            <DesertTrees nodes={ nodes } />
        </>
    )
}