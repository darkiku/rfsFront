import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronRight, Briefcase, Info } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative bg-[#5865F2] text-white overflow-hidden">
      {/* Минимальный декор */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {t('common.siteName')}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl">
              {t('home.heroSubtitle') || 'Министерство цифрового развития, инноваций и аэрокосмической промышленности Республики Казахстан'}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 bg-white text-[#5865F2] px-6 py-3 rounded-lg font-semibold hover:bg-white/95 transition-all shadow-lg"
              >
                <Briefcase className="w-5 h-5" />
                <span>{t('nav.services') || 'Наши сервисы'}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/about/GENERAL_INFO"
                className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all border-2 border-white/30"
              >
                <Info className="w-5 h-5" />
                <span>{t('nav.about') || 'О предприятии'}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}