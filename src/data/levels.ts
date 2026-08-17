import type { HDRI } from "./types.ts";
import type { LevelDefinition } from "./types.ts";

const _day = "/hdr/kloppenheim_07_day.hdr";
const day = {
  url: _day,
  envIntensity: 0.375,
  bgIntensity: 0.75,
} as HDRI;

const _evening = "/hdr/qwantani_moon_noon_puresky_4k.hdr";
const evening = {
  url: _evening,
  envIntensity: 0.2,
  bgIntensity: 0.4,
} as HDRI;

export const levels: LevelDefinition[] = [
  {
    title: "Hole 1",
    par: 3,
    model: "/m-golf-holes-001.glb",
    fallThreshold: -3,
    spawn: { x: 0.5, y: 0.65, z: 0 },
    hdr: day,
  },
  {
    title: "Hole 2",
    par: 3,
    model: "/m-golf-holes-002.glb",
    fallThreshold: -6,
    spawn: { x: 0.5, y: 0.65, z: 0 },
    hdr: day,
  },
  {
    title: "Hole 3",
    par: 5,
    model: "/m-golf-holes-003.glb",
    fallThreshold: -15,
    spawn: { x: 0, y: 0.65, z: 0 },
    useAdaptiveCamera: { active: true, lerpNudge: 1.5, lerpSpeed: 0.035 },
    hdr: evening,
  },
  {
    title: "Hole 4",
    par: 5,
    model: "/m-golf-holes-004.glb",
    fallThreshold: -24,
    spawn: { x: 0.5, y: 0.65, z: 0 },
    useAdaptiveCamera: { active: true, lerpNudge: 1.5, lerpSpeed: 0.035 },
    hdr: evening,
  },
];
