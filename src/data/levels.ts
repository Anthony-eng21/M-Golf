export interface LevelDefinition {
  title: string;
  par: number;
  model: string;
  fallThreshold?: number;
  spawn: { x: number; y: number; z: number };
}

export const levels: LevelDefinition[] = [
  {
    title: "Hole 1",
    par: 3,
    model: "/m-golf-holes-001.glb",
    fallThreshold: -3,
    spawn: { x: 0.5, y: 0.65, z: 0 },
  },
  {
    title: "Hole 2",
    par: 5,
    model: "/m-golf-holes-002.glb",
    fallThreshold: -4,
    spawn: { x: 0.5, y: 0.65, z: 0 },
  },
];
