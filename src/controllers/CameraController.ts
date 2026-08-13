import * as THREE from "three";

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private offset: THREE.Vector3;
  private raycaster: THREE.Raycaster;
  private currentVerticalNudge: number = 0;

  constructor(camera: THREE.PerspectiveCamera, offset: THREE.Vector3) {
    this.camera = camera;
    this.offset = offset;
    this.raycaster = new THREE.Raycaster();
  }

  public update(
    ballPosition: THREE.Vector3,
    rotation: number,
    scene: THREE.Scene,
    useAdaptiveCamera: {
      active: boolean;
      lerpNudge: number;
      lerpSpeed: number;
    },
  ): void {
    let targetLerpNudge = 0;
    const speed = useAdaptiveCamera.lerpSpeed ?? 0.02;

    const rotatedOffset = new THREE.Vector3()
      .copy(this.offset)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);

    if (!!useAdaptiveCamera.active) {
      const idealPosition = new THREE.Vector3()
        .copy(ballPosition)
        .add(rotatedOffset);
      const rd = new THREE.Vector3()
        .subVectors(ballPosition, idealPosition)
        .normalize();

      this.raycaster.set(idealPosition, rd);
      const intersects = this.raycaster.intersectObjects(scene.children, true);
      const hit = intersects[0];

      const isObstructed = hit && hit.object.name.includes("Polar_Spring");

      if (isObstructed) {
        targetLerpNudge = useAdaptiveCamera.lerpNudge;
      }
    }

    this.currentVerticalNudge = THREE.MathUtils.lerp(
      this.currentVerticalNudge,
      targetLerpNudge,
      speed,
    );

    const finalPosition = new THREE.Vector3()
      .copy(ballPosition)
      .add(rotatedOffset)
      .add(new THREE.Vector3(0, this.currentVerticalNudge, 0));

    this.camera.position.copy(finalPosition);
    this.camera.lookAt(ballPosition);
  }
}
