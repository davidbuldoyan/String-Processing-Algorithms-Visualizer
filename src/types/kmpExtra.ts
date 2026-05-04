/** Serialized on each KMP visualization step (`VisualizerStep.extraData`). */
export type KMPPhase = "intro" | "lps" | "search" | "complete";

export type KMPStepExtra = {
  algorithm: "kmp";
  phase: KMPPhase;
  /** LPS values after this step (length = pattern length). */
  lps: number[];
  /** LPS construction: pattern index being filled. */
  lpsI?: number;
  /** LPS construction: current candidate prefix length (compared with P[lpsLen]). */
  lpsLen?: number;
  /** Text indices where a full match starts (cumulative during search). */
  matchStarts?: number[];
  /** Inclusive range in text to emphasize as a just-found match. */
  matchHighlight?: [number, number];
};

export function parseKmpStepExtra(
  extra: Record<string, unknown> | undefined,
): KMPStepExtra | null {
  if (!extra || extra.algorithm !== "kmp") return null;
  return extra as KMPStepExtra;
}
