import * as THREE from "three";
import resize from "../utils";

export class SceneView {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private currentLevelGroup?: THREE.Group;
  private dirLight!: THREE.DirectionalLight;

  constructor() {
    this.scene = new THREE.Scene();
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      // Issue: Shader material behind Other Material
      // source: https://discourse.threejs.org/t/shadematerial-goes-behind-other-material-mesh/40053/4
      // logarithmicDepthBuffer: true, // solution to remove this line
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    document.body.appendChild(this.renderer.domElement);

    this.setLighting();
    resize(this.camera, this.renderer);
  }

  private setLighting(): void {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.1;
    this.dirLight.shadow.camera.far = 5;
    this.dirLight.shadow.camera.left = -3;
    this.dirLight.shadow.camera.right = 3;
    this.dirLight.shadow.camera.top = 3;
    this.dirLight.shadow.camera.bottom = -3;
    this.scene.add(this.dirLight);
  }

  public updateBallLight(x: number, y: number, z: number): void {
    this.dirLight.position.set(x, y + 1, z);
    this.dirLight.target.position.set(x, y, z);
    this.dirLight.target.updateMatrixWorld();
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
