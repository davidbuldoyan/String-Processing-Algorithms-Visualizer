import type { VisualizerStep } from '../../types/visualizerStep'
import { parseKmpStepExtra } from '../../types/kmpExtra'
import { parseRkStepExtra } from '../../types/rkExtra'
import { parseZStepExtra } from '../../types/zExtra'

type Row = 'text' | 'pattern'

const baseCell =
  'flex h-12 w-10 shrink-0 items-center justify-center rounded-lg border text-sm font-mono font-semibold transition-colors'

const MATCH_BAND = 'border-algo-match/50 bg-algo-match/25 text-slate-900 ring-1 ring-algo-match/30 dark:text-white'
const MATCH_HIGHLIGHT = 'border-algo-match bg-algo-match/35 text-slate-900 ring-2 ring-algo-match/60 dark:text-white'
const DEFAULT_BORDER = 'border-slate-200/90 bg-white/80 text-slate-900 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-100'

function slidingWindowOnText(
  kmp: ReturnType<typeof parseKmpStepExtra>,
  rk: ReturnType<typeof parseRkStepExtra>,
  z: ReturnType<typeof parseZStepExtra>,
): boolean {
  if (z) return false
  if (kmp) return kmp.phase === 'search' || kmp.phase === 'complete'
  if (rk) return rk.phase === 'windows' || rk.phase === 'verify'
  return true
}

function rkHashMatchGlow(step: VisualizerStep, rk: NonNullable<ReturnType<typeof parseRkStepExtra>>): boolean {
  if (!rk.hashMatch || rk.verifying || rk.collision || rk.phase !== 'windows') return false
  return step.action === 'rk:window-hash' || step.action === 'rk:hash-match'
}

function indexInMatchStarts(index: number, starts: number[], patternLength: number): boolean {
  for (const start of starts) {
    if (index >= start && index <= start + patternLength - 1) return true
  }
  return false
}

function indexInHighlight(index: number, highlight: [number, number] | undefined): boolean {
  if (!highlight) return false
  return index >= highlight[0] && index <= highlight[1]
}

export function getCharCellClasses(
  step: VisualizerStep,
  row: Row,
  index: number,
  patternLength: number,
): string {
  const kmp = parseKmpStepExtra(step.extraData as Record<string, unknown> | undefined)
  const rk = parseRkStepExtra(step.extraData as Record<string, unknown> | undefined)
  const z = parseZStepExtra(step.extraData as Record<string, unknown> | undefined)

  if (z && row === 'text') {
    // Once the algorithm reports `done` there is no active iteration any
    // more — the last Z-box, the current-index ring and any compare-pair
    // markers are all stale. Render every text cell with the default
    // border so the final frame reads as a clean result state (the bar
    // chart and the result card in the panel surface the actual answer).
    if (z.phase === 'done') {
      return [baseCell, DEFAULT_BORDER].join(' ')
    }

    // The Z-box is only visually "active" while the loop index is still inside
    // it (currentI <= R). Once i has drifted past R the algorithm explicitly
    // takes the outside-box branch and the previous box is irrelevant to the
    // current iteration — drawing it on top of the new matched prefix/mirror
    // bands would show two unrelated regions at once.
    const boxActive = z.R >= z.L && z.currentI <= z.R
    const inZBox = boxActive && index >= z.L && index <= z.R
    let border = DEFAULT_BORDER

    const curZ = z.zValues[z.currentI] ?? 0
    // Cumulative prefix/mirror band: indices [0, curZ-1] of the prefix and [currentI, currentI + curZ - 1]
    // of the mirror are confirmed equal so far. Shown whenever the algorithm is reasoning about that
    // partial match (compare loops, copy-from-mirror, or the from-β seed step).
    const showMatchBand =
      curZ > 0 &&
      (z.comparePair !== undefined ||
        z.phase === 'copy-value' ||
        z.phase === 'extend')
    const inMatchedPrefix = showMatchBand && index >= 0 && index < curZ
    const inMatchedMirror =
      showMatchBand && index >= z.currentI && index < z.currentI + curZ

    const [ca, cb] = z.comparePair && step.comparedChars ? step.comparedChars : [null, null]
    const inCompare =
      z.comparePair &&
      (index === z.comparePair[0] || index === z.comparePair[1]) &&
      step.comparedChars

    if (inCompare && ca !== null && cb !== null) {
      border = ca === cb
        ? 'border-algo-match bg-algo-match/25 text-slate-900 ring-2 ring-algo-match/50 dark:text-white'
        : 'border-algo-mismatch bg-algo-mismatch/20 text-slate-900 ring-2 ring-algo-mismatch/50 dark:text-white'
    } else if (index === z.currentI) {
      if (inZBox) {
        border = 'border-algo-zbox bg-algo-zbox/30 text-slate-900 ring-2 ring-violet-400 dark:text-white'
      } else if (inMatchedMirror) {
        border = 'border-algo-match bg-algo-match/30 text-slate-900 ring-2 ring-violet-400 dark:text-white'
      } else {
        border = 'border-violet-500 bg-violet-500/15 text-slate-900 ring-2 ring-violet-400 dark:text-white'
      }
    } else if (inMatchedPrefix || inMatchedMirror) {
      border = MATCH_BAND
    } else if (inZBox) {
      border = 'border-algo-zbox/80 bg-algo-zbox/20 text-slate-900 ring-1 ring-algo-zbox/45 dark:text-slate-100'
    }

    return [baseCell, border].join(' ')
  }

  let border = DEFAULT_BORDER

  const windowOnTextRow = slidingWindowOnText(kmp, rk, z)
  const inWindow =
    step.windowEnd >= 0 &&
    index >= step.windowStart &&
    index <= step.windowEnd &&
    (row === 'pattern' || windowOnTextRow)

  const inTextWindowBand =
    row === 'text' && step.windowEnd >= 0 && index >= step.windowStart && index <= step.windowEnd

  const matchStarts = kmp?.matchStarts ?? rk?.confirmedMatchStarts
  const matchHighlight = kmp?.matchHighlight ?? rk?.matchHighlight
  const inMatchBand =
    row === 'text' &&
    !!matchStarts &&
    patternLength > 0 &&
    indexInMatchStarts(index, matchStarts, patternLength)
  const inMatchHighlight = row === 'text' && indexInHighlight(index, matchHighlight)

  if (rk?.collision && inTextWindowBand && !inMatchHighlight && !inMatchBand) {
    border =
      'border-algo-mismatch bg-algo-mismatch/20 text-slate-900 ring-2 ring-algo-mismatch/50 dark:text-white'
  } else if (
    rk &&
    row === 'text' &&
    inTextWindowBand &&
    rkHashMatchGlow(step, rk) &&
    !inMatchHighlight &&
    !inMatchBand
  ) {
    border =
      'border-algo-hash bg-algo-hash/25 text-slate-900 ring-2 ring-algo-hash/50 dark:text-white'
  } else if (inWindow && !inMatchHighlight && !inMatchBand) {
    border =
      'border-algo-window/80 bg-algo-window/15 text-slate-900 ring-1 ring-algo-window/40 dark:text-slate-50'
  }

  if (inMatchBand) {
    border = MATCH_BAND
  }
  if (inMatchHighlight) {
    border = MATCH_HIGHLIGHT
  }

  let isCompared = false
  if (kmp?.phase === 'lps' && row === 'pattern') {
    const li = kmp.lpsI
    const ll = kmp.lpsLen
    if (li !== undefined && ll !== undefined) {
      isCompared = index === li || index === ll
    }
  } else if (kmp?.phase === 'search' || kmp?.phase === 'complete') {
    isCompared = row === 'text' ? index === step.textIndex : index === step.patternIndex
  } else if (rk?.phase === 'verify' && rk.verifying) {
    isCompared = row === 'text' ? index === step.textIndex : index === step.patternIndex
  } else if (!kmp && !rk) {
    isCompared = row === 'text' ? index === step.textIndex : index === step.patternIndex
  }

  if (isCompared) {
    if (step.comparedChars) {
      const [x, y] = step.comparedChars
      border = x === y
        ? 'border-algo-match bg-algo-match/20 text-slate-900 ring-1 ring-algo-match/50 dark:text-white'
        : 'border-algo-mismatch bg-algo-mismatch/15 text-slate-900 ring-1 ring-algo-mismatch/50 dark:text-white'
    } else if (kmp?.phase === 'lps' && row === 'pattern') {
      border = 'border-algo-hash/70 bg-algo-hash/15 text-slate-900 ring-1 ring-algo-hash/40 dark:text-white'
    }
  }

  return [baseCell, border].join(' ')
}
