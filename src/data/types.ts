export interface HDRI {
  url: string;
  envIntensity?: number;
  bgIntensity?: number;
  blur?: number;
}

export interface LevelDefinition {
  title: string;
  par: number;
  model: string;
  fallThreshold?: number;
  cameraRotation?: { x: number; y: number; z: number };
  spawn: { x: number; y: number; z: number };
  useAdaptiveCamera?: { active: boolean; lerpNudge: number; lerpSpeed: number };
  hdr?: HDRI;
}
