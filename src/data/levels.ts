export interface LevelDefinition {
  title: string;
  par: number;
  model: string;
  fallThreshold?: number;
}

export const levels: LevelDefinition[] = [
  {
    title: "Hole 1",
    par: 3,
    model: "/m-golf-holes-001.glb",
    fallThreshold: -3,
  },
  {
    title: "Hole 2",
    par: 5,
    model: "/m-golf-holes-002.glb",
    fallThreshold: -4,
  },
];
