import RAPIER from "@dimforge/rapier3d-compat";

interface PhysicsConfig {
  gravity: { x: number; y: number; z: number };
  ballRadius: number;
  ballSpawn: { x: number; y: number; z: number };
  linvelThreshold: number;
}

export class PhysicsController {
  private world!: RAPIER.World;
  private ballBody!: RAPIER.RigidBody;
  private config: PhysicsConfig;

  constructor(config: PhysicsConfig) {
    this.config = config;
  }

  public async init(): Promise<void> {
    await RAPIER.init();

    this.world = new RAPIER.World(this.config.gravity);
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(
        this.config.ballSpawn.x,
        this.config.ballSpawn.y,
        this.config.ballSpawn.z,
      )
      .setLinearDamping(0.8)
      .setAngularDamping(0.8)
      .setCcdEnabled(true);
    this.ballBody = this.world.createRigidBody(bodyDesc);

    const ballCollider = RAPIER.ColliderDesc.ball(this.config.ballRadius)
      .setRestitution(0.5)
      .setFriction(1.5)
      .setMass(0.075)
      .setContactSkin(0.01);
    this.world.createCollider(ballCollider, this.ballBody);
  }

  public step(): void {
    this.world.step();
  }

  public addTrimesh(vertices: Float32Array, indices: Uint32Array): void {
    const bodyDesc = RAPIER.RigidBodyDesc.fixed();
    const body = this.world.createRigidBody(bodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.trimesh(
      vertices,
      indices,
      RAPIER.TriMeshFlags.FIX_INTERNAL_EDGES,
    )
      .setRestitution(0.1)
      .setFriction(0.7)
      .setContactSkin(0.01);
    this.world.createCollider(colliderDesc, body);
  }

  public applyImpulse(x: number, y: number, z: number): void {
    this.ballBody.applyImpulse({ x, y, z }, true);
  }

  public resetBall(x: number, y: number, z: number): void {
    this.ballBody.setTranslation({ x, y, z }, false);
    this.ballBody.setLinvel({ x: 0, y: 0, z: 0 }, false);
    this.ballBody.setAngvel({ x: 0, y: 0, z: 0 }, false);
  }

  public getBallPosition(): { x: number; y: number; z: number } {
    return this.ballBody.translation();
  }

  public getBallQuaternion(): { x: number; y: number; z: number; w: number } {
    return this.ballBody.rotation();
  }

  public isStationary(): boolean {
    const v = this.ballBody.linvel();
    return Math.sqrt(v.x ** 2 + v.z ** 2) < this.config.linvelThreshold;
  }
}
