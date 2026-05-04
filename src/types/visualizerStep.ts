/** One animation frame for the diploma visualizer (roadmap §4). */
export type VisualizerStep = {
  stepNumber: number
  textIndex: number
  patternIndex: number
  comparedChars: [string, string] | null
  action: string
  explanation: string
  windowStart: number
  windowEnd: number
  extraData?: Record<string, unknown>
}
