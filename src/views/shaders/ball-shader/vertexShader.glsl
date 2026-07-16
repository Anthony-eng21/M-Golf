varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalize(vec3(modelViewMatrix * vec4(normal, 0.0)));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
