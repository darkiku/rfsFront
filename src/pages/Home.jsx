import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Radio, Shield, Zap, Globe, Calendar, Newspaper, Briefcase } from 'lucide-react'
import { newsAPI, servicesAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import HeroSection from '../components/HeroSection'

export default function Home() {
  const { t, i18n } = useTranslation()
  const [latestNews, setLatestNews] = useState([])
  const [latestVacancies, setLatestVacancies] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Загружаем новости типа NEWS
      const newsResponse = await newsAPI.getLatestByType('NEWS')
      setLatestNews(newsResponse.data)
      
      // Загружаем вакансии
      const vacanciesResponse = await newsAPI.getLatestByType('VACANCY')
      setLatestVacancies(vacanciesResponse.data)
      
      const servicesResponse = await servicesAPI.getAll()
      setServices(servicesResponse.data.slice(0, 6))
    } catch (error) {
      console.error('Error loading data:', error)
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
      { day: 'numeric', month: 'long', year: 'numeric' }
    )
  }

  if (loading) return <LoadingSpinner />

  const mainNews = latestNews[0]
  const sideNews = latestNews.slice(1, 4)
  const sideVacancies = latestVacancies.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Новый компонент */}
      <HeroSection />

      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-900">{t('home.news.title')}</h2>
          </div>

          {mainNews && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main News - Large */}
              <div className="lg:col-span-6">
                <Link
                  to={`/news/NEWS/${mainNews.id}`}
                  className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all group"
                >
                  {mainNews.imageUrl && (
                    <div className="h-80 overflow-hidden bg-gray-100">
                      <img
                        src={mainNews.imageUrl}
                        alt={getLocalizedText(mainNews, 'title')}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(mainNews.publishedDate)}
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 text-gray-900 group-hover:text-[#5865F2] transition-colors line-clamp-2">
                      {getLocalizedText(mainNews, 'title')}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 text-base">
                      {getLocalizedText(mainNews, 'shortDescription')}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Side News & Vacancies */}
              <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* News Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Newspaper className="w-5 h-5 text-[#5865F2]" />
                      {t('nav.news')}
                    </h3>
                    <Link
                      to="/news/NEWS"
                      className="text-[#5865F2] hover:text-[#4752d9] font-medium text-sm flex items-center gap-1"
                    >
                      {t('home.news.all')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  {sideNews.map((news) => (
                    <Link
                      key={news.id}
                      to={`/news/NEWS/${news.id}`}
                      className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-all group"
                    >
                      <div className="text-xs text-gray-500 mb-2 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(news.publishedDate)}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#5865F2] transition-colors line-clamp-2">
                        {getLocalizedText(news, 'title')}
                      </h4>
                    </Link>
                  ))}
                </div>

                {/* Vacancies Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-green-600" />
                      {t('nav.vacancies')}
                    </h3>
                    <Link
                      to="/news/VACANCY"
                      className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
                    >
                      {t('home.news.all')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  {sideVacancies.length > 0 ? (
                    sideVacancies.map((vacancy) => (
                      <Link
                        key={vacancy.id}
                        to={`/news/VACANCY/${vacancy.id}`}
                        className="block bg-green-50 hover:bg-green-100 rounded-lg p-4 transition-all group"
                      >
                        <div className="text-xs text-gray-500 mb-2 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(vacancy.publishedDate)}
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                          {getLocalizedText(vacancy, 'title')}
                        </h4>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-8">{t('vacancies.notFound')}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">{t('home.features.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <Radio className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{t('home.features.emc')}</h3>
              <p className="text-gray-600 text-sm">{t('home.features.item1.description')}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{t('home.features.quality')}</h3>
              <p className="text-gray-600 text-sm">{t('home.features.item2.description')}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{t('home.features.monitoring')}</h3>
              <p className="text-gray-600 text-sm">{t('home.features.item3.description')}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{t('home.features.space')}</h3>
              <p className="text-gray-600 text-sm">{t('home.features.item4.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      {services.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-900">{t('home.services.title')}</h2>
              <Link
                to="/services"
                className="text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-2"
              >
                {t('common.readMore')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  to="/services"
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-all group"
                >
                  <h3 className="text-lg font-semibold mb-3 text-primary-500 group-hover:text-primary-600 transition-colors">
                    {getLocalizedText(service, 'name')}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {getLocalizedText(service, 'description')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Activities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">{t('home.activities.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">{num}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-2 text-gray-900">
                      {t(`home.activities.item${num}.title`)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t(`home.activities.item${num}.desc`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}