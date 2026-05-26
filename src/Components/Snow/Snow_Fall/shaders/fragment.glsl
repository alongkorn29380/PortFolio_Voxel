uniform sampler2D map;
uniform float opacity;
uniform vec3 color;
varying float vRotation;

void main() {
    float mid = 0.5;
    vec2 rotated = gl_PointCoord - vec2(mid);
    float c = cos(vRotation);
    float s = sin(vRotation);
    mat2 rotMat = mat2(c, -s, s, c);
    rotated = rotMat * rotated;
    rotated += vec2(mid);

    vec4 texColor = texture2D(map, rotated);
      
    if (texColor.a < 0.1) discard; 

    gl_FragColor = vec4(color, texColor.a * opacity);
}