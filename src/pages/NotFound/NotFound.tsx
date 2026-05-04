import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function NotFound() {
  const { t } = useTranslation()

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-7xl font-bold text-slate-200 dark:text-slate-800">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{t('pages.notFound.title')}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        {t('pages.notFound.description')}
      </p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-algo-window px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-algo-window/25 transition hover:brightness-110"
      >
        {t('pages.notFound.backHome')}
      </Link>
    </motion.div>
  )
}
