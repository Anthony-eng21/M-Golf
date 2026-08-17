import type { Group } from "three";

export interface ColliderData {
  vertices: Float32Array;
  indices: Uint32Array;
}

export interface LevelResult {
  scene: Group;
  colliders: ColliderData[];
  triggers: ColliderData[];
}

export interface PhysicsConfig {
  gravity: { x: number; y: number; z: number };
  ballRadius: number;
  ballSpawn: { x: number; y: number; z: number };
  linvelThreshold: number;
  fallThreshold?: number;
}
