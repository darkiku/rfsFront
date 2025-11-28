import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { aboutAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function About() {
  const { section = 'GENERAL_INFO' } = useParams()
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)

  const sections = [
    { key: 'GENERAL_INFO', label: t('about.general') },
    { key: 'INFO_SECURITY', label: t('about.security') },
    { key: 'ANTI_CORRUPTION', label: t('about.anticorruption') },
    { key: 'LEGAL_ACTS', label: t('about.legal') }
  ]

  useEffect(() => {
    loadContent()
  }, [section])

  const loadContent = async () => {
    setLoading(true)
    try {
      const { data } = await aboutAPI.getBySection(section)
      setContent(data)
    } catch (error) {
      toast.error(t('common.error'))
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
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-8 text-center">{t('about.title')}</h1>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => navigate(`/about/${sec.key}`)}
              className={`px-6 py-3 rounded-lg font-bold ${
                section === sec.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border hover:bg-gray-100'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : content.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <p className="text-2xl text-gray-600">{t('about.notFound')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {content.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-8 shadow border"
              >
                <h2 className="text-2xl font-bold mb-4 pb-4 border-b">
                  {getLocalizedText(item, 'title')}
                </h2>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: getLocalizedText(item, 'content').replace(/\n/g, '<br />') 
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}