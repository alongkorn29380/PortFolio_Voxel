import MagicBushes from './MagicBushes.jsx'
import MagicTrees from './MagicTrees.jsx'
import Energy_Core from './Energy_Core.jsx'
import Portal_Desert from './Portal/Portal_Desert.jsx'
import Portal_Snow from './Portal/Portar_Snow.jsx'  
import Portal_Forest from './Portal/Portal_Forest.jsx'  
import Portal_Robot from './Portal/Portal_Robot.jsx'
import Mana from './Mana.jsx'

export default function Magic({ nodes })
{
    return (
        <>
            <MagicBushes nodes={ nodes } />
            <MagicTrees nodes={ nodes } />
            <Energy_Core nodes={ nodes } />
            <Portal_Desert nodes={ nodes } />
            <Portal_Snow nodes={ nodes } />
            <Portal_Forest nodes={ nodes } />
            <Portal_Robot nodes={ nodes } />
            <Mana />
        </>
    )
}