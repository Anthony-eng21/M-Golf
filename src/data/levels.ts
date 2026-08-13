export interface LevelDefinition {
  title: string;
  par: number;
  model: string;
  fallThreshold?: number;
  cameraRotation?: { x: number; y: number; z: number };
  spawn: { x: number; y: number; z: number };
  useAdaptiveCamera?: { active: boolean; lerpNudge: number; lerpSpeed: number };
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
    par: 3,
    model: "/m-golf-holes-002.glb",
    fallThreshold: -6,
    spawn: { x: 0.5, y: 0.65, z: 0 },
  },
  {
    title: "Hole 3",
    par: 5,
    model: "/m-golf-holes-003.glb",
    fallThreshold: -15,
    spawn: { x: 0, y: 0.65, z: 0 },
    useAdaptiveCamera: { active: true, lerpNudge: 1.5, lerpSpeed: 0.035 },
  },
  {
    title: "Hole 4",
    par: 5,
    model: "/m-golf-holes-4f6.glb",
    fallThreshold: -24,
    spawn: { x: 0.5, y: 0.65, z: 0 },
    useAdaptiveCamera: { active: true, lerpNudge: 1.5, lerpSpeed: 0.035 },
  },
];
