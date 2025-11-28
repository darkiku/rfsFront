import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Eye } from 'lucide-react'
import { newsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function NewsDetail() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNews()
  }, [id])

  const loadNews = async () => {
    try {
      const { data } = await newsAPI.getById(id)
      setNews(data)
    } catch (error) {
      toast.error(t('news.errorLoading'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getLocalizedText = (field) => {
    if (!news) return ''
    const lang = i18n.language
    if (lang === 'kk') return news[`${field}Kk`] || news[`${field}Ru`]
    if (lang === 'en') return news[`${field}En`] || news[`${field}Ru`]
    return news[`${field}Ru`]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      i18n.language === 'kk' ? 'kk-KZ' : i18n.language === 'en' ? 'en-US' : 'ru-RU',
      { year: 'numeric', month: 'long', day: 'numeric' }
    )
  }

  if (loading) return <LoadingSpinner />

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-12"
        >
          <p className="text-2xl text-gray-600 mb-6 font-medium">{t('news.newsNotFound')}</p>
          <Link 
            to="/news" 
            className="inline-flex items-center text-primary-500 hover:text-primary-600 font-semibold text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('news.back')}
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="py-16 animate-fade-in bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/news"
          className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-8 font-semibold transition-all hover:translate-x-[-4px]"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('news.back')}
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden border-2 border-gray-100"
        >
          {news.imageUrl && (
            <div className="h-96 overflow-hidden">
              <img
                src={news.imageUrl}
                alt={getLocalizedText('title')}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6 pb-6 border-b-2 border-gray-100">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-blue-700 font-medium">
                  {formatDate(news.publishedDate)}
                </span>
              </div>
              {news.author && (
                <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                  <User className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-green-700 font-medium">{news.author}</span>
                </div>
              )}
              <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
                <Eye className="w-4 h-4 mr-2 text-purple-500" />
                <span className="text-purple-700 font-medium">
                  {news.viewCount || 0} {t('news.views')}
                </span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {getLocalizedText('title')}
            </h1>

            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: getLocalizedText('content').replace(/\n/g, '<br />') }}
            />
          </div>
        </motion.article>
      </div>
    </div>
  )
}