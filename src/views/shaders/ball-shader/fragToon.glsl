#include "../common/index.glsl"

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec2 scaledUv = vUv * 12.;
  
  scaledUv.x += step(1., mod(scaledUv.y, 2.0)) * 0.5;

  float strength = step(0.25, distance(mod(scaledUv, 1.), vec2(0.5)));

  float rim = 1. - max(dot(normalize(vNormal), vec3(0, 0, 1)), 0.);
  float outline = step(.5, rim);
  strength -= outline;

  gl_FragColor = vec4(vec3(strength), 1.);
}