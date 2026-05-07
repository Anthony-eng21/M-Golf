import { type PerspectiveCamera, type WebGLRenderer } from "three";

export default function resize(
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
): void {
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
