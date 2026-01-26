import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import SolutionsMatrix from '../components/SolutionsMatrix'
import ResourceHub from '../components/ResourceHub'
import { useComingSoon } from '../contexts/ComingSoonContext'

export const Route = createFileRoute('/')({  
  component: IndexPage,
})

function IndexPage() {
  const { showComingSoon } = useComingSoon()
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center pt-20 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6 md:px-8"
      >
        <div className="w-full max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6"
          >
            <span className="text-gradient">
              Grow Your Potential
            </span>
            <br />
            <span className="text-slate-600 dark:text-slate-400">with Grow24.ai</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6 sm:mb-8 px-4"
          >
            A comprehensive Personal & Business Management Platform that guides you through the
            PBMP cycle for extraordinary growth and transformation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center flex-wrap px-4"
          >
            <motion.button
              onClick={() => showComingSoon('start-free-trial', 'Start Your Free Trial', 'Get started with Grow24.ai today! Enter your email to begin your free trial and start transforming your growth journey.')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm sm:text-base font-bold hover:shadow-xl transition-shadow duration-300"
            >
              Start Free Trial
            </motion.button>
            <motion.button
              onClick={() => showComingSoon('watch-demo', 'Watch Demo', 'Enter your email to get notified when the demo is available and receive exclusive updates.')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-emerald-500 text-emerald-600 text-sm sm:text-base font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors duration-300"
            >
              Watch Demo
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Our offerings Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 px-8 bg-gradient-to-b from-transparent via-emerald-50/20 to-transparent"
      >
        <div className="w-full max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            Transform Through the PBMP Cycle
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
            Our proven Plan-Build-Measure-Progress methodology guides you through personal and professional growth with measurable results.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12">
            {['Plan', 'Build', 'Measure', 'Progress'].map((phase, idx) => (
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 group cursor-pointer"
              >
                <div className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">{idx + 1}</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">{phase}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {phase === 'Plan' && 'Set clear objectives and strategies'}
                  {phase === 'Build' && 'Execute with proven frameworks'}
                  {phase === 'Measure' && 'Track progress with analytics'}
                  {phase === 'Progress' && 'Iterate and scale continuously'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Solutions Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 px-8"
      >
        <div className="w-full mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            Solutions Across Your Enterprise
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive tools organized by strategic focus area—from vision to operations.
          </p>
        </div>
        <SolutionsMatrix />
      </motion.section>

      {/* Resource Hub Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 px-8 bg-gradient-to-b from-transparent via-slate-50/50 dark:via-slate-900/50 to-transparent"
      >
        <div className="w-full mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            Learn & Engage
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Curated resources tailored to your role, interests, and journey stage.
          </p>
        </div>
        <ResourceHub />
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 px-8 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800"
      >
        <div className="w-full max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            Ready to Transform?
          </h2>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
            Join thousands of professionals and entrepreneurs using Grow24.ai to achieve their goals.
          </p>
          <motion.button
            onClick={() => showComingSoon('cta-section', 'Get Started', 'Enter your email to stay updated on our latest features and product updates.')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            Get Started Now
          </motion.button>
        </div>
      </motion.section>
    </div>
  )
}

export default IndexPage
