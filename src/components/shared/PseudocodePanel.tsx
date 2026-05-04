import { useTranslation } from 'react-i18next'
import { useVisualizerStore } from '../../store/visualizerStore'
import type { PseudocodeBlock } from '../../data/pseudocode'

type PseudocodePanelProps = {
  pseudocode: PseudocodeBlock[]
}

export function PseudocodePanel({ pseudocode }: PseudocodePanelProps) {
  const { t } = useTranslation()
  const steps = useVisualizerStore((s) => s.steps)
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex)
  const step = steps[currentStepIndex]
  const currentAction = step?.action ?? ''

  if (steps.length === 0) return null

  return (
    <div className="glass-panel space-y-4 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
        {t('shell.pseudocode')}
      </h3>
      <div className="grid gap-4 lg:grid-cols-2">
        {pseudocode.map((block) => (
          <div key={block.title}>
            <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t(block.title)}
            </p>
            <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-700/70 dark:bg-slate-950/60">
              {block.lines.map((line, idx) => {
                const active = line.actions.some((a) => currentAction.startsWith(a))
                return (
                  <div
                    key={`${block.title}-${idx}`}
                    className={[
                      'border-l-2 px-4 py-1.5 font-mono text-xs transition-colors',
                      active
                        ? 'border-algo-window bg-algo-window/15 text-slate-900 dark:bg-algo-window/20 dark:text-white'
                        : 'border-transparent text-slate-500 dark:text-slate-400',
                    ].join(' ')}
                    style={{ paddingLeft: `${1 + line.indent * 1.25}rem` }}
                  >
                    {line.line}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
