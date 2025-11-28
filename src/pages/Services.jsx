import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { servicesAPI } from '../services/api'
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Services() {
  const { t, i18n } = useTranslation()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const { data } = await servicesAPI.getAll()
      setServices(data)
    } catch (error) {
      toast.error(t('common.error'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getLocalizedText = (item, field) => {
    const lang = i18n.language
    if (lang === 'kk') return item[`${field}Kk`] || item[`${field}Ru`]
    if (lang === 'en') return item[`${field}En`] || item[`${field}Ru`]
    return item[`${field}Ru`]
  }

  return (
    <div className="py-16 animate-fade-in">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('services.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.a
                key={service.id}
                href={service.link || '#'}
                target={service.link ? '_blank' : '_self'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-2xl p-8 hover:shadow-2xl transition-all group"
              >
                {service.iconUrl ? (
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <img src={service.iconUrl} alt="" className="w-12 h-12" />
                  </div>
                ) : (
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ExternalLink className="w-10 h-10 text-white" />
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-primary-500 transition-colors">
                  {getLocalizedText(service, 'title')}
                </h3>
                
                <p className="text-gray-600 text-center">
                  {getLocalizedText(service, 'description')}
                </p>

                {service.link && (
                  <div className="mt-6 flex items-center justify-center text-primary-500 font-semibold">
                    <span>{t('services.goTo')}</span>
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}