uniform float uTime; 
uniform float uSpeed;
uniform float uOffset; 
uniform vec3 uColor;   
varying vec2 vUv;

void main() {
    float strength = (sin((uTime * uSpeed) + uOffset) + 1.0) / 2.0;

    float brightness = 0.3 + (strength * 0.7);
    vec3 finalColor = uColor * brightness;
    
    gl_FragColor = vec4(finalColor, 1.0);
}