varying vec2 vUv;
uniform float uTime;

void main() {
    vUv = uv;

    vec3 newPosition = position;

    // Calculate waves
    float wave = floor(sin(uTime * 2.0) * 5.0) / 5.0 * 0.1;
    newPosition.z += wave; 
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}