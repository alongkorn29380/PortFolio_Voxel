uniform sampler2D uTexture;
uniform float uAlphaTest;
uniform vec3 uColorTop;
uniform vec3 uColorMid;
uniform vec3 uColorBottom;
uniform vec3 uAmbientColor;
uniform float uLightIntensity;
uniform float uEmission;

#include <fog_pars_fragment>

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos; 

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    if(textureColor.a < uAlphaTest) discard;

    float mixFactor = (vPos.y * 0.5) + 0.5;
    mixFactor = clamp(mixFactor, 0.0, 1.0); 
    
    vec3 color = uColorBottom;
    if(mixFactor < 0.5) {
        color = mix(uColorBottom, uColorMid, mixFactor * 2.0);
    } else {
        color = mix(uColorMid, uColorTop, (mixFactor - 0.5) * 2.0);
    }

    vec3 lighting = uAmbientColor * (uLightIntensity * 0.5 + 0.5);
    vec3 finalColor = color * lighting;

    finalColor += color * uEmission;

    gl_FragColor = vec4(finalColor, textureColor.a);

    #include <fog_fragment>
}