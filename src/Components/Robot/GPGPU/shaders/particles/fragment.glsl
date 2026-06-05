uniform sampler2D uTexture;
uniform bool uHasTexture;

varying vec3 vColor;
varying vec2 vModelUv;

void main()
{
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if(distanceToCenter > 0.5)
        discard;

    vec3 color = uHasTexture ? texture2D(uTexture, vModelUv).rgb : vColor;
    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
