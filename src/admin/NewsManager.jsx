import { useState, useEffect } from 'react'
import { newsAPI, uploadAPI } from '../services/api'
import { Plus, Edit, Trash2, Upload, X, Newspaper, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Расширенная конфигурация Quill (как в гос. компаниях)
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
}

const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script', 'list', 'bullet', 'indent',
  'direction', 'align',
  'link', 'image', 'video',
  'blockquote', 'code-block'
]

export default function NewsManager() {
  const { user } = useAuthStore()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [filterType, setFilterType] = useState('ALL')
  const [activeTab, setActiveTab] = useState('ru')
  
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
    author: '',
    newsType: 'NEWS',
    isActive: true
  })

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const { data } = await newsAPI.getAll(0, 100)
      const items = data.content || data || []
      setNews(Array.isArray(items) ? items : [])
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error)
      toast.error('Ошибка загрузки новостей')
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 5MB')
      return
    }

    setUploading(true)
    try {
      const { data } = await uploadAPI.uploadImage(file)
      setFormData({ ...formData, imageUrl: data.url || data.imageUrl || data })
      setImagePreview(URL.createObjectURL(file))
      toast.success('Изображение загружено')
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error)
      toast.error('Ошибка загрузки изображения')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: '' })
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.titleRu || !formData.titleKk) {
      toast.error('Заполните обязательные поля: Заголовок (RU) и Заголовок (KK)')
      return
    }

    if (!formData.contentRu || !formData.contentKk) {
      toast.error('Заполните обязательные поля: Контент (RU) и Контент (KK)')
      return
    }

    try {
      const submitData = {
        ...formData,
        titleEn: formData.titleEn || formData.titleRu,
        contentEn: formData.contentEn || formData.contentRu,
        shortDescriptionEn: formData.shortDescriptionEn || formData.shortDescriptionRu,
        shortDescriptionKk: formData.shortDescriptionKk || formData.shortDescriptionRu,
        imageUrl: formData.imageUrl || null,
        author: formData.author || null
      }

      if (editingNews) {
        await newsAPI.update(editingNews.id, submitData)
        toast.success('Новость обновлена')
      } else {
        await newsAPI.create(submitData)
        toast.success('Новость создана')
      }
      
      setIsModalOpen(false)
      setEditingNews(null)
      resetForm()
      await fetchNews()
    } catch (error) {
      console.error('ОШИБКА СОХРАНЕНИЯ:', error)
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error ||
                      (error.response?.status === 403 ? '❌ Нет прав доступа для создания новостей' : 'Ошибка сохранения новости')
      toast.error(errorMsg, { duration: 5000 })
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
      author: newsItem.author || '',
      newsType: newsItem.newsType || 'NEWS',
      isActive: newsItem.isActive !== false
    })
    setImagePreview(newsItem.imageUrl || null)
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
      author: '',
      newsType: 'NEWS',
      isActive: true
    })
    setImagePreview(null)
    setActiveTab('ru')
  }

  const filteredNews = filterType === 'ALL' 
    ? news 
    : news.filter(item => item.newsType === filterType)

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
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить новость</span>
        </button>
      </div>

      {/* Фильтр по типу */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            filterType === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Все ({news.length})
        </button>
        <button
          onClick={() => setFilterType('NEWS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
            filterType === 'NEWS' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          Новости ({news.filter(n => n.newsType === 'NEWS').length})
        </button>
        <button
          onClick={() => setFilterType('VACANCY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
            filterType === 'VACANCY' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Вакансии ({news.filter(n => n.newsType === 'VACANCY').length})
        </button>
      </div>

      <div className="grid gap-4">
        {filteredNews.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 flex-1">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.titleRu}
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {item.newsType === 'VACANCY' ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        Вакансия
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Newspaper className="w-3 h-3" />
                        Новость
                      </span>
                    )}
                    {!item.isActive && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        Неактивна
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.titleRu}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.shortDescriptionRu}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(item.publishedDate).toLocaleDateString('ru-RU')}
                    {item.author && <span> • {item.author}</span>}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full my-4 max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white pb-4 border-b mb-4 z-10">
              <h2 className="text-2xl font-bold">
                {editingNews ? '✏️ Редактировать новость' : '➕ Новая новость'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Выбор типа */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-2">Тип публикации *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border-2 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="newsType"
                      value="NEWS"
                      checked={formData.newsType === 'NEWS'}
                      onChange={(e) => setFormData({...formData, newsType: e.target.value})}
                      className="w-4 h-4"
                    />
                    <Newspaper className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Новость</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border-2 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="newsType"
                      value="VACANCY"
                      checked={formData.newsType === 'VACANCY'}
                      onChange={(e) => setFormData({...formData, newsType: e.target.value})}
                      className="w-4 h-4"
                    />
                    <Briefcase className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Вакансия</span>
                  </label>
                </div>
              </div>

              {/* Обложка */}
              <div>
                <label className="block text-sm font-medium mb-2">Обложка (опционально)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="h-32 rounded-lg" />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                        <p className="text-sm text-gray-600">
                          {uploading ? 'Загрузка...' : 'Нажмите для загрузки'}
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG до 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Табы для языков */}
              <div>
                <div className="flex gap-2 mb-3 border-b sticky top-[80px] bg-white z-10 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('ru')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'ru' 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    🇷🇺 Русский *
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('kk')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'kk' 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    🇰🇿 Қазақша *
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('en')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'en' 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>

                {/* Контент для русского языка */}
                {activeTab === 'ru' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Заголовок (RU) *</label>
                      <input
                        type="text"
                        value={formData.titleRu}
                        onChange={(e) => setFormData({...formData, titleRu: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                        placeholder="Введите заголовок новости"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Краткое описание (RU)</label>
                      <textarea
                        value={formData.shortDescriptionRu}
                        onChange={(e) => setFormData({...formData, shortDescriptionRu: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        rows="2"
                        placeholder="Краткое описание для превью"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Контент (RU) * - полный текст</label>
                      <div className="border rounded-lg overflow-hidden">
                        <ReactQuill
                          theme="snow"
                          value={formData.contentRu}
                          onChange={(content) => setFormData({...formData, contentRu: content})}
                          modules={quillModules}
                          formats={quillFormats}
                          style={{ minHeight: '400px' }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Используйте панель инструментов для форматирования текста, вставки ссылок и изображений
                      </p>
                    </div>
                  </div>
                )}

                {/* Контент для казахского языка */}
                {activeTab === 'kk' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Заголовок (KK) *</label>
                      <input
                        type="text"
                        value={formData.titleKk}
                        onChange={(e) => setFormData({...formData, titleKk: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                        placeholder="Жаңалықтың тақырыбын енгізіңіз"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Краткое описание (KK)</label>
                      <textarea
                        value={formData.shortDescriptionKk}
                        onChange={(e) => setFormData({...formData, shortDescriptionKk: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        rows="2"
                        placeholder="Алдын ала қарау үшін қысқаша сипаттама"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Контент (KK) * - толық мәтін</label>
                      <div className="border rounded-lg overflow-hidden">
                        <ReactQuill
                          theme="snow"
                          value={formData.contentKk}
                          onChange={(content) => setFormData({...formData, contentKk: content})}
                          modules={quillModules}
                          formats={quillFormats}
                          style={{ minHeight: '400px' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Контент для английского языка */}
                {activeTab === 'en' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Заголовок (EN)</label>
                      <input
                        type="text"
                        value={formData.titleEn}
                        onChange={(e) => setFormData({...formData, titleEn: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter news title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Краткое описание (EN)</label>
                      <textarea
                        value={formData.shortDescriptionEn}
                        onChange={(e) => setFormData({...formData, shortDescriptionEn: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        rows="2"
                        placeholder="Short description for preview"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Контент (EN) - full text</label>
                      <div className="border rounded-lg overflow-hidden">
                        <ReactQuill
                          theme="snow"
                          value={formData.contentEn}
                          onChange={(content) => setFormData({...formData, contentEn: content})}
                          modules={quillModules}
                          formats={quillFormats}
                          style={{ minHeight: '400px' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Автор и активность */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">Автор</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Имя автора (опционально)"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 text-primary-600 rounded"
                    id="isActive"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium">
                    ✅ Опубликовать (активна)
                  </label>
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 pt-3 border-t sticky bottom-0 bg-white pb-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-lg"
                >
                  {editingNews ? '💾 Сохранить изменения' : '✨ Создать новость'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingNews(null)
                    resetForm()
                  }}
                  className="px-6 py-2.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  ❌ Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}