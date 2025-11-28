import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FileText, Calendar, Download, Filter } from 'lucide-react'
import { procurementsAPI } from '../services/api'
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Procurements() {
  const { t, i18n } = useTranslation()
  const [procurements, setProcurements] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedType, setSelectedType] = useState('all')

  const years = [2025, 2024, 2023, 2022, 2021, 2020]
  const types = [
    { value: 'all', label: t('procurements.types.all') },
    { value: 'ANNUAL_PLAN', label: t('procurements.types.annualPlan') },
    { value: 'ANNOUNCEMENT', label: t('procurements.types.announcement') },
    { value: 'REGULATION', label: t('procurements.types.regulation') }
  ]

  useEffect(() => {
    loadProcurements()
  }, [selectedYear, selectedType])

  const loadProcurements = async () => {
    setLoading(true)
    try {
      const { data } = selectedType === 'all'
        ? await procurementsAPI.getByYear(selectedYear)
        : await procurementsAPI.getByYear(selectedYear)
      
      setProcurements(data)
    } catch (error) {
      toast.error(t('procurements.errorLoading'))
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      i18n.language === 'kk' ? 'kk-KZ' : i18n.language === 'en' ? 'en-US' : 'ru-RU',
      { year: 'numeric', month: 'long', day: 'numeric' }
    )
  }

  return (
    <div className="py-16 animate-fade-in bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('procurements.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('procurements.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('procurements.year')}
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-6 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all bg-white shadow-sm hover:shadow-md font-medium"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('procurements.type')}
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-6 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all bg-white shadow-sm hover:shadow-md font-medium"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : procurements.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 glass rounded-2xl"
          >
            <FileText className="w-20 h-20 mx-auto text-gray-400 mb-4" />
            <p className="text-2xl text-gray-600 font-medium">{t('procurements.notFound')}</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {procurements.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass rounded-2xl p-6 hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-primary-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-500 transition-colors">
                      {getLocalizedText(item, 'title')}
                    </h3>
                    
                    {item.descriptionRu && (
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {getLocalizedText(item, 'description')}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm">
                      {item.publishDate && (
                        <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-blue-700">
                            <span className="font-semibold">{t('procurements.published')}:</span> {formatDate(item.publishDate)}
                          </span>
                        </div>
                      )}
                      {item.deadline && (
                        <div className="flex items-center bg-orange-50 px-4 py-2 rounded-lg">
                          <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-orange-700">
                            <span className="font-semibold">{t('procurements.deadline')}:</span> {formatDate(item.deadline)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {item.documentUrl && (
                    <a
                      href={item.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {t('procurements.download')}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}