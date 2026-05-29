import MagicBushes from './MagicBushes.jsx'
import MagicTrees from './MagicTrees.jsx'
import Energy_Core from './Energy_Core.jsx'
import Mana from './Mana.jsx'

export default function Magic({ nodes })
{
    return (
        <>
            <MagicBushes nodes={ nodes } />
            <MagicTrees nodes={ nodes } />
            <Energy_Core nodes={ nodes } />
            <Mana />
        </>
    )
}