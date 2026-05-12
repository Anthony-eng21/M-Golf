import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { LevelDefinition } from "../data/levels";

export interface ColliderData {
  vertices: Float32Array;
  indices: Uint32Array;
}

export interface LevelResult {
  scene: THREE.Group;
  colliders: ColliderData[];
}

export class LevelController {
  private levels: LevelDefinition[];
  private loader: GLTFLoader;

  constructor(levels: LevelDefinition[]) {
    this.levels = levels;
    this.loader = new GLTFLoader();
  }

  public load(index: number): Promise<LevelResult> {
    const level = this.levels[index];

    return new Promise((resolve, reject) => {
      this.loader.load(
        level.model,
        (gltf) => {
          const colliders: ColliderData[] = [];

          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              if (mesh.name.toLowerCase().includes("collider")) {
                mesh.visible = false;
                mesh.updateWorldMatrix(true, false);
                const geom = mesh.geometry
                  .clone()
                  .applyMatrix4(mesh.matrixWorld);
                const vertices = geom.attributes.position.array as Float32Array;
                const indices = geom.index
                  ? (geom.index.array as Uint32Array)
                  : new Uint32Array(vertices.length / 3).map((_, i) => i);
                colliders.push({ vertices, indices });
              }
            }
          });

          resolve({ scene: gltf.scene, colliders });
        },
        undefined,
        reject,
      );
    });
  }
}
