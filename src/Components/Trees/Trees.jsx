import * as THREE from 'three'
import { useMemo } from 'react'
import Bushes from '../Bushes/Bushes.jsx'

export default function Trees({ data = [], colors, scaleMultiplier = 0.5, leafHeight = 1.5, uEmission = 1.5 }) {
    
    const leavesData = useMemo(() => {
        const leaves = []
        data.forEach((node) => {
            const basePos = node.position
            const s = node.scale.x * scaleMultiplier

            leaves.push({ position: new THREE.Vector3(basePos.x, basePos.y + leafHeight, basePos.z), rotation: node.rotation, scale: new THREE.Vector3(s, s * 0.5, s) })
            leaves.push({ position: new THREE.Vector3(basePos.x, basePos.y + leafHeight + (1 * s), basePos.z), rotation: node.rotation, scale: new THREE.Vector3(s * 0.8, s * 0.45, s * 0.8) })
            leaves.push({ position: new THREE.Vector3(basePos.x, basePos.y + leafHeight + (2 * s), basePos.z), rotation: node.rotation, scale: new THREE.Vector3(s * 0.55, s * 0.35, s * 0.55) })
            leaves.push({ position: new THREE.Vector3(basePos.x, basePos.y + leafHeight + (2.75 * s), basePos.z), rotation: node.rotation, scale: new THREE.Vector3(s * 0.3, s * 0.25, s * 0.3) })
        })
        return leaves
    }, [data, scaleMultiplier, leafHeight])

    if (leavesData.length === 0) return null

    return <Bushes data={leavesData} colors={colors} uEmission={uEmission} /> 
}