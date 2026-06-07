uniform float uTime;
uniform float uDisplacementStrength;

#include <fog_pars_vertex>

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos; 

// Random number
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() 
{
    vUv = uv;
    vNormal = normal;
    vPos = position; 

    float instanceId = rand(instanceMatrix[3].xy);
    float windInfluence = smoothstep(0.0, 1.0, uv.y); 
    
    float displacement = sin(uTime + instanceId * 10.0) * 0.1 * windInfluence;
    displacement += sin(uTime * 3.0 + position.x) * 0.05 * windInfluence;
    
    vec3 displacedPosition = position + normal * (displacement * uDisplacementStrength);

    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(displacedPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    #include <fog_vertex>
}