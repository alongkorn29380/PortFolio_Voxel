uniform float uTime;
uniform float uWindStrength;
uniform float uWindSpeed;

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal; 

#include <fog_pars_vertex>

void main() {
    vUv = uv;
    vPos = position; 
    vNormal = normalize(normalMatrix * normal); 

    float windInfluence = smoothstep(0.0, 1.0, position.y); 
    float displacement = sin(uTime * uWindSpeed + position.x * 2.0 + position.z * 2.0) * uWindStrength * windInfluence;
    
    vec3 displacedPosition = position;
    displacedPosition.x += displacement;
    displacedPosition.z += displacement * 0.3;

    vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    #include <fog_vertex>
}