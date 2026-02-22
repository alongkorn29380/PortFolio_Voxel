uniform vec3 uColorDeep;
uniform vec3 uColorShallow;
uniform float uOpacity;

varying vec2 vUv;

void main() {
    // ผสมสีน้ำลึกและน้ำตื้น
    vec3 waterColor = mix(uColorDeep, uColorShallow, vUv.y);

    // ใส่สีน้ำลงไป พร้อมตั้งค่าความใส (ไม่มีโค้ดสีขาวแล้ว!)
    gl_FragColor = vec4(waterColor, uOpacity);
}