import type { VisualizerStep } from '../types/visualizerStep'

type StepInput = {
  textIndex: number
  patternIndex: number
  comparedChars: [string, string] | null
  action: string
  explanation: string
  windowStart: number
  windowEnd: number
  extraData?: Record<string, unknown>
}

/** Append a new step to the array, auto-assigning `stepNumber`. */
export function pushStep(steps: VisualizerStep[], input: StepInput): void {
  steps.push({
    stepNumber: steps.length,
    textIndex: input.textIndex,
    patternIndex: input.patternIndex,
    comparedChars: input.comparedChars,
    action: input.action,
    explanation: input.explanation,
    windowStart: input.windowStart,
    windowEnd: input.windowEnd,
    extraData: input.extraData,
  })
}
