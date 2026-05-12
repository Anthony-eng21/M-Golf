import * as THREE from "three";

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private offset: THREE.Vector3;

  constructor(camera: THREE.PerspectiveCamera, offset: THREE.Vector3) {
    this.camera = camera;
    this.offset = offset;
  }

  public update(ballPosition: THREE.Vector3, rotation: number): void {
    const rotatedOffset = new THREE.Vector3()
      .copy(this.offset)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
    this.camera.position.copy(ballPosition).add(rotatedOffset);
    this.camera.lookAt(ballPosition);
  }
}
