uniform float uTime;
uniform sampler2D uDepthMap;
uniform vec2 uResolution;
uniform float cameraNear;
uniform float cameraFar;
uniform float uFoamThreshold;
uniform vec3 uColorDeep;
uniform vec3 uColorShallow;
uniform float uOpacity;

varying vec2 vUv;

#include <packing>

// Function to convert depth from buffer
float getLineDepth(float fragCoordZ) {
    float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
    return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}

void main() {

    // Position pixcel 
    vec2 screenUv = gl_FragCoord.xy / uResolution;

    // Depth Object
    float depthRaw = texture2D(uDepthMap, screenUv).x;

    // Convert the depth of the background and current water surface
    float sceneViewZ = perspectiveDepthToViewZ(depthRaw, cameraNear, cameraFar);
    float waterViewZ = perspectiveDepthToViewZ(gl_FragCoord.z, cameraNear, cameraFar);

    // Calculate the distance between the water surface and the land
    float depthDiff = waterViewZ - sceneViewZ;

    // Preventing bubbles at the horizon
    if (depthRaw >= 0.99) {
        depthDiff = 1000.0;
    }

    // Foam logic
    float foam = 0.0;
   if (depthDiff < uFoamThreshold) { 
        foam = 1.0 - (depthDiff / uFoamThreshold);

        foam = clamp(foam, 0.0, 1.0);
        foam = smoothstep(0.0, 1.0, foam);
        foam = pow(foam, 3.0);
    }
    foam = 0.0; 


    // Mix color
    vec3 waterColor = mix(uColorDeep, uColorShallow, vUv.y);
    
    // เมื่อ foam = 0.0 ตรงนี้ก็จะไม่มีการผสมสีขาว (vec3(1.0)) เข้าไปเลย
    vec3 finalColor = mix(waterColor, vec3(1.0), foam);

    // Transparency
    float finalAlpha = uOpacity + foam;

    // RGBA
    gl_FragColor = vec4(finalColor, finalAlpha);
}