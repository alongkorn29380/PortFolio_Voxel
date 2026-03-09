import MagicBushes from './MagicBushes.jsx'
import MagicTrees from './MagicTrees.jsx'

export default function Magic({ nodes })
{
    return (
        <>
            <MagicBushes nodes={ nodes } />
            <MagicTrees nodes={ nodes } />
        </>
    )
}