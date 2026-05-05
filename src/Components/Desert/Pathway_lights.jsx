import { useFrame } from "@react-three/fiber"
import { useState } from "react"
import * as THREE from "three"

export default function Pathway_lights({ nodes })
{
    const [rows] = useState(() => {
        const getRow = (prefix) => {
        const row = []
        for (let i = 8; i >= 1; i--) {  
            const key = `${prefix}_${String(i).padStart(2, '0')}`
            const node = nodes[key]
            if (node) {
                node.traverse((c) => c.isMesh && row.push(c))
            }
        }
        return row
    }
        
        const left = getRow('L')
        const right = getRow('R')
        
        ;[...left, ...right].forEach((m) => {
            m.material = m.material.clone()
            m.material.emissive = new THREE.Color('#ffff66')
            m.material.emissiveIntensity = 0
            m.material.toneMapped = false
        })
        
        return [left, right]
    })

    useFrame((state) =>
    {
        const t = state.clock.getElapsedTime()
        const n = rows[0].length
        const head = Math.floor(t * 3) % n

        for (let i = 0; i < n; i++) {
            const on = i === head ? 20 : 0
            rows[0][i].material.emissiveIntensity = on
            rows[1][i].material.emissiveIntensity = on
        }
    })

    return null
}