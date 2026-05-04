import { useCallback, useEffect, useRef } from 'react'
import { useVisualizerStore } from '../store/visualizerStore'

const BASE_INTERVAL_MS = 720

/**
 * Auto-advance steps while playing; exposes manual controls (roadmap §5).
 * Uses the visualizer store as the single source of truth.
 */
export function useAnimationController() {
  const steps = useVisualizerStore((s) => s.steps)
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex)
  const isPlaying = useVisualizerStore((s) => s.isPlaying)
  const playbackSpeed = useVisualizerStore((s) => s.playbackSpeed)
  const setCurrentStepIndex = useVisualizerStore((s) => s.setCurrentStepIndex)
  const setIsPlaying = useVisualizerStore((s) => s.setIsPlaying)
  const resetPlayback = useVisualizerStore((s) => s.resetPlayback)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const play = useCallback(() => {
    if (steps.length === 0) return
    setIsPlaying(true)
  }, [setIsPlaying, steps.length])

  const pause = useCallback(() => setIsPlaying(false), [setIsPlaying])

  const next = useCallback(() => {
    setCurrentStepIndex(currentStepIndex + 1)
  }, [currentStepIndex, setCurrentStepIndex])

  const previous = useCallback(() => {
    setCurrentStepIndex(currentStepIndex - 1)
  }, [currentStepIndex, setCurrentStepIndex])

  const reset = useCallback(() => resetPlayback(), [resetPlayback])

  useEffect(() => {
    if (!isPlaying || steps.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const ms = BASE_INTERVAL_MS / playbackSpeed
    intervalRef.current = setInterval(() => {
      const s = useVisualizerStore.getState()
      const max = Math.max(0, s.steps.length - 1)
      if (s.currentStepIndex >= max) {
        s.setIsPlaying(false)
        return
      }
      s.setCurrentStepIndex(s.currentStepIndex + 1)
    }, ms)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPlaying, playbackSpeed, steps.length])

  return { play, pause, next, previous, reset }
}
