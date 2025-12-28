import { useState, useEffect, useRef, useMemo } from 'react'
import { newsAPI, uploadAPI } from '../services/api'
import { Plus, Edit, Trash2, Upload, X, Newspaper, Briefcase, FileText, Paperclip } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Функция для вставки документа в редактор
const insertDocument = async (quillRef) => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', '.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt,.ppt,.pptx')
  input.click()

  input.onchange = async () => {
    const file = input.files[0]
    if (!file) return

    // Проверка типа файла
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip',
      'application/x-zip-compressed',
      'application/x-rar-compressed',
      'application/octet-stream',
      'text/plain'
    ]

    const hasValidExtension = /\.(pdf|doc|docx|xls|xlsx|zip|rar|txt|ppt|pptx)$/i.test(file.name)
    
    if (!allowed.includes(file.type) && !hasValidExtension) {
      toast.error('Только PDF, Word, Excel, PowerPoint, ZIP, RAR, TXT')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error('Максимум 20MB')
      return
    }

    try {
      const loadingToast = toast.loading('Загрузка документа...')
      
      // Получаем токен из localStorage
      const token = localStorage.getItem('accessToken')
      
      // Загружаем файл с токеном авторизации напрямую через fetch
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload/document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Ошибка загрузки')
      }

      const data = await response.json()
      
      const quill = quillRef.current?.getEditor()
      if (!quill) {
        toast.error('Ошибка редактора')
        toast.dismiss(loadingToast)
        return
      }

      const range = quill.getSelection(true)
      const position = range ? range.index : quill.getLength()
      
      // Определяем иконку для файла
      const fileIcon = getFileIcon(data.fileType || '')
      const fileSize = formatFileSize(data.fileSize || 0)
      
      // Вставляем ссылку на документ как простую синюю ссылку
      const linkHTML = `<a href="${data.url}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 500;">${fileIcon} ${file.name} (${fileSize})</a>&nbsp;`
      
      quill.clipboard.dangerouslyPasteHTML(position, linkHTML)
      quill.setSelection(position + file.name.length + 10)
      
      toast.success('Документ добавлен в текст!', { id: loadingToast })
    } catch (error) {
      console.error('Ошибка загрузки:', error)
      toast.error(error.message || 'Ошибка загрузки документа')
    }
  }
}

// Создаем обработчик для кнопки документов
const createDocumentHandler = (quillRef) => {
  return () => insertDocument(quillRef)
}

// Настройки модулей Quill
const createQuillModules = (quillRef) => {
  return {
    toolbar: {
      container: [
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
        ['clean'],
        ['insertDocument']
      ],
      handlers: {
        insertDocument: createDocumentHandler(quillRef)
      }
    },
    clipboard: {
      matchVisual: false
    }
  }
}

const quillFormats = [
  'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'script', 'list', 'bullet', 'indent',
  'direction', 'align', 'link', 'image', 'video', 'blockquote', 'code-block'
]

const getFileIcon = (type) => {
  if (!type) return '📎'
  const t = type.toUpperCase()
  if (t === 'PDF') return '📄'
  if (t === 'DOC' || t === 'DOCX') return '📝'
  if (t === 'XLS' || t === 'XLSX') return '📊'
  if (t === 'PPT' || t === 'PPTX') return '📈'
  if (t === 'ZIP' || t === 'RAR') return '📦'
  if (t === 'TXT') return '📃'
  return '📎'
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function NewsManager() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [filterType, setFilterType] = useState('ALL')
  const [activeTab, setActiveTab] = useState('ru')
  
  const quillRefRu = useRef(null)
  const quillRefKk = useRef(null)
  const quillRefEn = useRef(null)
  
  // Создаем модули один раз и больше не пересоздаем
  const quillModulesRu = useMemo(() => createQuillModules(quillRefRu), [])
  const quillModulesKk = useMemo(() => createQuillModules(quillRefKk), [])
  const quillModulesEn = useMemo(() => createQuillModules(quillRefEn), [])
  
  const [formData, setFormData] = useState({
    titleRu: '', titleKk: '', titleEn: '', 
    contentRu: '', contentKk: '', contentEn: '',
    shortDescriptionRu: '', shortDescriptionKk: '', shortDescriptionEn: '',
    imageUrl: '', author: '', newsType: 'NEWS', isActive: true
  })

  // Добавляем кастомную иконку для кнопки загрузки документов
  useEffect(() => {
    const icons = Quill.import('ui/icons')
    icons['insertDocument'] = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M14,9 L11,9 L11,6 L7,6 L7,9 L4,9 L9,14 Z M3,15 L15,15 L15,16 L3,16 Z"/></svg>'
  }, [])

  useEffect(() => { 
    fetchNews() 
  }, [])

  const fetchNews = async () => {
    try {
      const { data } = await newsAPI.getAll(0, 100)
      setNews(Array.isArray(data.content || data) ? (data.content || data) : [])
    } catch (error) {
      toast.error('Ошибка загрузки')
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith('image/')) {
      return toast.error('Выберите изображение')
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Макс 5MB')
    }

    setUploading(true)
    try {
      const { data } = await uploadAPI.uploadImage(file)
      setFormData({ ...formData, imageUrl: data.url || data.imageUrl })
      setImagePreview(URL.createObjectURL(file))
      toast.success('Загружено')
    } catch (error) {
      toast.error('Ошибка загрузки')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.titleRu || !formData.titleKk || !formData.contentRu || !formData.contentKk) {
      return toast.error('Заполните обязательные поля')
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
        toast.success('Обновлено')
      } else {
        await newsAPI.create(submitData)
        toast.success('Создано')
      }
      
      setIsModalOpen(false)
      setEditingNews(null)
      resetForm()
      await fetchNews()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка сохранения')
    }
  }

  const handleEdit = async (item) => {
    setEditingNews(item)
    setFormData({
      titleRu: item.titleRu || '', 
      titleKk: item.titleKk || '', 
      titleEn: item.titleEn || '',
      contentRu: item.contentRu || '', 
      contentKk: item.contentKk || '', 
      contentEn: item.contentEn || '',
      shortDescriptionRu: item.shortDescriptionRu || '', 
      shortDescriptionKk: item.shortDescriptionKk || '',
      shortDescriptionEn: item.shortDescriptionEn || '', 
      imageUrl: item.imageUrl || '',
      author: item.author || '', 
      newsType: item.newsType || 'NEWS', 
      isActive: item.isActive !== false
    })
    setImagePreview(item.imageUrl || null)
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      titleRu: '', titleKk: '', titleEn: '', 
      contentRu: '', contentKk: '', contentEn: '',
      shortDescriptionRu: '', shortDescriptionKk: '', shortDescriptionEn: '',
      imageUrl: '', author: '', newsType: 'NEWS', isActive: true
    })
    setImagePreview(null)
    setActiveTab('ru')
  }

  const filtered = filterType === 'ALL' ? news : news.filter(i => i.newsType === filterType)

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
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить</span>
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        {[
          { type: 'ALL', label: `Все (${news.length})` },
          { type: 'NEWS', label: `Новости (${news.filter(n => n.newsType === 'NEWS').length})`, icon: Newspaper },
          { type: 'VACANCY', label: `Вакансии (${news.filter(n => n.newsType === 'VACANCY').length})`, icon: Briefcase }
        ].map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              filterType === type 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map(item => (
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
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      item.newsType === 'VACANCY' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.newsType === 'VACANCY' 
                        ? <><Briefcase className="w-3 h-3" />Вакансия</> 
                        : <><Newspaper className="w-3 h-3" />Новость</>
                      }
                    </span>
                    {!item.isActive && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        Неактивна
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.titleRu}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.shortDescriptionRu}
                  </p>
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
                  onClick={async () => { 
                    if (window.confirm('Удалить?')) { 
                      await newsAPI.delete(item.id)
                      fetchNews()
                      toast.success('Удалено') 
                    } 
                  }} 
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
            <h2 className="text-2xl font-bold mb-4">
              {editingNews ? 'Редактировать' : 'Создать'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Тип новости */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-2">Тип *</label>
                <div className="flex gap-4">
                  {[
                    { value: 'NEWS', icon: Newspaper, label: 'Новость' },
                    { value: 'VACANCY', icon: Briefcase, label: 'Вакансия' }
                  ].map(({ value, icon: Icon, label }) => (
                    <label 
                      key={value} 
                      className="flex items-center gap-2 cursor-pointer px-4 py-2 border-2 rounded-lg hover:bg-white transition-colors"
                    >
                      <input 
                        type="radio" 
                        name="newsType" 
                        value={value} 
                        checked={formData.newsType === value}
                        onChange={(e) => setFormData({...formData, newsType: e.target.value})} 
                        className="w-4 h-4" 
                      />
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Обложка */}
              <div>
                <label className="block text-sm font-medium mb-2">Обложка</label>
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
                          onClick={() => { 
                            setFormData({...formData, imageUrl: ''})
                            setImagePreview(null) 
                          }}
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

              {/* Языковые вкладки */}
              <div>
                <div className="flex gap-2 mb-3 border-b">
                  {[
                    { key: 'ru', label: '🇷🇺 Русский *' },
                    { key: 'kk', label: '🇰🇿 Қазақша *' },
                    { key: 'en', label: '🇬🇧 English' }
                  ].map(({ key, label }) => (
                    <button 
                      key={key} 
                      type="button" 
                      onClick={() => setActiveTab(key)}
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === key 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Русский */}
                {activeTab === 'ru' && (
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={formData.titleRu} 
                      required 
                      placeholder="Заголовок"
                      onChange={(e) => setFormData({...formData, titleRu: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <textarea 
                      value={formData.shortDescriptionRu} 
                      rows="2" 
                      placeholder="Краткое описание"
                      onChange={(e) => setFormData({...formData, shortDescriptionRu: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        📝 Контент (используйте кнопку <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded">📎</span> в панели для вставки документов)
                      </label>
                      <ReactQuill 
                        ref={quillRefRu} 
                        theme="snow" 
                        value={formData.contentRu} 
                        modules={quillModulesRu} 
                        formats={quillFormats}
                        onChange={(content) => setFormData({...formData, contentRu: content})}
                        style={{ minHeight: '400px', marginBottom: '50px' }} 
                      />
                    </div>
                  </div>
                )}

                {/* Казахский */}
                {activeTab === 'kk' && (
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={formData.titleKk} 
                      required 
                      placeholder="Тақырып"
                      onChange={(e) => setFormData({...formData, titleKk: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <textarea 
                      value={formData.shortDescriptionKk} 
                      rows="2" 
                      placeholder="Қысқаша сипаттама"
                      onChange={(e) => setFormData({...formData, shortDescriptionKk: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        📝 Мазмұны
                      </label>
                      <ReactQuill 
                        ref={quillRefKk} 
                        theme="snow" 
                        value={formData.contentKk} 
                        modules={quillModulesKk} 
                        formats={quillFormats}
                        onChange={(content) => setFormData({...formData, contentKk: content})}
                        style={{ minHeight: '400px', marginBottom: '50px' }} 
                      />
                    </div>
                  </div>
                )}

                {/* Английский */}
                {activeTab === 'en' && (
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={formData.titleEn} 
                      placeholder="Title"
                      onChange={(e) => setFormData({...formData, titleEn: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <textarea 
                      value={formData.shortDescriptionEn} 
                      rows="2" 
                      placeholder="Short description"
                      onChange={(e) => setFormData({...formData, shortDescriptionEn: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        📝 Content
                      </label>
                      <ReactQuill 
                        ref={quillRefEn} 
                        theme="snow" 
                        value={formData.contentEn} 
                        modules={quillModulesEn} 
                        formats={quillFormats}
                        onChange={(content) => setFormData({...formData, contentEn: content})}
                        style={{ minHeight: '400px', marginBottom: '50px' }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Дополнительные поля */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <input 
                  type="text" 
                  value={formData.author} 
                  placeholder="Автор"
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4" 
                  />
                  <span className="text-sm font-medium">Опубликовать</span>
                </label>
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 pt-3 border-t">
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
                >
                  {editingNews ? 'Сохранить' : 'Создать'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { 
                    setIsModalOpen(false)
                    setEditingNews(null)
                    resetForm() 
                  }}
                  className="px-6 py-2.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}