import Senosr_DashBoard from './Performance/Sensor_DashBoard/Sensor_DashBoard.jsx'
import Arm_Robotic from './Performance/Arm_Robotic/Arm_Robotic.jsx'
import Resume from './Performance/Resume/Resume.jsx'
import Calendar from './Performance/Calendar/Calendar.jsx'
import Snow_Globe from './Performance/Snow_Globe/Snow_Globe.jsx'    

export default function Marker({ nodes})
{
    return (
        <>
            <Senosr_DashBoard nodes={ nodes } />
            <Arm_Robotic nodes={ nodes } />
            <Resume nodes={ nodes } />
            <Calendar nodes={ nodes } />
            <Snow_Globe nodes={ nodes } />
        </>
    )
}