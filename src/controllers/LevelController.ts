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
  triggers: ColliderData[];
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
    const nameIncludes = (
      str: string,
      obj: THREE.Mesh | THREE.Group,
    ): boolean => obj.name.toLowerCase().includes(str);

    return new Promise((resolve, reject) => {
      this.loader.load(
        level.model,
        (gltf) => {
          const colliders: ColliderData[] = [];
          const triggers: ColliderData[] = [];

          gltf.scene.traverse((child) => {
            if (
              (child as THREE.Mesh).isMesh ||
              (child as THREE.Group).isGroup
            ) {
              child.receiveShadow = true;
              const mesh = child as THREE.Mesh;
              const group = child as THREE.Group;

              if (nameIncludes("collider", mesh)) {
                child.receiveShadow = false;
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
              if (nameIncludes("trigger", mesh)) {
                child.receiveShadow = false;
                mesh.visible = false;
                mesh.updateWorldMatrix(true, false);
                const geom = mesh.geometry
                  .clone()
                  .applyMatrix4(mesh.matrixWorld);
                const vertices = geom.attributes.position.array as Float32Array;
                const indices = geom.index
                  ? (geom.index.array as Uint32Array)
                  : new Uint32Array(vertices.length / 3).map((_, i) => i);
                triggers.push({ vertices, indices });
              }
            }
          });

          resolve({ scene: gltf.scene, colliders, triggers });
        },
        undefined,
        reject,
      );
    });
  }
}
