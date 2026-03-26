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
    const uiTimerRef = useRef(0) 

    useEffect(() => { 
        timeRef.current = progress 
    }, [progress])

    useFrame((state, delta) => {
        if(auto) {
            timeRef.current += delta * speed * 0.1
            if(timeRef.current > 1) timeRef.current = 0
            
            uiTimerRef.current += delta
            if (uiTimerRef.current > 0.5) {
                set({ progress: parseFloat(timeRef.current.toFixed(3)) }) 
                uiTimerRef.current = 0 
            }
        }
    })

    return(
        <TimeContext.Provider value={{ timeRef }} >
            {children}
        </TimeContext.Provider>
    )
}

export const useTime = () => {
    const context = useContext(TimeContext)
    if (!context) {
        throw new Error('useTime must be used within a TimeProvider')
    }
    return context
}