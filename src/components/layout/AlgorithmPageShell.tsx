import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AlgorithmVisualizer } from '../visualizer/AlgorithmVisualizer'
import { VisualizerControls, type VisualizerControlsProps } from '../controls/VisualizerControls'
import { TheoryModal } from '../shared/TheoryModal'

export type AlgorithmPageShellProps = {
  title: string
  description: string
  showPatternRow: boolean
  belowVisualizer?: ReactNode
  theoryTitle?: string
  theoryContent?: ReactNode
} & Pick<
  VisualizerControlsProps,
  'stepMode' | 'showPatternField' | 'customStepBuilder' | 'sampleKinds'
>

export function AlgorithmPageShell({
  title,
  description,
  showPatternRow,
  belowVisualizer,
  stepMode,
  showPatternField,
  customStepBuilder,
  sampleKinds,
  theoryTitle,
  theoryContent,
}: AlgorithmPageShellProps) {
  const { t } = useTranslation()
  const [theoryOpen, setTheoryOpen] = useState(false)

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">{description}</p>
        </div>
        {theoryContent && (
          <button
            type="button"
            onClick={() => setTheoryOpen(true)}
            className="shrink-0 rounded-xl border border-algo-zbox/40 bg-algo-zbox/10 px-4 py-2 text-sm font-semibold text-algo-zbox shadow-sm transition hover:bg-algo-zbox/20 dark:border-algo-zbox/50 dark:text-purple-300 dark:hover:bg-algo-zbox/25"
          >
            {t('shell.theory')}
          </button>
        )}
      </div>
      <VisualizerControls
        showAlgorithmPicker
        stepMode={stepMode}
        showPatternField={showPatternField}
        customStepBuilder={customStepBuilder}
        sampleKinds={sampleKinds}
      />
      <AlgorithmVisualizer showPatternRow={showPatternRow} />
      {belowVisualizer}
      {theoryTitle && theoryContent && (
        <TheoryModal open={theoryOpen} onClose={() => setTheoryOpen(false)} title={theoryTitle}>
          {theoryContent}
        </TheoryModal>
      )}
    </motion.div>
  )
}
