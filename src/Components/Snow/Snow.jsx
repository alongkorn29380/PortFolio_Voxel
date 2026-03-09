import SnowBushes from './SnowBushes.jsx'
import SnowTree from './SnowTrees.jsx'

export default function Snow({ nodes })
{
    return (
        <>
            <SnowBushes nodes={ nodes } />
            <SnowTree nodes={ nodes } />
        </>
    )
}