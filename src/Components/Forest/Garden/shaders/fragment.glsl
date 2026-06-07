#include <common>
#include <packing>
#include <lights_pars_begin>
#include <fog_pars_fragment> 

uniform sampler2D uTexture;
uniform bool uUseTexture;
uniform float uAlphaTest;
uniform vec3 uColor; 

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;

void main() {
    vec4 textureColor = uUseTexture ? texture2D(uTexture, vUv) : vec4(1.0);
    
    if(textureColor.a < uAlphaTest) discard;

    vec3 color = uColor * textureColor.rgb;

    float mixFactor = smoothstep(-0.2, 0.5, vPos.y);
    color *= (0.7 + 0.3 * mixFactor); 

    vec3 lightDir = vec3(0.0, 1.0, 0.0);
    vec3 lightColor = vec3(1.0);
    
    #if NUM_DIR_LIGHTS > 0
        lightDir = directionalLights[0].direction;
        lightColor = directionalLights[0].color;
    #endif
    
    float diff = max(dot(normalize(vNormal), lightDir), 0.0);
    vec3 diffuse = lightColor * diff;
    
    vec3 ambient = ambientLightColor;

    vec3 finalColor = color * (ambient + diffuse);

    gl_FragColor = vec4(finalColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
}