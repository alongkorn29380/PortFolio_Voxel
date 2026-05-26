attribute float rotation;
uniform float uSize;
varying float vRotation;

void main() {
    vRotation = rotation;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (30.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}