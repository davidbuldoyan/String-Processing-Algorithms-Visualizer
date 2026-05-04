/** Serialized on Z-function visualization steps (`VisualizerStep.extraData`). */
export type ZPhase =
  | 'intro'
  | 'iterate'
  | 'inside-box'
  | 'outside-box'
  | 'copy-value'
  | 'extend'
  | 'update-box'
  | 'done'

export type ZStepExtra = {
  algorithm: 'z-function'
  phase: ZPhase
  /** Current Z values (same length as string). */
  zValues: number[]
  /** Inclusive Z-box segment that matches the prefix; R < L means “no active box”. */
  L: number
  R: number
  /** Main loop index i. */
  currentI: number
  k?: number
  beta?: number
  /** Indices (a, b) in S with characters being compared: S[a] vs S[b]. */
  comparePair?: [number, number]
}

export function parseZStepExtra(extra: Record<string, unknown> | undefined): ZStepExtra | null {
  if (!extra || extra.algorithm !== 'z-function') return null
  return extra as ZStepExtra
}
