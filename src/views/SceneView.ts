import * as THREE from "three";
import resize from "../utils";

export class SceneView {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private currentLevelGroup?: THREE.Group;

  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.setLighting();
    resize(this.camera, this.renderer);
  }

  private setLighting(): void {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);
  }

  public setLevel(group: THREE.Group): void {
    this.clearLevel();
    this.currentLevelGroup = group;
    this.scene.add(group);
  }

  public clearLevel(): void {
    if (!this.currentLevelGroup) return;
    this.scene.remove(this.currentLevelGroup);
    this.currentLevelGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    this.currentLevelGroup = undefined;
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
