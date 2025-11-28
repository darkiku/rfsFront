import { useState, useEffect } from 'react'
import { newsAPI } from '../../services/api'
import toast from 'react-hot-toast'
import Modal from '../../components/Modal'
import NewsCard from '../../components/NewsCard'

export default function NewsManager() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [formData, setFormData] = useState({
    titleRu: '',
    titleKk: '',
    titleEn: '',
    contentRu: '',
    contentKk: '',
    contentEn: '',
    shortDescriptionRu: '',
    shortDescriptionKk: '',
    shortDescriptionEn: '',
    imageUrl: '',
    author: ''
  })

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const { data } = await newsAPI.getAll(0, 50)
      setNews(data.content || data)
    } catch (error) {
      toast.error('Ошибка загрузки новостей')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingNews) {
        await newsAPI.update(editingNews.id, formData)
        toast.success('Новость обновлена')
      } else {
        await newsAPI.create(formData)
        toast.success('Новость создана')
      }
      setIsModalOpen(false)
      setEditingNews(null)
      resetForm()
      fetchNews()
    } catch (error) {
      toast.error('Ошибка сохранения')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить новость?')) return
    try {
      await newsAPI.delete(id)
      toast.success('Новость удалена')
      fetchNews()
    } catch (error) {
      toast.error('Ошибка удаления')
    }
  }

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem)
    setFormData({
      titleRu: newsItem.titleRu || '',
      titleKk: newsItem.titleKk || '',
      titleEn: newsItem.titleEn || '',
      contentRu: newsItem.contentRu || '',
      contentKk: newsItem.contentKk || '',
      contentEn: newsItem.contentEn || '',
      shortDescriptionRu: newsItem.shortDescriptionRu || '',
      shortDescriptionKk: newsItem.shortDescriptionKk || '',
      shortDescriptionEn: newsItem.shortDescriptionEn || '',
      imageUrl: newsItem.imageUrl || '',
      author: newsItem.author || ''
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      titleRu: '',
      titleKk: '',
      titleEn: '',
      contentRu: '',
      contentKk: '',
      contentEn: '',
      shortDescriptionRu: '',
      shortDescriptionKk: '',
      shortDescriptionEn: '',
      imageUrl: '',
      author: ''
    })
  }

  if (loading) return <div className="p-8">Загрузка...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управление новостями</h1>
        <button
          onClick={() => {
            setEditingNews(null)
            resetForm()
            setIsModalOpen(true)
          }}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Добавить новость
        </button>
      </div>

      <div className="grid gap-4">
        {news.map(item => (
          <NewsCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingNews(null)
            resetForm()
          }}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          editingNews={editingNews}
        />
      )}
    </div>
  )
}