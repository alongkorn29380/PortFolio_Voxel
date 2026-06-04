import Senosr_DashBoard from './Performance/Sensor_DashBoard/Sensor_DashBoard.jsx'
import Arm_Robotic from './Performance/Arm_Robotic/Arm_Robotic.jsx'
import Resume from './Performance/Resume/Resume.jsx'
import Calendar from './Performance/Calendar/Calendar.jsx'
import Snow_Globe from './Performance/Snow_Globe/Snow_Globe.jsx'    
import Christmas from './Performance/Christmas/Christmas.jsx'
import Old_Terrain from './Performance/Old_Terrain/Old_Terrain.jsx'

export default function Marker({ nodes})
{
    return (
        <>
            <Senosr_DashBoard nodes={ nodes } />
            <Arm_Robotic nodes={ nodes } />
            <Resume nodes={ nodes } />
            <Calendar nodes={ nodes } />
            <Snow_Globe nodes={ nodes } />
            <Christmas nodes= { nodes } />
            <Old_Terrain nodes={ nodes }/>
        </>
    )
}