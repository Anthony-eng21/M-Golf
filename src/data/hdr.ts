import type { HDRI } from "./types.ts";

const base = "/hdr/kloppenheim_07_puresky_1k.hdr";
export const day = {
  url: base,
  envIntensity: 1,
  bgIntensity: 1,
} as HDRI;

export const evening = {
  url: base,
  envIntensity: 0.1,
  bgIntensity: 0.2,
  rotY: 0.75,
} as HDRI;

const _night = "/hdr/kloppenheim_02_puresky_1k.hdr";
export const night = {
  url: _night,
  envIntensity: 0.05,
  bgIntensity: 0.025,
  rotY: 0.625,
} as HDRI;
