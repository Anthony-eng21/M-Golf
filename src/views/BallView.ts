import * as THREE from "three";

export class BallView {
  public ballMesh: THREE.Mesh;
  public arrowHelper: THREE.ArrowHelper;
  public radius: number;

  constructor(scene: THREE.Scene, radius: number) {
    this.radius = radius;
    this.ballMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff }),
    );
    this.ballMesh.castShadow = true;
    scene.add(this.ballMesh);

    this.arrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(),
      0,
      0x680d78,
    );
    this.arrowHelper.cone.castShadow = true;
    this.arrowHelper.line.castShadow = true;
    scene.add(this.arrowHelper);
  }

  public sync(position: THREE.Vector3, quaternion: THREE.Quaternion): void {
    this.ballMesh.position.copy(position);
    this.ballMesh.quaternion.copy(quaternion);
  }

  public updateArrow(
    aimDir: THREE.Vector3,
    isStationary: boolean,
    power: number,
    chipPower: number,
  ): void {
    const angle = (chipPower / 2.5) * 0.3;

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const launchVec = new THREE.Vector3(aimDir.x * cos, sin, aimDir.z * cos);
    this.arrowHelper.setDirection(launchVec);
    this.arrowHelper.position.copy(this.ballMesh.position);
    this.arrowHelper.setLength(0.5 + power / 2, 0.25, 0.05);

    this.arrowHelper.visible = isStationary;
  }
}
