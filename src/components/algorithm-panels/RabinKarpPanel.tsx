import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useVisualizerStore } from '../../store/visualizerStore'
import { parseRkStepExtra, type RabinKarpStepExtra } from '../../types/rkExtra'
import type { VisualizerStep } from '../../types/visualizerStep'

/* ------------------------------------------------------------------ */
/*  Hash Comparison Bar                                                */
/* ------------------------------------------------------------------ */

function HashComparisonBar({
  rk,
  stepIndex,
}: {
  rk: RabinKarpStepExtra
  stepIndex: number
}) {
  const { t } = useTranslation()
  const patternHash = rk.patternHash
  const windowHash = rk.windowHash
  const hasWindow = windowHash !== null
  const match = hasWindow && rk.hashMatch
  const collision = !!rk.collision
  const confirmed =
    hasWindow && rk.hashMatch && !rk.verifying && !rk.collision &&
    rk.confirmedMatchStarts !== undefined && rk.confirmedMatchStarts.length > 0 &&
    rk.phase === 'verify'

  const maxVal = Math.max(patternHash, windowHash ?? 0, 1)
  const pBar = (patternHash / maxVal) * 100
  const wBar = hasWindow ? ((windowHash ?? 0) / maxVal) * 100 : 0

  let statusColor = 'bg-slate-400 dark:bg-slate-500'
  let statusText = t('panels.rabinKarp.different')
  let barBorder = 'border-slate-200/70 dark:border-slate-700'
  let glowClass = ''

  if (collision) {
    statusColor = 'bg-red-500'
    statusText = t('panels.rabinKarp.collision')
    barBorder = 'border-red-400/60 dark:border-red-500/50'
    glowClass = 'shadow-[0_0_12px_rgba(220,38,38,0.3)]'
  } else if (confirmed) {
    statusColor = 'bg-emerald-500'
    statusText = t('panels.rabinKarp.confirmed')
    barBorder = 'border-emerald-400/60 dark:border-emerald-500/50'
    glowClass = 'shadow-[0_0_12px_rgba(16,185,129,0.3)]'
  } else if (match) {
    statusColor = 'bg-amber-500'
    statusText = t('panels.rabinKarp.matchVerify')
    barBorder = 'border-amber-400/60 dark:border-amber-500/50'
    glowClass = 'shadow-[0_0_12px_rgba(202,138,4,0.25)]'
  }

  if (!hasWindow && rk.phase !== 'windows' && rk.phase !== 'verify') {
    return null
  }

  return (
    <div
      className={`rounded-xl border ${barBorder} bg-white/50 px-4 py-3 dark:bg-slate-950/50 transition-shadow duration-300 ${glowClass}`}
    >
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('panels.rabinKarp.hashComparison')}
        </span>
        {hasWindow && (
          <motion.span
            key={`status-${stepIndex}-${collision ? 'c' : match ? 'm' : 'n'}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${statusColor}`}
          >
            {statusText}
          </motion.span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-14 shrink-0 text-right text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            H(P)
          </span>
          <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-md bg-blue-500/70 dark:bg-blue-500/50"
              initial={false}
              animate={{ width: `${pBar}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            <span className="relative z-10 flex h-full items-center pl-2 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-100">
              {patternHash}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-14 shrink-0 text-right text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            H(win)
          </span>
          <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
            <AnimatePresence mode="wait">
              {hasWindow && (
                <motion.div
                  key={`wbar-${stepIndex}`}
                  className={`absolute inset-y-0 left-0 rounded-md ${
                    collision
                      ? 'bg-red-500/60'
                      : match
                        ? 'bg-amber-500/60 dark:bg-amber-500/45'
                        : 'bg-amber-400/50 dark:bg-amber-500/35'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${wBar}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10 flex h-full items-center pl-2 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-100">
              {hasWindow ? windowHash : '—'}
            </span>
          </div>
        </div>
      </div>

      {collision && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-red-500/40 pointer-events-none"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          key={`collision-flash-${stepIndex}`}
        />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Rolling Hash Formula                                               */
/* ------------------------------------------------------------------ */

function RollingHashFormula({
  rk,
  stepIndex,
}: {
  rk: RabinKarpStepExtra
  stepIndex: number
}) {
  const { t } = useTranslation()
  if (rk.prevHash === undefined || !rk.outChar || !rk.inChar) return null

  const { prevHash, outChar, inChar, base, mod, powHigh, windowHash } = rk
  const outCode = outChar.charCodeAt(0)
  const inCode = inChar.charCodeAt(0)

  const fadeIn = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  }

  return (
    <motion.div
      key={`formula-${stepIndex}`}
      className="rounded-xl border border-slate-200/70 bg-white/50 px-4 py-3.5 dark:border-slate-700 dark:bg-slate-950/50"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {t('panels.rabinKarp.rollingHashUpdate')}
      </p>

      <div className="space-y-2 font-mono text-sm leading-relaxed">
        {/* Generic formula */}
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          H<sub>new</sub> = (
          <span className="text-slate-700 dark:text-slate-200">(</span>
          H<sub>old</sub>{' '}
          <span className="text-red-500 font-bold">−</span>{' '}
          <span className="text-red-500">out</span> × B<sup>m−1</sup>
          <span className="text-slate-700 dark:text-slate-200">)</span>{' '}
          × B{' '}
          <span className="text-emerald-600 font-bold">+</span>{' '}
          <span className="text-emerald-600">in</span>
          ) mod M
        </p>

        {/* Substituted values */}
        <motion.div
          className="flex flex-wrap items-baseline gap-x-1 text-[13px] text-slate-800 dark:text-slate-100"
          {...fadeIn}
        >
          <span className="text-slate-500 dark:text-slate-400">=</span>
          <span className="text-slate-500 dark:text-slate-400">(</span>
          <span className="text-slate-500 dark:text-slate-400">(</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">{prevHash}</span>
          <span className="mx-0.5 font-bold text-red-500">−</span>
          <span className="inline-flex items-center gap-0.5">
            <motion.span
              className="rounded bg-red-100 px-1 py-0.5 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-bold"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {outCode}
              <span className="ml-0.5 text-[10px] font-normal opacity-70">'{outChar}'</span>
            </motion.span>
          </span>
          <span className="mx-0.5">×</span>
          <span>{powHigh}</span>
          <span className="text-slate-500 dark:text-slate-400">)</span>
          <span className="mx-0.5">×</span>
          <span>{base}</span>
          <span className="mx-0.5 font-bold text-emerald-600">+</span>
          <span className="inline-flex items-center gap-0.5">
            <motion.span
              className="rounded bg-emerald-100 px-1 py-0.5 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {inCode}
              <span className="ml-0.5 text-[10px] font-normal opacity-70">'{inChar}'</span>
            </motion.span>
          </span>
          <span className="text-slate-500 dark:text-slate-400">)</span>
          <span className="mx-0.5 text-slate-500 dark:text-slate-400">mod</span>
          <span>{mod}</span>
        </motion.div>

        {/* Result */}
        <motion.div
          className="flex items-baseline gap-1.5 text-[13px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <span className="text-slate-500 dark:text-slate-400">=</span>
          <motion.span
            className="rounded-md bg-amber-100 px-2 py-0.5 text-base font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          >
            {windowHash}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Hash History Timeline                                              */
/* ------------------------------------------------------------------ */

type HashPoint = {
  pos: number
  hash: number
  kind: 'normal' | 'candidate' | 'confirmed' | 'collision'
}

function collectHashHistory(
  steps: VisualizerStep[],
  upTo: number,
): HashPoint[] {
  const map = new Map<number, HashPoint>()

  for (let i = 0; i <= upTo && i < steps.length; i++) {
    const s = steps[i]
    const rk = parseRkStepExtra(s.extraData as Record<string, unknown> | undefined)
    if (!rk || rk.windowHash === null) continue

    const pos = s.windowStart

    if (s.action === 'rk:window-hash') {
      if (!map.has(pos)) {
        map.set(pos, {
          pos,
          hash: rk.windowHash,
          kind: rk.hashMatch ? 'candidate' : 'normal',
        })
      }
    } else if (s.action === 'rk:confirmed') {
      const existing = map.get(pos)
      if (existing) existing.kind = 'confirmed'
    } else if (s.action === 'rk:collision') {
      const existing = map.get(pos)
      if (existing) existing.kind = 'collision'
    }
  }

  return [...map.values()].sort((a, b) => a.pos - b.pos)
}

const KIND_COLORS: Record<HashPoint['kind'], { fill: string }> = {
  normal:    { fill: '#94a3b8' },
  candidate: { fill: '#ca8a04' },
  confirmed: { fill: '#16a34a' },
  collision: { fill: '#dc2626' },
}

function HashHistoryTimeline({
  steps,
  currentStepIndex,
  patternHash,
  mod,
  currentWindowStart,
}: {
  steps: VisualizerStep[]
  currentStepIndex: number
  patternHash: number
  mod: number
  currentWindowStart: number
}) {
  const { t } = useTranslation()
  const points = useMemo(
    () => collectHashHistory(steps, currentStepIndex),
    [steps, currentStepIndex],
  )

  const maxHash = mod - 1
  const gridLines = useMemo(() => {
    const step = maxHash <= 100 ? 20 : maxHash <= 500 ? 100 : maxHash <= 2000 ? 200 : 500
    const lines: number[] = []
    for (let v = step; v < maxHash; v += step) lines.push(v)
    return lines
  }, [maxHash])

  if (points.length < 2) return null

  const W = 520
  const H = 180
  const padX = 28
  const padTop = 24
  const padBot = 28
  const chartW = W - padX * 2
  const chartH = H - padTop - padBot

  const maxPos = points[points.length - 1].pos
  const minPos = points[0].pos
  const posRange = maxPos - minPos || 1

  const px = (pos: number) => padX + ((pos - minPos) / posRange) * chartW
  const py = (hash: number) => padTop + chartH - (hash / maxHash) * chartH

  const patY = py(patternHash)

  const areaPath =
    points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.pos).toFixed(2)},${py(p.hash).toFixed(2)}`)
      .join(' ') +
    ` L ${px(points[points.length - 1].pos).toFixed(2)},${padTop + chartH}` +
    ` L ${px(points[0].pos).toFixed(2)},${padTop + chartH} Z`

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.pos).toFixed(2)},${py(p.hash).toFixed(2)}`)
    .join(' ')

  return (
    <div className="rounded-xl border border-slate-200/70 bg-gradient-to-b from-white/60 to-slate-50/40 dark:border-slate-700 dark:from-slate-950/60 dark:to-slate-900/40 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('panels.rabinKarp.hashHistory')}
        </span>
        <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500 ring-2 ring-amber-500/30" /> {t('panels.rabinKarp.candidate')}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" /> {t('panels.rabinKarp.confirmedLegend')}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500 ring-2 ring-red-500/30" /> {t('panels.rabinKarp.collisionLegend')}
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="rk-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="rk-line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>

        {/* Horizontal grid */}
        {gridLines.map((v) => {
          const gy = py(v)
          return (
            <g key={`rkg-${v}`}>
              <line
                x1={padX}
                x2={W - padX}
                y1={gy}
                y2={gy}
                stroke="#94a3b8"
                strokeWidth={0.5}
                opacity={0.1}
              />
              <text
                x={padX - 4}
                y={gy + 3}
                textAnchor="end"
                style={{ fontSize: 8, fontFamily: 'ui-monospace, monospace' }}
                className="fill-slate-400/50 dark:fill-slate-600"
              >
                {v}
              </text>
            </g>
          )
        })}

        {/* Position labels along bottom */}
        {points.map((p) => (
          <text
            key={`pos-${p.pos}`}
            x={px(p.pos)}
            y={H - 6}
            textAnchor="middle"
            style={{ fontSize: 8, fontFamily: 'ui-monospace, monospace' }}
            className={
              p.pos === currentWindowStart
                ? 'fill-slate-700 dark:fill-slate-200'
                : 'fill-slate-400/60 dark:fill-slate-600'
            }
            fontWeight={p.pos === currentWindowStart ? 700 : 400}
          >
            {p.pos}
          </text>
        ))}

        {/* Area fill under the line */}
        <path d={areaPath} fill="url(#rk-area-grad)" />

        {/* Pattern hash reference line */}
        <line
          x1={padX}
          x2={W - padX}
          y1={patY}
          y2={patY}
          stroke="#2563eb"
          strokeWidth={1}
          strokeDasharray="6,4"
          opacity={0.4}
        />
        <g>
          <rect
            x={W - padX - 68}
            y={patY - 14}
            width={66}
            height={16}
            rx={4}
            fill="#2563eb"
            opacity={0.12}
          />
          <text
            x={W - padX - 35}
            y={patY - 3}
            textAnchor="middle"
            style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}
            className="fill-blue-500 dark:fill-blue-400"
          >
            H(P) = {patternHash}
          </text>
        </g>

        {/* Connecting line */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#rk-line-grad)"
          strokeWidth={2}
          opacity={0.4}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dots */}
        {points.map((p) => {
          const isCurrent = p.pos === currentWindowStart
          const kc = KIND_COLORS[p.kind]
          const cx = px(p.pos)
          const cy = py(p.hash)
          const r = isCurrent ? 7 : p.kind === 'normal' ? 4 : 5

          return (
            <g key={p.pos}>
              {/* Vertical drop line */}
              <line
                x1={cx}
                x2={cx}
                y1={cy + r}
                y2={padTop + chartH}
                stroke={kc.fill}
                strokeWidth={isCurrent ? 1.5 : 0.8}
                opacity={isCurrent ? 0.2 : 0.08}
                strokeDasharray={isCurrent ? 'none' : '2,3'}
              />

              {/* Outer glow for current */}
              {isCurrent && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={14}
                  fill={kc.fill}
                  opacity={0.1}
                />
              )}

              {/* Dot */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={kc.fill}
                stroke={isCurrent ? '#fff' : kc.fill}
                strokeWidth={isCurrent ? 2 : 1}
                strokeOpacity={isCurrent ? 0.9 : 0.3}
                opacity={isCurrent ? 1 : 0.85}
              />

              {/* Inner highlight */}
              {r > 4 && (
                <circle
                  cx={cx - r * 0.2}
                  cy={cy - r * 0.2}
                  r={r * 0.3}
                  fill="#fff"
                  opacity={0.35}
                />
              )}

              {/* Tooltip badge for current */}
              {isCurrent && (
                <g>
                  <rect
                    x={cx - 16}
                    y={cy - r - 20}
                    width={32}
                    height={16}
                    rx={5}
                    fill={kc.fill}
                    opacity={0.9}
                  />
                  <polygon
                    points={`${cx - 3},${cy - r - 4} ${cx + 3},${cy - r - 4} ${cx},${cy - r - 1}`}
                    fill={kc.fill}
                    opacity={0.9}
                  />
                  <text
                    x={cx}
                    y={cy - r - 8.5}
                    textAnchor="middle"
                    style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}
                    fill="#fff"
                  >
                    {p.hash}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main panel                                                         */
/* ------------------------------------------------------------------ */

export function RabinKarpPanel() {
  const { t } = useTranslation()
  const pattern = useVisualizerStore((s) => s.pattern)
  const steps = useVisualizerStore((s) => s.steps)
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex)
  const step = steps[currentStepIndex]
  const rk = parseRkStepExtra(step?.extraData as Record<string, unknown> | undefined)

  if (!rk || pattern.length === 0) {
    return null
  }

  const isRolling = step.action === 'rk:roll'
  const showTimeline =
    rk.phase === 'windows' || rk.phase === 'verify' || rk.phase === 'done'
  const confirmedStarts = rk.confirmedMatchStarts ?? []

  return (
    <div className="glass-panel space-y-4 p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          {t('panels.rabinKarp.hashes')}
        </h3>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t('panels.phase')}: <span className="text-slate-800 dark:text-slate-200">{rk.phase}</span>
        </span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200/70 bg-white/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/50">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('panels.rabinKarp.baseModulus')}
          </dt>
          <dd className="mt-1 font-mono text-slate-900 dark:text-slate-100">
            {rk.base}, {rk.mod}
          </dd>
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-white/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/50">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            B^(m−1) mod M
          </dt>
          <dd className="mt-1 font-mono text-slate-900 dark:text-slate-100">{rk.powHigh}</dd>
        </div>
        <div className="rounded-xl border border-algo-window/30 bg-algo-window/10 px-4 py-3 dark:border-algo-window/40 dark:bg-algo-window/15">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            {t('panels.rabinKarp.patternHash')}
          </dt>
          <dd className="mt-1 font-mono text-lg font-semibold text-slate-900 dark:text-white">
            {rk.patternHash}
          </dd>
        </div>
        <div className="rounded-xl border border-algo-hash/40 bg-algo-hash/10 px-4 py-3 dark:border-algo-hash/50 dark:bg-algo-hash/15">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            {t('panels.rabinKarp.windowHash')}
          </dt>
          <dd className="mt-1 font-mono text-lg font-semibold text-slate-900 dark:text-white">
            {rk.windowHash === null ? '—' : rk.windowHash}
          </dd>
        </div>
      </dl>

      {/* Hash Comparison Bar */}
      <HashComparisonBar rk={rk} stepIndex={currentStepIndex} />

      {rk.phase === 'done' && (
        <div className="rounded-xl border border-emerald-300/50 bg-emerald-50/50 px-4 py-3 dark:border-emerald-700/50 dark:bg-emerald-950/30">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            {t('panels.rabinKarp.result')}
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {confirmedStarts.length > 0
              ? t('panels.rabinKarp.resultMatches', { starts: confirmedStarts.join(', ') })
              : t('panels.rabinKarp.resultNoMatches')}
          </p>
        </div>
      )}

      {/* Hash History Timeline */}
      {showTimeline && (
        <HashHistoryTimeline
          steps={steps}
          currentStepIndex={currentStepIndex}
          patternHash={rk.patternHash}
          mod={rk.mod}
          currentWindowStart={step.windowStart}
        />
      )}

      {/* Rolling Hash Formula (visible only during rk:roll steps) */}
      <AnimatePresence mode="wait">
        {isRolling && (
          <RollingHashFormula rk={rk} stepIndex={currentStepIndex} />
        )}
      </AnimatePresence>

      <div className="rounded-xl border border-slate-200/70 bg-white/50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50">
        {rk.collision ? (
          <p className="font-medium text-algo-mismatch dark:text-red-300">
            {t('panels.rabinKarp.collisionMessage')}
          </p>
        ) : rk.verifying && rk.verifyIndex !== undefined ? (
          <p className="text-slate-700 dark:text-slate-200">
            {t('panels.rabinKarp.verifyingCharacter', { index: rk.verifyIndex })}
          </p>
        ) : rk.hashMatch && !rk.verifying ? (
          <p className="text-slate-700 dark:text-amber-200">
            {t('panels.rabinKarp.candidateMessage')}
          </p>
        ) : rk.phase === 'windows' && step.action === 'rk:roll' ? (
          <p className="text-slate-700 dark:text-slate-200">
            {t('panels.rabinKarp.rollingUpdated')}
          </p>
        ) : (
          <p className="text-slate-600 dark:text-slate-300">
            {rk.confirmedMatchStarts && rk.confirmedMatchStarts.length > 0
              ? t('panels.rabinKarp.confirmedMatches', { starts: rk.confirmedMatchStarts.join(', ') })
              : t('panels.rabinKarp.defaultHint')}
          </p>
        )}
      </div>
    </div>
  )
}
