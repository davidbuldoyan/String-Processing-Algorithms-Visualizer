import { create } from 'zustand'
import type { VisualizerStep } from '../types/visualizerStep'

export type PlaybackSpeed = 0.5 | 1 | 2

type VisualizerState = {
  text: string
  pattern: string
  steps: VisualizerStep[]
  currentStepIndex: number
  isPlaying: boolean
  playbackSpeed: PlaybackSpeed
  setText: (text: string) => void
  setPattern: (pattern: string) => void
  setSteps: (steps: VisualizerStep[]) => void
  /** Clamped to [0, steps.length - 1]. */
  setCurrentStepIndex: (index: number) => void
  setIsPlaying: (playing: boolean) => void
  setPlaybackSpeed: (speed: PlaybackSpeed) => void
  resetPlayback: () => void
}

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  text: '',
  pattern: '',
  steps: [],
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1,
  setText: (text) => set({ text }),
  setPattern: (pattern) => set({ pattern }),
  setSteps: (steps) => set({ steps, currentStepIndex: 0, isPlaying: false }),
  setCurrentStepIndex: (currentStepIndex) => {
    const { steps } = get()
    const max = Math.max(0, steps.length - 1)
    set({
      currentStepIndex: Math.max(0, Math.min(currentStepIndex, max)),
    })
  },
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  resetPlayback: () => set({ currentStepIndex: 0, isPlaying: false }),
}))
