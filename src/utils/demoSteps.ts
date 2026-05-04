import type { VisualizerStep } from "../types/visualizerStep";
import i18n from "../i18n";

/** Sample strings from roadmap §7 for quick demos. */
export const SAMPLE_TEXTS = {
  kmp: "ABABDABACDABABCABAB",
  pattern: "ABABCABAB",
  z: "AABAACAADAABAABA",
  rabinKarp: "AABAACAADAABJTAABA",
  rabinKarpPattern: "AABA",
} as const;

/**
 * Generic stepping frames so the Phase 2 UI is usable before real algorithms (Phases 3–5).
 * Slides a window over `text` and compares the first pattern character (visual placeholder).
 */
export function createPlaceholderSteps(
  text: string,
  pattern: string,
  mode: "pair" | "textOnly" = "pair",
): VisualizerStep[] {
  const t = text.trim();
  const p = pattern.trim();

  if (!t) {
    return [
      {
        stepNumber: 0,
        textIndex: 0,
        patternIndex: 0,
        comparedChars: null,
        action: "idle",
        explanation: i18n.t("algorithms.demo.enterText"),
        windowStart: 0,
        windowEnd: -1,
      },
    ];
  }

  if (mode === "pair" && !p) {
    return [
      {
        stepNumber: 0,
        textIndex: 0,
        patternIndex: 0,
        comparedChars: null,
        action: "idle",
        explanation: i18n.t("algorithms.demo.enterPattern"),
        windowStart: 0,
        windowEnd: Math.min(t.length - 1, 0),
      },
    ];
  }

  const steps: VisualizerStep[] = [];
  const m = mode === "textOnly" ? 1 : p.length;
  if (m === 0) return steps;

  const lastStart = Math.max(0, t.length - m);
  const maxWindows = Math.min(lastStart + 1, 12);

  for (let s = 0; s < maxWindows; s++) {
    const end = s + m - 1;
    const tc = t[s] ?? "";
    const pc = mode === "textOnly" ? tc : (p[0] ?? "");
    const match = tc === pc;
    steps.push({
      stepNumber: steps.length,
      textIndex: s,
      patternIndex: 0,
      comparedChars: [tc, pc],
      action: match ? "demo-match" : "demo-mismatch",
      explanation:
        mode === "textOnly"
          ? i18n.t("algorithms.demo.scanning", { s })
          : i18n.t("algorithms.demo.window", {
              s,
              end,
              textChar: tc,
              patternChar: pc,
            }),
      windowStart: s,
      windowEnd: end,
      extraData: { mode: "placeholder" },
    });
  }

  return steps;
}

export function randomAlphabetString(len: number): string {
  const alphabet = "ABCD";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
