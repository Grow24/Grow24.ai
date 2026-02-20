import React, { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = '404 Not Found | Grow24.ai'
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <h1 className="text-6xl sm:text-8xl font-bold text-slate-300 dark:text-slate-600 mb-2">
        404
      </h1>
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
        Page not found
      </h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors"
      >
        Back to home
      </Link>
    </motion.div>
  )
}

export default NotFoundPage
