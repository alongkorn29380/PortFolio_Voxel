import RobotBushes from './RobotBushes.jsx'
import RobotTree from './RobotTrees.jsx'

export default function Robot({ nodes })
{
    return (
        <>
            <RobotBushes nodes={ nodes } />
            <RobotTree nodes={ nodes } />
        </>
    )
}