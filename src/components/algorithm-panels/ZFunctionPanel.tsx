import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useVisualizerStore } from '../../store/visualizerStore'
import { parseZStepExtra, type ZStepExtra } from '../../types/zExtra'

/* ------------------------------------------------------------------ */
/*  Z-Array Bar Chart with Z-box overlay + prefix mirror              */
/* ------------------------------------------------------------------ */

type BarKind = 'default' | 'current' | 'zbox' | 'prefix-a' | 'prefix-b'

const GRAD: Record<BarKind, [string, string]> = {
  default:    ['#cbd5e1', '#94a3b8'],
  current:    ['#a78bfa', '#7c3aed'],
  zbox:       ['#c084fc', '#9333ea'],
  'prefix-a': ['#60a5fa', '#2563eb'],
  'prefix-b': ['#34d399', '#059669'],
}

function ZArrayBarChart({ z }: { z: ZStepExtra }) {
  const { t } = useTranslation()
  const n = z.zValues.length
  const maxZ = useMemo(() => Math.max(1, ...z.zValues), [z.zValues])

  if (n === 0) return null

  const PAD_X = 16
  const PAD_TOP = 28
  const PAD_BOT = 26
  const H = 180
  const chartH = H - PAD_TOP - PAD_BOT
  const baselineY = H - PAD_BOT

  const cellW = Math.max(18, Math.min(32, 520 / n))
  const gapW = Math.max(3, cellW * 0.2)
  const barW = cellW - gapW
  const W = Math.max(320, PAD_X * 2 + n * cellW)

  const bx = (i: number) => PAD_X + i * cellW + gapW / 2
  const barH = (v: number) => (v > 0 ? Math.max(6, (v / maxZ) * chartH) : 0)

  const curI = z.currentI
  const curZ = z.zValues[curI] || 0
  const isDone = z.phase === 'done'
  // Only treat the Z-box as active while the loop index is still inside it
  // (and the algorithm is still iterating). After i drifts past R the box
  // is stale for the current iteration, and on the terminal `done` frame
  // there is no active iteration at all — the bar chart should read as a
  // clean histogram of the final Z-array.
  const hasBox = !isDone && z.R >= z.L && curI <= z.R
  const hasCmp = !isDone && z.comparePair !== undefined
  const showCopy =
    !isDone &&
    (z.phase === 'copy-value' || z.phase === 'inside-box') &&
    z.k !== undefined && curZ > 0

  function barKind(idx: number): BarKind {
    if (!isDone && idx === curI) return 'current'
    if ((hasCmp || showCopy) && curZ > 0) {
      if (idx >= 0 && idx < curZ) return 'prefix-a'
      if (idx > curI && idx < curI + curZ) return 'prefix-b'
    }
    if (hasBox && idx >= z.L && idx <= z.R) return 'zbox'
    return 'default'
  }

  const gridLines = useMemo(() => {
    if (maxZ <= 1) return [1]
    const step = maxZ <= 5 ? 1 : maxZ <= 15 ? 2 : maxZ <= 30 ? 5 : 10
    const lines: number[] = []
    for (let v = step; v <= maxZ; v += step) lines.push(v)
    return lines
  }, [maxZ])

  return (
    <div className="rounded-xl border border-slate-200/70 bg-gradient-to-b from-white/60 to-slate-50/40 dark:border-slate-700 dark:from-slate-950/60 dark:to-slate-900/40 overflow-x-auto">
      {/* Header */}
      <div className="px-4 pt-3 pb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('panels.zFunction.chart')}
        </span>
        <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
          {!isDone && (
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-violet-500 ring-2 ring-violet-500/30" /> {t('panels.zFunction.currentI')}
            </span>
          )}
          {hasBox && (
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-sm bg-purple-500/50 ring-1 ring-purple-400/40" /> {t('panels.zFunction.zBox')}
            </span>
          )}
          {(hasCmp || showCopy) && curZ > 0 && (
            <>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500" /> {t('panels.zFunction.prefix')}
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> {t('panels.zFunction.mirror')}
              </span>
            </>
          )}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: Math.min(W, 320) }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {Object.entries(GRAD).map(([kind, [top, bot]]) => (
            <linearGradient key={kind} id={`zbar-${kind}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={top} />
              <stop offset="100%" stopColor={bot} />
            </linearGradient>
          ))}
        </defs>

        {/* Horizontal grid lines */}
        {gridLines.map((v) => {
          const gy = baselineY - (v / maxZ) * chartH
          return (
            <g key={`g-${v}`}>
              <line
                x1={PAD_X - 4}
                x2={W - PAD_X + 4}
                y1={gy}
                y2={gy}
                stroke="#94a3b8"
                strokeWidth={0.5}
                opacity={0.12}
              />
              <text
                x={PAD_X - 6}
                y={gy + 3}
                textAnchor="end"
                style={{ fontSize: 8, fontFamily: 'ui-monospace, monospace' }}
                className="fill-slate-400/60 dark:fill-slate-600"
              >
                {v}
              </text>
            </g>
          )
        })}

        {/* Z-box band */}
        {hasBox && (
          <rect
            x={bx(z.L) - gapW / 2}
            y={PAD_TOP - 6}
            width={bx(z.R) + barW + gapW / 2 - bx(z.L) + gapW / 2}
            height={chartH + 12}
            rx={6}
            fill="#9333ea"
            opacity={0.06}
            stroke="#9333ea"
            strokeWidth={1.2}
            strokeOpacity={0.2}
            strokeDasharray="6,4"
          />
        )}

        {/* Bars */}
        {z.zValues.map((v, idx) => {
          const kind = barKind(idx)
          const bh = barH(v)
          const x = bx(idx)
          const y = baselineY - bh
          const isCur = kind === 'current'

          return (
            <g key={idx}>
              {/* Current-index glow pillar */}
              {isCur && (
                <motion.rect
                  x={x - 4}
                  y={PAD_TOP - 6}
                  width={barW + 8}
                  height={chartH + 12}
                  rx={6}
                  fill="#7c3aed"
                  initial={{ opacity: 0.12 }}
                  animate={{ opacity: [0.12, 0.04, 0.12] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {/* Bar */}
              {v > 0 ? (
                <motion.rect
                  x={x}
                  width={barW}
                  rx={barW > 10 ? 4 : 2}
                  fill={`url(#zbar-${kind})`}
                  opacity={isCur ? 1 : 0.75}
                  initial={{ height: 0, y: baselineY }}
                  animate={{ height: bh, y }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  filter={isCur ? 'drop-shadow(0 0 4px rgba(124,58,237,0.4))' : undefined}
                />
              ) : (
                <circle
                  cx={x + barW / 2}
                  cy={baselineY}
                  r={2}
                  fill={GRAD[kind][1]}
                  opacity={0.3}
                />
              )}

              {/* Value badge for current */}
              {isCur && v > 0 && (
                <g>
                  <rect
                    x={x + barW / 2 - 10}
                    y={y - 18}
                    width={20}
                    height={14}
                    rx={4}
                    fill="#7c3aed"
                    opacity={0.9}
                  />
                  <text
                    x={x + barW / 2}
                    y={y - 8}
                    textAnchor="middle"
                    style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}
                    fill="#fff"
                  >
                    {v}
                  </text>
                  <polygon
                    points={`${x + barW / 2 - 3},${y - 4} ${x + barW / 2 + 3},${y - 4} ${x + barW / 2},${y - 1}`}
                    fill="#7c3aed"
                    opacity={0.9}
                  />
                </g>
              )}

              {/* Value label (non-current) */}
              {!isCur && (
                <text
                  x={x + barW / 2}
                  y={v > 0 ? y - 4 : baselineY - 8}
                  textAnchor="middle"
                  style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}
                  className="fill-slate-500 dark:fill-slate-400"
                >
                  {v}
                </text>
              )}

              {/* Current zero badge */}
              {isCur && v === 0 && (
                <g>
                  <rect
                    x={x + barW / 2 - 10}
                    y={baselineY - 22}
                    width={20}
                    height={14}
                    rx={4}
                    fill="#7c3aed"
                    opacity={0.9}
                  />
                  <text
                    x={x + barW / 2}
                    y={baselineY - 12}
                    textAnchor="middle"
                    style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}
                    fill="#fff"
                  >
                    0
                  </text>
                  <polygon
                    points={`${x + barW / 2 - 3},${baselineY - 8} ${x + barW / 2 + 3},${baselineY - 8} ${x + barW / 2},${baselineY - 5}`}
                    fill="#7c3aed"
                    opacity={0.9}
                  />
                </g>
              )}

              {/* Index label */}
              <text
                x={x + barW / 2}
                y={baselineY + 14}
                textAnchor="middle"
                style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace' }}
                className={
                  isCur
                    ? 'fill-violet-500 dark:fill-violet-400'
                    : 'fill-slate-400 dark:fill-slate-500'
                }
                fontWeight={isCur ? 700 : 400}
              >
                {idx}
              </text>
            </g>
          )
        })}

        {/* Baseline */}
        <line
          x1={PAD_X - 4}
          x2={W - PAD_X + 4}
          y1={baselineY}
          y2={baselineY}
          stroke="#94a3b8"
          strokeWidth={0.8}
          opacity={0.25}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main panel                                                         */
/* ------------------------------------------------------------------ */

export function ZFunctionPanel() {
  const { t } = useTranslation()
  const steps = useVisualizerStore((s) => s.steps)
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex)
  const step = steps[currentStepIndex]
  const z = parseZStepExtra(step?.extraData as Record<string, unknown> | undefined)

  if (!z || z.zValues.length === 0) {
    return null
  }

  const isDone = z.phase === 'done'
  const boxLabel =
    !isDone && z.R >= z.L && z.currentI <= z.R ? `[${z.L}, ${z.R}]` : '∅'

  return (
    <div className="glass-panel space-y-4 p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          {t('panels.zFunction.panelTitle')}
        </h3>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t('panels.phase')}: <span className="text-slate-800 dark:text-slate-200">{z.phase}</span>
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-algo-zbox/40 bg-algo-zbox/10 px-4 py-3 dark:border-algo-zbox/50 dark:bg-algo-zbox/15">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            {t('panels.zFunction.zBoxRange')}
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-slate-900 dark:text-white">{boxLabel}</p>
        </div>
        <div className="rounded-xl border border-violet-200/80 bg-violet-50/50 px-4 py-3 dark:border-violet-800/60 dark:bg-violet-950/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            {t('panels.zFunction.currentIndex')}
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-slate-900 dark:text-white">
            {isDone ? '—' : z.currentI}
          </p>
        </div>
        {(z.k !== undefined || z.beta !== undefined) && (
          <div className="rounded-xl border border-slate-200/70 bg-white/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">k · β</p>
            <p className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-100">
              {z.k !== undefined ? `k = ${z.k}` : '—'}
              {z.beta !== undefined ? ` · β = ${z.beta}` : ''}
            </p>
          </div>
        )}
      </div>

      {/* Final Z-array result */}
      {z.phase === 'done' && (
        <div className="rounded-xl border border-emerald-300/50 bg-emerald-50/50 px-4 py-3 dark:border-emerald-700/50 dark:bg-emerald-950/30">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            {t('panels.zFunction.result')}
          </p>
          <p className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
            [{z.zValues.join(', ')}]
          </p>
        </div>
      )}

      {/* Z-Array Bar Chart with Z-box overlay, copy arrow, and prefix/mirror highlighting */}
      <ZArrayBarChart z={z} />
    </div>
  )
}
