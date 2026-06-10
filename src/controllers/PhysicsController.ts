import RAPIER from "@dimforge/rapier3d-compat";

interface PhysicsConfig {
  gravity: { x: number; y: number; z: number };
  ballRadius: number;
  ballSpawn: { x: number; y: number; z: number };
  linvelThreshold: number;
  fallThreshold?: number;
}

export class PhysicsController {
  private world!: RAPIER.World;
  private ballBody!: RAPIER.RigidBody;
  private eventQueue!: RAPIER.EventQueue;
  private sensorHandle?: RAPIER.ColliderHandle;
  private holeEnteredCallback?: () => void;

  private config: PhysicsConfig;
  private fallThreshold: number;

  private lastSafePosition!: RAPIER.Vector3;
  private spawnPosition!: RAPIER.Vector3;

  constructor(config: PhysicsConfig) {
    this.config = config;
    this.fallThreshold = this.config.fallThreshold ?? -3;
  }

  private setupWorld(): void {
    this.world = new RAPIER.World(this.config.gravity);
    this.eventQueue = new RAPIER.EventQueue(true);

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

    this.lastSafePosition = this.ballBody.translation();
    this.spawnPosition = this.ballBody.translation();

    const ballCollider = RAPIER.ColliderDesc.ball(this.config.ballRadius)
      .setRestitution(0.5)
      .setFriction(1.6)
      .setMass(0.075)
      .setContactSkin(0.0025)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    this.world.createCollider(ballCollider, this.ballBody);
  }

  public async init(): Promise<void> {
    await RAPIER.init();
    this.setupWorld();
  }

  public resetWorld(): void {
    this.world.free();
    this.sensorHandle = undefined;
    this.setupWorld();
  }

  public step(): void {
    this.world.step(this.eventQueue);

    this.eventQueue.drainCollisionEvents(
      (h1: number, h2: number, started: boolean) => {
        if (started && (h1 === this.sensorHandle || h2 === this.sensorHandle)) {
          this.holeEnteredCallback?.();
        }
      },
    );

    if (this.isStationary()) {
      this.lastSafePosition = this.ballBody.translation();
    }
    if (this.ballBody.translation().y < this.fallThreshold) {
      this.resetBall();
    }
  }

  public addSensor(vertices: Float32Array, indices: Uint32Array): void {
    const bodyDesc = RAPIER.RigidBodyDesc.fixed();
    const body = this.world.createRigidBody(bodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.trimesh(
      vertices,
      indices,
      RAPIER.TriMeshFlags.FIX_INTERNAL_EDGES,
    ).setSensor(true);

    const collider = this.world.createCollider(colliderDesc, body);
    this.sensorHandle = collider.handle;
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

  public onHoleEntered(cb: () => void): void {
    this.holeEnteredCallback = cb;
  }

  public resetBall(): void {
    this.ballBody.setTranslation(this.lastSafePosition, false);
    this.ballBody.setLinvel({ x: 0, y: 3, z: 0 }, false);
    this.ballBody.setAngvel({ x: 0, y: 0, z: 0 }, false);
  }

  public setFallThreshold(value: number): void {
    this.fallThreshold = value;
  }

  public setSpawn(spawn: { x: number; y: number; z: number }): void {
    this.config.ballSpawn = spawn;
  }

  public resetToSpawn(): void {
    this.ballBody.setTranslation(this.spawnPosition, false);
    this.ballBody.setLinvel({ x: 0, y: 3, z: 0 }, false);
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
