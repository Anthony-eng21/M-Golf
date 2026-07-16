#include "../common/index.glsl"

// TODO Calculate Lighting
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  float O = mod(vUv.x * 3., 1.5); O = step(0.8, O);
  O *= (floor(vUv.x * 10.) / 10.) *
    (floor(vUv.y * 10.) / 10.);

  vec3 c = vec3(.75); 
  float rim = 1. - max(dot(normalize(vNormal), vec3(0, 0, 1)), 0.);
  float outline = step(.5, rim) * (1.1 - step(1., rim));
  O -= outline * 5.;
  vec3 fc = vec3(O) * c;

  gl_FragColor = vec4(fc, 1.);
}