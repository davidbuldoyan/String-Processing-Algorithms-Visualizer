import { useEffect } from 'react'
import { useVisualizerStore } from '../store/visualizerStore'

/**
 * Global keyboard shortcuts for step playback:
 *  Space  — play / pause
 *  →      — next step
 *  ←      — previous step
 *  Home   — first step
 *  End    — last step
 *  R      — reset
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const s = useVisualizerStore.getState()
      if (s.steps.length === 0) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          s.setIsPlaying(!s.isPlaying)
          break
        case 'ArrowRight':
          e.preventDefault()
          s.setIsPlaying(false)
          s.setCurrentStepIndex(s.currentStepIndex + 1)
          break
        case 'ArrowLeft':
          e.preventDefault()
          s.setIsPlaying(false)
          s.setCurrentStepIndex(s.currentStepIndex - 1)
          break
        case 'Home':
          e.preventDefault()
          s.setIsPlaying(false)
          s.setCurrentStepIndex(0)
          break
        case 'End':
          e.preventDefault()
          s.setIsPlaying(false)
          s.setCurrentStepIndex(s.steps.length - 1)
          break
        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            s.resetPlayback()
          }
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
