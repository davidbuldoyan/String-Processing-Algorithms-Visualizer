/** Serialized on Rabin–Karp visualization steps (`VisualizerStep.extraData`). */
export type RKPhase = 'intro' | 'precompute' | 'windows' | 'verify' | 'done'

export type RabinKarpStepExtra = {
  algorithm: 'rabin-karp'
  phase: RKPhase
  base: number
  mod: number
  patternHash: number
  /** Hash of the current text window, or null during intro/precompute-only frames. */
  windowHash: number | null
  /** B^(m-1) % mod — used in the rolling update. */
  powHigh: number
  /** Hashes equal at this step (spurious possible until verification). */
  hashMatch: boolean
  /** Character-by-character check after a hash match. */
  verifying?: boolean
  verifyIndex?: number
  /** Hash matched but substring differs (collision). */
  collision?: boolean
  confirmedMatchStarts?: number[]
  matchHighlight?: [number, number]
  /** Rolling update fields (present only on `rk:roll` steps). */
  prevHash?: number
  outChar?: string
  inChar?: string
}

export function parseRkStepExtra(
  extra: Record<string, unknown> | undefined,
): RabinKarpStepExtra | null {
  if (!extra || extra.algorithm !== 'rabin-karp') return null
  return extra as RabinKarpStepExtra
}
