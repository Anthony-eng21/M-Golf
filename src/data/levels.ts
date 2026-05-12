import * as THREE from "three";
export interface LevelDefinition {
  title: string;
  par: number;
  model: string;
  initialCameraOffset: THREE.Vector3;
}

const initialCameraOffset = new THREE.Vector3(-1.75, 0.6, 0);

export const levels: LevelDefinition[] = [
  {
    title: "Hole 1",
    par: 3,
    model: "/m-golf-holes-01.glb",
    initialCameraOffset,
  },
  {
    title: "Hole 2",
    par: 5,
    model: "/m-golf-holes-02.glb",
    initialCameraOffset,
  },
];
