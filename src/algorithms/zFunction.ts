import type { VisualizerStep } from '../types/visualizerStep'
import type { ZStepExtra } from '../types/zExtra'
import { pushStep } from '../utils/createStep'
import i18n from '../i18n'

function zExtra(partial: Omit<ZStepExtra, 'algorithm'>): ZStepExtra {
  return { algorithm: 'z-function', ...partial }
}

/**
 * Linear-time Z-function with full step trace: Z-box [L,R], reuse of Z[k], naive extension.
 * Z[0] stays 0 during construction; we only compute i = 1 .. n-1 (standard CP presentation).
 */
export function generateZFunctionSteps(text: string): VisualizerStep[] {
  const S = text
  const n = S.length
  const steps: VisualizerStep[] = []
  const z = new Array<number>(n).fill(0)
  let l = 0
  let r = 0

  const push = (o: {
    textIndex: number
    patternIndex: number
    comparedChars: [string, string] | null
    action: string
    explanation: string
    extra: ZStepExtra
  }) => pushStep(steps, { ...o, windowStart: 0, windowEnd: -1, extraData: o.extra as Record<string, unknown> })

  const snap = () => [...z]

  if (n === 0) {
    push({
      textIndex: 0,
      patternIndex: 0,
      comparedChars: null,
      action: 'z:empty',
      explanation: i18n.t('algorithms.zFunction.empty'),
      extra: zExtra({
        phase: 'intro',
        zValues: [],
        L: 0,
        R: -1,
        currentI: 0,
      }),
    })
    return steps
  }

  push({
    textIndex: 0,
    patternIndex: 0,
    comparedChars: null,
    action: 'z:intro',
    explanation: i18n.t('algorithms.zFunction.intro', { last: n - 1 }),
    extra: zExtra({
      phase: 'intro',
      zValues: snap(),
      L: l,
      R: r,
      currentI: 0,
    }),
  })

  if (n === 1) {
    push({
      textIndex: 0,
      patternIndex: 0,
      comparedChars: null,
      action: 'z:done',
      explanation: i18n.t('algorithms.zFunction.single'),
      extra: zExtra({
        phase: 'done',
        zValues: snap(),
        L: l,
        R: r,
        currentI: 0,
      }),
    })
    return steps
  }

  for (let i = 1; i < n; i++) {
    push({
      textIndex: i,
      patternIndex: 0,
      comparedChars: null,
      action: 'z:iterate',
      explanation:
        r < i
          ? i18n.t('algorithms.zFunction.iterateOutside', { i, r })
          : i18n.t('algorithms.zFunction.iterateInside', { i, l, r }),
      extra: zExtra({
        phase: 'iterate',
        zValues: snap(),
        L: l,
        R: r,
        currentI: i,
      }),
    })

    if (i <= r) {
      const k = i - l
      const beta = r - i + 1
      push({
        textIndex: i,
        patternIndex: 0,
        comparedChars: null,
        action: 'z:inside-box',
        explanation: i18n.t('algorithms.zFunction.insideBox', { k, beta, zk: z[k] }),
        extra: zExtra({
          phase: 'inside-box',
          zValues: snap(),
          L: l,
          R: r,
          currentI: i,
          k,
          beta,
        }),
      })

      if (z[k] < beta) {
        z[i] = z[k]
        push({
          textIndex: i,
          patternIndex: 0,
          comparedChars: null,
          action: 'z:copy',
          explanation: i18n.t('algorithms.zFunction.copy', { k, zk: z[k], i, zi: z[i] }),
          extra: zExtra({
            phase: 'copy-value',
            zValues: snap(),
            L: l,
            R: r,
            currentI: i,
            k,
            beta,
          }),
        })
      } else {
        z[i] = beta
        push({
          textIndex: i,
          patternIndex: 0,
          comparedChars: null,
          action: 'z:from-beta',
          explanation: i18n.t('algorithms.zFunction.fromBeta', { k, i, beta }),
          extra: zExtra({
            phase: 'extend',
            zValues: snap(),
            L: l,
            R: r,
            currentI: i,
            k,
            beta,
          }),
        })

        while (i + z[i] < n) {
          const a = z[i]
          const b = i + z[i]
          const ca = S[a]
          const cb = S[b]
          push({
            textIndex: i,
            patternIndex: 0,
            comparedChars: [ca, cb],
            action: 'z:extend-compare',
            explanation:
              ca === cb
                ? i18n.t('algorithms.zFunction.extendSame', { a, ca, b, cb, i })
                : i18n.t('algorithms.zFunction.extendDifferent', { a, ca, b, cb }),
            extra: zExtra({
              phase: 'extend',
              zValues: snap(),
              L: l,
              R: r,
              currentI: i,
              k,
              beta,
              comparePair: [a, b],
            }),
          })
          if (ca !== cb) break
          z[i] += 1
        }
      }
    } else {
      push({
        textIndex: i,
        patternIndex: 0,
        comparedChars: null,
        action: 'z:outside-box',
        explanation: i18n.t('algorithms.zFunction.outsideBox', { i }),
        extra: zExtra({
          phase: 'outside-box',
          zValues: snap(),
          L: l,
          R: r,
          currentI: i,
        }),
      })

      z[i] = 0
      while (i + z[i] < n) {
        const a = z[i]
        const b = i + z[i]
        const ca = S[a]
        const cb = S[b]
        push({
          textIndex: i,
          patternIndex: 0,
          comparedChars: [ca, cb],
          action: 'z:naive-compare',
          explanation:
            ca === cb
              ? i18n.t('algorithms.zFunction.naiveSame', { a, ca, b, cb, i })
              : i18n.t('algorithms.zFunction.naiveDifferent', { a, b, i }),
          extra: zExtra({
            phase: 'extend',
            zValues: snap(),
            L: l,
            R: r,
            currentI: i,
            comparePair: [a, b],
          }),
        })
        if (ca !== cb) break
        z[i] += 1
      }
    }

    if (i + z[i] - 1 > r) {
      const prevL = l
      const prevR = r
      l = i
      r = i + z[i] - 1
      push({
        textIndex: i,
        patternIndex: 0,
        comparedChars: null,
        action: 'z:update-box',
        explanation: i18n.t('algorithms.zFunction.updateBox', {
          l,
          r,
          prevL,
          prevR,
          i,
          right: i + z[i] - 1,
        }),
        extra: zExtra({
          phase: 'update-box',
          zValues: snap(),
          L: l,
          R: r,
          currentI: i,
        }),
      })
    }
  }

  push({
    textIndex: n - 1,
    patternIndex: 0,
    comparedChars: null,
    action: 'z:done',
    explanation: i18n.t('algorithms.zFunction.done', { z: snap().join(', ') }),
    extra: zExtra({
      phase: 'done',
      zValues: snap(),
      L: l,
      R: r,
      currentI: n - 1,
    }),
  })

  return steps
}
