import { createContext, useContext, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";

const TimeContext = createContext()

export default function TimeProvider({ children })
{
    const [{ progress, speed, auto }, set ] = useControls('Time System', () => ({
        progress : {
            value: 0.321,
            min: 0.000,
            max: 1.000,
            step: 0.001
        },
        
        speed: {
            value: 0.050,
            min: 0.000,
            max: 1.000,
            step: 0.001
        },
        auto: {
            value: true
        },

        'Day': button(() => set({ progress: 0.5 })),
        'Dusk': button(() => set({ progress: 0.75 })),
        'Night': button(() => set({ progress: 0.00})),
        'Dawn': button(() => set({ progress: 0.25 }))
    }), { collapsed: true })

    const timeRef = useRef(progress)
    
    useEffect(() => { timeRef.current = progress}, [progress])

    // Loop Time
    useFrame((state, delta) => {
        if(auto) {
            timeRef.current += delta * speed * 0.1
            if(timeRef.current > 1) timeRef.current = 0
            set({ progress: timeRef.current })
        }
    })

    return(
        <TimeContext.Provider value={{ timeRef }} >
            { children}
        </TimeContext.Provider>
    )
}

// Hook
export const useTime = () => {
    const context = useContext(TimeContext)
    if (!context) {
        throw new Error('useTime must be used within a TimeProvider')
    }
    return context
}