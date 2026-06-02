import * as THREE from 'three'

export function buildParticles(modelScene) {
    const meshes = modelScene.children.filter((c) => c.geometry)
    const positionsAttr = meshes.map((c) => c.geometry.attributes.position)

    let maxCount = 0
    for (const p of positionsAttr) if (p.count > maxCount) maxCount = p.count

    const positions = positionsAttr.map((position) => {
        const src = position.array
        const dst = new Float32Array(maxCount * 3)
        for (let i = 0; i < maxCount; i++) {
            const i3 = i * 3
            if (i3 < src.length) {
                dst[i3]     = src[i3]
                dst[i3 + 1] = src[i3 + 1]
                dst[i3 + 2] = src[i3 + 2]
            } else {
                const ri    = Math.floor(position.count * Math.random()) * 3
                dst[i3]     = src[ri]
                dst[i3 + 1] = src[ri + 1]
                dst[i3 + 2] = src[ri + 2]
            }
        }
        return new THREE.Float32BufferAttribute(dst, 3)
    })

    const sizesArray = new Float32Array(maxCount)
    for (let i = 0; i < maxCount; i++) sizesArray[i] = Math.random()

    return { positions, maxCount, sizesArray }
}

export function buildGeometry(particles, fromIndex, toIndex) {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position',        particles.positions[fromIndex])
    geo.setAttribute('aPositionTarget', particles.positions[toIndex])
    geo.setAttribute('aSize', new THREE.BufferAttribute(particles.sizesArray, 1))
    return geo
}

export function buildUniforms(width, height, dpr, colorA = '#ff7300', colorB = '#0091ff') {
    return {
        uSize:       new THREE.Uniform(0.4),
        uResolution: new THREE.Uniform(new THREE.Vector2(width * dpr, height * dpr)),
        uProgress:   new THREE.Uniform(0),
        uColorA:     new THREE.Uniform(new THREE.Color(colorA)),
        uColorB:     new THREE.Uniform(new THREE.Color(colorB)),
    }
}
