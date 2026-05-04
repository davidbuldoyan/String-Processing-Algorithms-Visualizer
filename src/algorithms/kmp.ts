import type { VisualizerStep } from "../types/visualizerStep";
import type { KMPStepExtra } from "../types/kmpExtra";
import { pushStep } from "../utils/createStep";
import i18n from "../i18n";

function makeExtra(
  phase: KMPStepExtra["phase"],
  lpsSnap: number[],
  rest: Partial<Omit<KMPStepExtra, "algorithm" | "phase" | "lps">> = {},
): KMPStepExtra {
  return { algorithm: "kmp", phase, lps: [...lpsSnap], ...rest };
}

/**
 * Emits every meaningful KMP state: LPS table construction, then search with fallback on mismatch.
 */
export function generateKMPSteps(
  text: string,
  pattern: string,
): VisualizerStep[] {
  const T = text;
  const P = pattern;
  const n = T.length;
  const m = P.length;
  const steps: VisualizerStep[] = [];

  const push = (o: {
    textIndex: number;
    patternIndex: number;
    comparedChars: [string, string] | null;
    action: string;
    explanation: string;
    windowStart: number;
    windowEnd: number;
    extra: KMPStepExtra;
  }) =>
    pushStep(steps, { ...o, extraData: o.extra as Record<string, unknown> });

  if (m === 0) {
    push({
      textIndex: 0,
      patternIndex: 0,
      comparedChars: null,
      action: "kmp:empty-pattern",
      explanation: i18n.t("algorithms.kmp.emptyPattern"),
      windowStart: 0,
      windowEnd: -1,
      extra: makeExtra("intro", []),
    });
    return steps;
  }

  const lps = new Array<number>(m).fill(0);

  push({
    textIndex: 0,
    patternIndex: 0,
    comparedChars: null,
    action: "kmp:intro",
    explanation: i18n.t("algorithms.kmp.intro", { m, n }),
    windowStart: 0,
    windowEnd: m - 1,
    extra: makeExtra("intro", lps),
  });

  push({
    textIndex: 0,
    patternIndex: 0,
    comparedChars: null,
    action: "kmp:lps-init",
    explanation: i18n.t("algorithms.kmp.lpsInit"),
    windowStart: 0,
    windowEnd: 0,
    extra: makeExtra("lps", lps, { lpsI: 0, lpsLen: 0 }),
  });

  let len = 0;
  let pi = 1;
  while (pi < m) {
    push({
      textIndex: pi,
      patternIndex: len,
      comparedChars: [P[pi], P[len]],
      action: "kmp:lps-compare",
      explanation: i18n.t("algorithms.kmp.lpsCompare", {
        pi,
        left: P[pi],
        len,
        right: P[len],
      }),
      windowStart: 0,
      windowEnd: pi,
      extra: makeExtra("lps", lps, { lpsI: pi, lpsLen: len }),
    });

    if (P[pi] === P[len]) {
      len += 1;
      lps[pi] = len;
      push({
        textIndex: pi,
        patternIndex: len,
        comparedChars: null,
        action: "kmp:lps-extend",
        explanation: i18n.t("algorithms.kmp.lpsExtend", { pi, len }),
        windowStart: 0,
        windowEnd: pi,
        extra: makeExtra("lps", lps, { lpsI: pi, lpsLen: len }),
      });
      pi += 1;
    } else if (len > 0) {
      const nextLen = lps[len - 1];
      push({
        textIndex: pi,
        patternIndex: nextLen,
        comparedChars: null,
        action: "kmp:lps-fallback",
        explanation: i18n.t("algorithms.kmp.lpsFallback", {
          from: len - 1,
          nextLen,
          pi,
        }),
        windowStart: 0,
        windowEnd: pi,
        extra: makeExtra("lps", lps, { lpsI: pi, lpsLen: nextLen }),
      });
      len = nextLen;
    } else {
      lps[pi] = 0;
      push({
        textIndex: pi,
        patternIndex: 0,
        comparedChars: null,
        action: "kmp:lps-zero",
        explanation: i18n.t("algorithms.kmp.lpsZero", { pi }),
        windowStart: 0,
        windowEnd: pi,
        extra: makeExtra("lps", lps, { lpsI: pi, lpsLen: 0 }),
      });
      pi += 1;
    }
  }

  const finalLps = [...lps];

  push({
    textIndex: 0,
    patternIndex: 0,
    comparedChars: null,
    action: "kmp:lps-done",
    explanation: i18n.t("algorithms.kmp.lpsDone", { lps: finalLps.join(", ") }),
    windowStart: 0,
    windowEnd: m - 1,
    extra: makeExtra("search", finalLps),
  });

  let i = 0;
  let j = 0;
  const matchStarts: number[] = [];

  while (i < n) {
    push({
      textIndex: i,
      patternIndex: j,
      comparedChars: j < m ? [T[i], P[j]] : null,
      action: "kmp:compare",
      explanation:
        j < m
          ? i18n.t("algorithms.kmp.compare", {
              i,
              textChar: T[i],
              j,
              patternChar: P[j],
              windowStart: i - j,
            })
          : i18n.t("algorithms.kmp.advanceInternal"),
      windowStart: Math.max(0, i - j),
      windowEnd: Math.min(n - 1, i - j + m - 1),
      extra: makeExtra("search", finalLps, { matchStarts: [...matchStarts] }),
    });

    if (j < m && T[i] === P[j]) {
      i += 1;
      j += 1;
      if (j === m) {
        const start = i - m;
        matchStarts.push(start);
        push({
          textIndex: i - 1,
          patternIndex: m - 1,
          comparedChars: null,
          action: "kmp:match",
          explanation: i18n.t("algorithms.kmp.fullMatch", {
            start,
            last: m - 1,
            nextJ: finalLps[m - 1],
          }),
          windowStart: start,
          windowEnd: i - 1,
          extra: makeExtra("search", finalLps, {
            matchStarts: [...matchStarts],
            matchHighlight: [start, i - 1],
          }),
        });
        j = finalLps[m - 1];
      }
    } else if (j > 0) {
      const nj = finalLps[j - 1];
      push({
        textIndex: i,
        patternIndex: nj,
        comparedChars: null,
        action: "kmp:search-fallback",
        explanation: i18n.t("algorithms.kmp.searchFallback", {
          j,
          from: j - 1,
          nextJ: nj,
        }),
        windowStart: Math.max(0, i - j),
        windowEnd: Math.min(n - 1, i - j + m - 1),
        extra: makeExtra("search", finalLps, { matchStarts: [...matchStarts] }),
      });
      j = nj;
    } else {
      push({
        textIndex: i,
        patternIndex: 0,
        comparedChars: null,
        action: "kmp:advance-i",
        explanation: i18n.t("algorithms.kmp.advanceI", { i, nextI: i + 1 }),
        windowStart: i,
        windowEnd: Math.min(n - 1, i + m - 1),
        extra: makeExtra("search", finalLps, { matchStarts: [...matchStarts] }),
      });
      i += 1;
    }
  }

  push({
    textIndex: n === 0 ? 0 : n - 1,
    patternIndex: j,
    comparedChars: null,
    action: "kmp:done",
    explanation:
      matchStarts.length === 0
        ? i18n.t("algorithms.kmp.doneNone")
        : i18n.t("algorithms.kmp.doneSome", {
            count: matchStarts.length,
            starts: matchStarts.join(", "),
          }),
    windowStart: 0,
    windowEnd: -1,
    extra: makeExtra("complete", finalLps, { matchStarts: [...matchStarts] }),
  });

  return steps;
}
