import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useVisualizerStore } from '../../store/visualizerStore'
import { getCharCellClasses } from './stepHighlight'

export type AlgorithmVisualizerProps = {
  showPatternRow?: boolean
}

export function AlgorithmVisualizer({ showPatternRow = true }: AlgorithmVisualizerProps) {
  const { t } = useTranslation()
  const steps = useVisualizerStore((s) => s.steps)
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex)
  const text = useVisualizerStore((s) => s.text)
  const pattern = useVisualizerStore((s) => s.pattern)

  const step = steps[currentStepIndex]
  const textChars = text.split('')
  const patternChars = pattern.split('')
  const m = patternChars.length

  return (
    <div className="glass-panel space-y-6 p-5">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{t('visualizer.title')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('visualizer.description')}
          </p>
        </div>
        {step ? (
          <div className="rounded-lg bg-slate-100/80 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
            {t('controls.step')} {step.stepNumber + 1} · {step.action}
          </div>
        ) : null}
      </div>

      {!step ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('visualizer.noSteps')}
        </p>
      ) : (
        <>
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('visualizer.textRow')}
            </div>
            <div className="flex flex-wrap items-end gap-1">
              {textChars.map((ch, i) => (
                <div key={`ti-${i}`} className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                    {i}
                  </span>
                  <motion.div
                    layout
                    className={getCharCellClasses(step, 'text', i, m)}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  >
                    {ch}
                  </motion.div>
                </div>
              ))}
              {textChars.length === 0 ? (
                <span className="text-sm text-slate-500 dark:text-slate-400">{t('visualizer.emptyText')}</span>
              ) : null}
            </div>
          </div>

          {showPatternRow && patternChars.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('visualizer.patternRow')}
              </div>
              <div
                className="flex flex-wrap items-end gap-1"
                style={{
                  marginLeft: `calc(${step.windowStart} * (2.5rem + 0.25rem))`,
                }}
              >
                {patternChars.map((ch, j) => (
                  <div key={`pj-${j}`} className="flex flex-col items-center gap-0.5">
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                      {j}
                    </span>
                    <motion.div
                      layout
                      className={getCharCellClasses(step, 'pattern', j, m)}
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    >
                      {ch}
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('visualizer.timeline')}
              </div>
              <div className="mt-2 flex max-h-40 flex-wrap gap-1 overflow-y-auto rounded-xl border border-slate-200/60 bg-white/40 p-2 dark:border-slate-700/60 dark:bg-slate-950/40">
                {steps.map((_, i) => (
                  <button
                    key={`step-${i}`}
                    type="button"
                    onClick={() => {
                      useVisualizerStore.getState().setIsPlaying(false)
                      useVisualizerStore.getState().setCurrentStepIndex(i)
                    }}
                    className={[
                      'rounded-md px-2 py-1 text-xs font-medium transition',
                      i === currentStepIndex
                        ? 'bg-algo-window text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
                    ].join(' ')}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('visualizer.explanation')}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.stepNumber}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 rounded-xl border border-slate-200/70 bg-white/60 p-4 text-sm leading-relaxed text-slate-800 shadow-inner dark:border-slate-700/70 dark:bg-slate-950/50 dark:text-slate-100"
                >
                  {step.explanation}
                </motion.div>
              </AnimatePresence>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-4">
                <div>
                  <dt className="font-semibold text-slate-600 dark:text-slate-300">{t('visualizer.metrics.textIndex')}</dt>
                  <dd className="font-mono">{step.textIndex}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-600 dark:text-slate-300">{t('visualizer.metrics.patternIndex')}</dt>
                  <dd className="font-mono">{step.patternIndex}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-600 dark:text-slate-300">{t('visualizer.metrics.window')}</dt>
                  <dd className="font-mono">
                    [{step.windowStart}, {step.windowEnd}]
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-600 dark:text-slate-300">{t('visualizer.metrics.compared')}</dt>
                  <dd className="font-mono">
                    {step.comparedChars ? step.comparedChars.join(' vs ') : '—'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
