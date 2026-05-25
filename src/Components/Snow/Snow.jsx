import SnowBushes from './SnowBushes.jsx'
import SnowTree from './SnowTrees.jsx'
import Smoke from './Smoke.jsx'

export default function Snow({ nodes })
{
    return (
        <>
            <SnowBushes nodes={ nodes } />
            <SnowTree nodes={ nodes } />
            <Smoke nodes={ nodes } />
        </>
    )
}