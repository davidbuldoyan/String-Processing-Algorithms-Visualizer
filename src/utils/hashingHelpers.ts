/**
 * Polynomial rolling hash for Rabin–Karp (Phase 4).
 * Small modulus is intentional for the visualizer so hash collisions can appear for the thesis demo;
 * production search uses a large prime (and often double hashing).
 */
export const RK_BASE = 256
export const RK_MOD = 1009

export function mod(x: number, m: number): number {
  return ((x % m) + m) % m
}

/** Hash of the first `len` characters of `str` (must have length >= len). */
export function hashPrefix(str: string, len: number, base = RK_BASE, modv = RK_MOD): number {
  let h = 0
  for (let i = 0; i < len; i++) {
    h = mod(h * base + str.charCodeAt(i), modv)
  }
  return h
}

/** base^exp % modv (for rolling: base^(m-1)). */
export function powMod(base: number, exp: number, modv: number): number {
  let r = 1
  let b = mod(base, modv)
  let e = exp
  while (e > 0) {
    if (e & 1) r = mod(r * b, modv)
    b = mod(b * b, modv)
    e >>= 1
  }
  return r
}

/**
 * Roll window one step right: drop left char, shift, add right char.
 * `powHigh` must equal base^(m-1) % modv for pattern length m.
 */
export function rollHash(params: {
  prevHash: number
  outChar: string
  inChar: string
  base: number
  modv: number
  powHigh: number
}): number {
  const { prevHash, outChar, inChar, base, modv, powHigh } = params
  const out = outChar.charCodeAt(0)
  const inn = inChar.charCodeAt(0)
  let x = mod(prevHash - mod(out * powHigh, modv), modv)
  x = mod(base * x + inn, modv)
  return x
}
