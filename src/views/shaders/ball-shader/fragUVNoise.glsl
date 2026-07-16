#include "../common/index.glsl"

varying vec2 vUv;

void main() {
  float nv = sin(cnoise(vUv * 3.) * 6.);
  float O = 0.75 - abs(nv);
  
  vec3 c = vec3(vUv, 1.);
  vec3 mc = mix(vec3(0.), c, O);
  
  gl_FragColor = vec4(mc, 1.);
}