import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const algorithms = [
  {
    nameKey: 'home.algorithms.kmp.name',
    path: '/kmp',
    blurbKey: 'home.algorithms.kmp.blurb',
    accent: 'border-algo-window',
  },
  {
    nameKey: 'home.algorithms.rabinKarp.name',
    path: '/rabin-karp',
    blurbKey: 'home.algorithms.rabinKarp.blurb',
    accent: 'border-algo-hash',
  },
  {
    nameKey: 'home.algorithms.zFunction.name',
    path: '/z-function',
    blurbKey: 'home.algorithms.zFunction.blurb',
    accent: 'border-algo-zbox',
  },
] as const

const theoryPoints = [
  {
    titleKey: 'home.theoryPoints.visualize.title',
    bodyKey: 'home.theoryPoints.visualize.body',
  },
  {
    titleKey: 'home.theoryPoints.defend.title',
    bodyKey: 'home.theoryPoints.defend.body',
  },
  {
    titleKey: 'home.theoryPoints.built.title',
    bodyKey: 'home.theoryPoints.built.body',
  },
] as const

export function Home() {
  const { t } = useTranslation()

  return (
    <div className="space-y-16">
      <section className="glass-panel relative overflow-hidden px-8 py-12 sm:px-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-algo-window/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-algo-zbox/15 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative max-w-3xl space-y-6"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-algo-window dark:text-algo-window">
            {t('app.diplomaProject')}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {t('home.hero.description')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/kmp"
              className="inline-flex items-center justify-center rounded-xl bg-algo-window px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-algo-window/25 transition hover:brightness-110"
            >
              {t('home.hero.cta')}
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('home.exploreTitle')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('home.exploreDescription')}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {algorithms.map((a, i) => (
            <motion.article
              key={a.path}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
              className={`glass-panel flex flex-col border-l-4 ${a.accent} p-6`}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t(a.nameKey)}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {t(a.blurbKey)}
              </p>
              <Link
                to={a.path}
                className="mt-5 inline-flex text-sm font-semibold text-algo-window hover:underline dark:text-blue-300"
              >
                {t('home.openPage')} →
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="glass-panel space-y-5 p-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('home.theoryPreview')}</h2>
        <ul className="space-y-4">
          {theoryPoints.map((item) => (
            <li key={item.titleKey}>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{t(item.titleKey)}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t(item.bodyKey)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
