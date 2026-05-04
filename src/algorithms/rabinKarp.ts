import type { VisualizerStep } from '../types/visualizerStep'
import type { RabinKarpStepExtra } from '../types/rkExtra'
import { hashPrefix, powMod, rollHash, RK_BASE, RK_MOD } from '../utils/hashingHelpers'
import { pushStep } from '../utils/createStep'
import i18n from '../i18n'

function rkExtra(partial: Omit<RabinKarpStepExtra, 'algorithm'>): RabinKarpStepExtra {
  return { algorithm: 'rabin-karp', ...partial }
}

/**
 * Rabin–Karp step stream: pattern hash, rolling window, hash equality checks,
 * verification, and collision handling.
 */
export function generateRabinKarpSteps(text: string, pattern: string): VisualizerStep[] {
  const T = text
  const P = pattern
  const n = T.length
  const m = P.length
  const BASE = RK_BASE
  const MOD = RK_MOD
  const powH = m > 0 ? powMod(BASE, m - 1, MOD) : 0
  const steps: VisualizerStep[] = []
  const confirmed: number[] = []

  const push = (o: {
    textIndex: number
    patternIndex: number
    comparedChars: [string, string] | null
    action: string
    explanation: string
    windowStart: number
    windowEnd: number
    extra: RabinKarpStepExtra
  }) => pushStep(steps, { ...o, extraData: o.extra as Record<string, unknown> })

  if (m === 0) {
    push({
      textIndex: 0,
      patternIndex: 0,
      comparedChars: null,
      action: 'rk:empty-pattern',
      explanation: i18n.t('algorithms.rabinKarp.emptyPattern'),
      windowStart: 0,
      windowEnd: -1,
      extra: rkExtra({
        phase: 'intro',
        base: BASE,
        mod: MOD,
        patternHash: 0,
        windowHash: null,
        powHigh: powH,
        hashMatch: false,
      }),
    })
    return steps
  }

  const patternHash = hashPrefix(P, m, BASE, MOD)

  push({
    textIndex: 0,
    patternIndex: 0,
    comparedChars: null,
    action: 'rk:intro',
    explanation: i18n.t('algorithms.rabinKarp.intro', { base: BASE, mod: MOD }),
    windowStart: 0,
    windowEnd: m - 1,
    extra: rkExtra({
      phase: 'intro',
      base: BASE,
      mod: MOD,
      patternHash,
      windowHash: null,
      powHigh: powH,
      hashMatch: false,
    }),
  })

  push({
    textIndex: 0,
    patternIndex: 0,
    comparedChars: null,
    action: 'rk:pattern-hash',
    explanation: i18n.t('algorithms.rabinKarp.patternHash', { patternHash, m }),
    windowStart: 0,
    windowEnd: m - 1,
    extra: rkExtra({
      phase: 'precompute',
      base: BASE,
      mod: MOD,
      patternHash,
      windowHash: null,
      powHigh: powH,
      hashMatch: false,
    }),
  })

  if (n < m) {
    push({
      textIndex: 0,
      patternIndex: 0,
      comparedChars: null,
      action: 'rk:text-too-short',
      explanation: i18n.t('algorithms.rabinKarp.textTooShort'),
      windowStart: 0,
      windowEnd: -1,
      extra: rkExtra({
        phase: 'done',
        base: BASE,
        mod: MOD,
        patternHash,
        windowHash: null,
        powHigh: powH,
        hashMatch: false,
        confirmedMatchStarts: [],
      }),
    })
    return steps
  }

  let windowHash = hashPrefix(T, m, BASE, MOD)

  for (let s = 0; s <= n - m; s++) {
    const wEnd = s + m - 1
    const hashMatch = windowHash === patternHash

    push({
      textIndex: s,
      patternIndex: 0,
      comparedChars: null,
      action: 'rk:window-hash',
      explanation: i18n.t('algorithms.rabinKarp.windowHash', {
        s,
        wEnd,
        windowHash,
        patternHash,
        decision: hashMatch
          ? i18n.t('algorithms.rabinKarp.hashEqual')
          : i18n.t('algorithms.rabinKarp.hashDifferent'),
      }),
      windowStart: s,
      windowEnd: wEnd,
      extra: rkExtra({
        phase: 'windows',
        base: BASE,
        mod: MOD,
        patternHash,
        windowHash,
        powHigh: powH,
        hashMatch,
      }),
    })

    if (hashMatch) {
      push({
        textIndex: s,
        patternIndex: 0,
        comparedChars: null,
        action: 'rk:hash-match',
        explanation: i18n.t('algorithms.rabinKarp.hashMatch'),
        windowStart: s,
        windowEnd: wEnd,
        extra: rkExtra({
          phase: 'windows',
          base: BASE,
          mod: MOD,
          patternHash,
          windowHash,
          powHigh: powH,
          hashMatch: true,
        }),
      })

      let collided = false
      for (let k = 0; k < m; k++) {
        const tc = T[s + k]
        const pc = P[k]
        const same = tc === pc
        push({
          textIndex: s + k,
          patternIndex: k,
          comparedChars: [tc, pc],
          action: 'rk:verify',
          explanation: same
            ? i18n.t('algorithms.rabinKarp.verifySame', { k, char: tc })
            : i18n.t('algorithms.rabinKarp.verifyDifferent', {
                k,
                textChar: tc,
                patternChar: pc,
              }),
          windowStart: s,
          windowEnd: wEnd,
          extra: rkExtra({
            phase: 'verify',
            base: BASE,
            mod: MOD,
            patternHash,
            windowHash,
            powHigh: powH,
            hashMatch: true,
            verifying: true,
            verifyIndex: k,
            confirmedMatchStarts: [...confirmed],
          }),
        })
        if (!same) {
          collided = true
          push({
            textIndex: s + k,
            patternIndex: k,
            comparedChars: [tc, pc],
            action: 'rk:collision',
            explanation: i18n.t('algorithms.rabinKarp.collisionResolved'),
            windowStart: s,
            windowEnd: wEnd,
            extra: rkExtra({
              phase: 'verify',
              base: BASE,
              mod: MOD,
              patternHash,
              windowHash,
              powHigh: powH,
              hashMatch: true,
              verifying: false,
              collision: true,
              confirmedMatchStarts: [...confirmed],
            }),
          })
          break
        }
      }

      if (!collided) {
        confirmed.push(s)
        push({
          textIndex: wEnd,
          patternIndex: m - 1,
          comparedChars: null,
          action: 'rk:confirmed',
          explanation: i18n.t('algorithms.rabinKarp.confirmed', { m, s }),
          windowStart: s,
          windowEnd: wEnd,
          extra: rkExtra({
            phase: 'verify',
            base: BASE,
            mod: MOD,
            patternHash,
            windowHash,
            powHigh: powH,
            hashMatch: true,
            verifying: false,
            collision: false,
            confirmedMatchStarts: [...confirmed],
            matchHighlight: [s, wEnd],
          }),
        })
      }
    }

    if (s < n - m) {
      const outCh = T[s]
      const inCh = T[s + m]
      const nextHash = rollHash({
        prevHash: windowHash,
        outChar: outCh,
        inChar: inCh,
        base: BASE,
        modv: MOD,
        powHigh: powH,
      })
      push({
        textIndex: s,
        patternIndex: 0,
        comparedChars: null,
        action: 'rk:roll',
        explanation: i18n.t('algorithms.rabinKarp.rolling', {
          outCh,
          powH,
          base: BASE,
          inCh,
          mod: MOD,
          nextStart: s + 1,
        }),
        windowStart: s,
        windowEnd: wEnd,
        extra: rkExtra({
          phase: 'windows',
          base: BASE,
          mod: MOD,
          patternHash,
          windowHash: nextHash,
          powHigh: powH,
          hashMatch: false,
          prevHash: windowHash,
          outChar: outCh,
          inChar: inCh,
        }),
      })
      windowHash = nextHash
    }
  }

  push({
    textIndex: Math.max(0, n - 1),
    patternIndex: 0,
    comparedChars: null,
    action: 'rk:done',
    explanation:
      confirmed.length === 0
        ? i18n.t('algorithms.rabinKarp.doneNone')
        : i18n.t('algorithms.rabinKarp.doneSome', { starts: confirmed.join(', ') }),
    windowStart: 0,
    windowEnd: -1,
    extra: rkExtra({
      phase: 'done',
      base: BASE,
      mod: MOD,
      patternHash,
      windowHash: null,
      powHigh: powH,
      hashMatch: false,
      confirmedMatchStarts: [...confirmed],
    }),
  })

  return steps
}
