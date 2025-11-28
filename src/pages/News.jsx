import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Calendar, Newspaper, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'
import { newsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function News() {
  const { type = 'NEWS' } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const newsTypes = [
    { 
      key: 'NEWS', 
      label: i18n.language === 'ru' ? 'Новости' : i18n.language === 'kk' ? 'Жаңалықтар' : 'News',
      icon: Newspaper,
      color: 'blue'
    },
    { 
      key: 'VACANCY', 
      label: i18n.language === 'ru' ? 'Вакансии' : i18n.language === 'kk' ? 'Вакансиялар' : 'Vacancies',
      icon: Briefcase,
      color: 'green'
    }
  ]

  const currentType = newsTypes.find(t => t.key === type)

  useEffect(() => {
    loadNews()
  }, [currentPage, type])

  useEffect(() => {
    setCurrentPage(0)
    setSearchQuery('')
  }, [type])

  const loadNews = async () => {
    try {
      setLoading(true)
      const response = await newsAPI.getByType(type, currentPage, 12)
      
      setNews(response.data.content || response.data)
      setTotalPages(response.data.totalPages || 1)
    } catch (error) {
      toast.error(t('news.errorLoading'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      loadNews()
      return
    }

    try {
      setSearching(true)
      const response = await newsAPI.searchByType(searchQuery, type, 0, 12)
      
      setNews(response.data.content || response.data)
      setTotalPages(response.data.totalPages || 1)
      setCurrentPage(0)
    } catch (error) {
      toast.error(t('news.errorLoading'))
      console.error(error)
    } finally {
      setSearching(false)
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

  const getNewsTypeLabel = (newsType) => {
    return newsType === 'VACANCY' ? (
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
        <Briefcase className="w-3 h-3" />
        {i18n.language === 'ru' ? 'Вакансия' : i18n.language === 'kk' ? 'Вакансия' : 'Vacancy'}
      </span>
    ) : (
      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
        <Newspaper className="w-3 h-3" />
        {i18n.language === 'ru' ? 'Новость' : i18n.language === 'kk' ? 'Жаңалық' : 'News'}
      </span>
    )
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-semibold mb-8 text-gray-900">
          {type === 'VACANCY' ? t('nav.vacancies') : t('nav.news')}
        </h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={type === 'VACANCY' ? t('vacancies.search') : t('news.search')}
              className={`w-full px-6 py-4 pr-32 rounded-xl border-2 border-gray-200 focus:border-${currentType?.color}-500 focus:outline-none text-lg`}
            />
            <button
              type="submit"
              disabled={searching}
              className={`absolute right-2 top-2 px-6 py-2 bg-${currentType?.color}-600 text-white rounded-lg hover:bg-${currentType?.color}-700 transition-colors disabled:bg-gray-400 flex items-center gap-2`}
            >
              <Search className="w-5 h-5" />
              {searching ? t('news.searching') : t('news.searchBtn')}
            </button>
          </div>
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : news.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <p className="text-2xl text-gray-500">
              {type === 'VACANCY' ? t('vacancies.notFound') : t('news.notFound')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {news.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${type}/${item.id}`}
                  className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border-2 ${
                    type === 'VACANCY' ? 'border-green-100' : 'border-blue-100'
                  }`}
                >
                  {item.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={getLocalizedText(item, 'title')}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {getNewsTypeLabel(item.newsType)}
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(item.publishedDate)}
                      </div>
                    </div>
                    <h3 className={`text-xl font-bold mb-3 group-hover:text-${currentType?.color}-600 transition-colors line-clamp-2`}>
                      {getLocalizedText(item, 'title')}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {getLocalizedText(item, 'shortDescription')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : `bg-${currentType?.color}-600 text-white hover:bg-${currentType?.color}-700`
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  // Показываем только ближайшие страницы
                  if (
                    index === 0 ||
                    index === totalPages - 1 ||
                    (index >= currentPage - 1 && index <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          currentPage === index
                            ? `bg-${currentType?.color}-600 text-white`
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  } else if (index === currentPage - 2 || index === currentPage + 2) {
                    return <span key={index} className="px-2 text-gray-400">...</span>
                  }
                  return null
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === totalPages - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : `bg-${currentType?.color}-600 text-white hover:bg-${currentType?.color}-700`
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}