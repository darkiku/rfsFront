// ProcurementManager.jsx - ПОЛНАЯ ВЕРСИЯ с расширенным редактором

import { useState, useEffect } from 'react'
import { procurementsAPI } from '../services/api'
import { Plus, Edit, Trash2, Calendar, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
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

export default function ProcurementsManager() {
  const [procurements, setProcurements] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProcurement, setEditingProcurement] = useState(null)
  const [activeTab, setActiveTab] = useState('ru')
  const [filterType, setFilterType] = useState('ALL')
  
  const [formData, setFormData] = useState({
    titleRu: '',
    titleKk: '',
    titleEn: '',
    descriptionRu: '',
    descriptionKk: '',
    descriptionEn: '',
    year: new Date().getFullYear(),
    publishDate: '',
    deadline: '',
    documentUrl: '',
    procurementType: 'ANNUAL_PLAN',
    isActive: true
  })

  useEffect(() => {
    fetchProcurements()
  }, [])

  const fetchProcurements = async () => {
    try {
      const { data } = await procurementsAPI.getAll(0, 100)
      const items = data.content || data || []
      setProcurements(Array.isArray(items) ? items : [])
    } catch (error) {
      console.error('Fetch procurements error:', error)
      toast.error('Ошибка загрузки закупок')
      setProcurements([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Валидация
    if (!formData.titleRu) {
      toast.error('Заполните название на русском языке')
      return
    }
    
    try {
      const submitData = {
        ...formData,
        year: parseInt(formData.year) || new Date().getFullYear(),
        publishDate: formData.publishDate || null,
        deadline: formData.deadline || null,
        documentUrl: formData.documentUrl || null
      }

      if (editingProcurement) {
        await procurementsAPI.update(editingProcurement.id, submitData)
        toast.success('✅ Закупка обновлена')
      } else {
        await procurementsAPI.create(submitData)
        toast.success('✅ Закупка создана')
      }
      setIsModalOpen(false)
      setEditingProcurement(null)
      resetForm()
      fetchProcurements()
    } catch (error) {
      console.error('Procurement save error:', error)
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      'Ошибка сохранения закупки'
      toast.error(errorMsg)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('❌ Удалить закупку? Это действие нельзя отменить.')) return
    try {
      await procurementsAPI.delete(id)
      toast.success('🗑️ Закупка удалена')
      fetchProcurements()
    } catch (error) {
      toast.error('Ошибка удаления')
    }
  }

  const handleEdit = (procurement) => {
    setEditingProcurement(procurement)
    
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      try {
        const date = new Date(dateStr)
        return date.toISOString().split('T')[0]
      } catch {
        return ''
      }
    }
    
    const migrateType = (oldType) => {
      const migration = {
        'PLANNED': 'ANNUAL_PLAN',
        'ACTIVE': 'ANNOUNCEMENT',
        'COMPLETED': 'REGULATION',
        'CANCELLED': 'REGULATION'
      }
      return migration[oldType] || oldType || 'ANNUAL_PLAN'
    }
    
    setFormData({
      titleRu: procurement.titleRu || '',
      titleKk: procurement.titleKk || '',
      titleEn: procurement.titleEn || '',
      descriptionRu: procurement.descriptionRu || '',
      descriptionKk: procurement.descriptionKk || '',
      descriptionEn: procurement.descriptionEn || '',
      year: procurement.year || new Date().getFullYear(),
      publishDate: formatDate(procurement.publishDate),
      deadline: formatDate(procurement.deadline),
      documentUrl: procurement.documentUrl || '',
      procurementType: migrateType(procurement.procurementType),
      isActive: procurement.isActive !== false
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      titleRu: '',
      titleKk: '',
      titleEn: '',
      descriptionRu: '',
      descriptionKk: '',
      descriptionEn: '',
      year: new Date().getFullYear(),
      publishDate: '',
      deadline: '',
      documentUrl: '',
      procurementType: 'ANNUAL_PLAN',
      isActive: true
    })
    setActiveTab('ru')
  }

  const getStatusColor = (type) => {
    const colors = {
      ANNUAL_PLAN: 'bg-blue-100 text-blue-800',
      REGULATION: 'bg-purple-100 text-purple-800',
      ANNOUNCEMENT: 'bg-green-100 text-green-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (type) => {
    const texts = {
      ANNUAL_PLAN: '📋 Годовой план',
      REGULATION: '📜 Регламент',
      ANNOUNCEMENT: '📢 Объявление'
    }
    return texts[type] || type
  }

  const getStatusIcon = (type) => {
    const icons = {
      ANNUAL_PLAN: '📋',
      REGULATION: '📜',
      ANNOUNCEMENT: '📢'
    }
    return icons[type] || '📄'
  }

  // Фильтрация
  const filteredProcurements = filterType === 'ALL' 
    ? procurements 
    : procurements.filter(item => item.procurementType === filterType)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Загрузка закупок...</span>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">🛒 Управление закупками</h1>
          <p className="text-gray-600 mt-1">Всего записей: {procurements.length}</p>
        </div>
        <button
          onClick={() => {
            setEditingProcurement(null)
            resetForm()
            setIsModalOpen(true)
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить закупку</span>
        </button>
      </div>

      {/* Фильтры */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            filterType === 'ALL' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Все ({procurements.length})
        </button>
        <button
          onClick={() => setFilterType('ANNUAL_PLAN')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            filterType === 'ANNUAL_PLAN' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📋 Годовые планы ({procurements.filter(p => p.procurementType === 'ANNUAL_PLAN').length})
        </button>
        <button
          onClick={() => setFilterType('REGULATION')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            filterType === 'REGULATION' 
              ? 'bg-purple-600 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📜 Регламенты ({procurements.filter(p => p.procurementType === 'REGULATION').length})
        </button>
        <button
          onClick={() => setFilterType('ANNOUNCEMENT')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            filterType === 'ANNOUNCEMENT' 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📢 Объявления ({procurements.filter(p => p.procurementType === 'ANNOUNCEMENT').length})
        </button>
      </div>

      {/* Список закупок */}
      <div className="grid gap-4">
        {filteredProcurements.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Закупок не найдено</p>
            <p className="text-gray-400 text-sm mt-2">Добавьте первую закупку, нажав кнопку выше</p>
          </div>
        ) : (
          filteredProcurements.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-l-4" style={{
              borderLeftColor: item.procurementType === 'ANNUAL_PLAN' ? '#3b82f6' : 
                               item.procurementType === 'REGULATION' ? '#a855f7' : '#10b981'
            }}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getStatusIcon(item.procurementType)}</span>
                    <h3 className="font-bold text-lg">{item.titleRu}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.procurementType)}`}>
                      {getStatusText(item.procurementType)}
                    </span>
                    {!item.isActive && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        ❌ Неактивна
                      </span>
                    )}
                  </div>
                  {item.descriptionRu && (
                    <div 
                      className="text-gray-600 text-sm mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: item.descriptionRu }}
                    />
                  )}
                  <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Год: {item.year}</span>
                    </div>
                    {item.publishDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>Опубликовано: {new Date(item.publishDate).toLocaleDateString('ru-RU')}</span>
                      </div>
                    )}
                    {item.deadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-red-600" />
                        <span>Срок: {new Date(item.deadline).toLocaleDateString('ru-RU')}</span>
                      </div>
                    )}
                    {item.documentUrl && (
                      <a 
                        href={item.documentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-primary-500 hover:underline font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        <span>📎 Документ</span>
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full my-4 max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white pb-4 border-b mb-4 z-10">
              <h2 className="text-2xl font-bold">
                {editingProcurement ? '✏️ Редактировать закупку' : '➕ Новая закупка'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Основная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">📅 Год *</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="2020"
                    max="2100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">📁 Тип закупки *</label>
                  <select
                    value={formData.procurementType}
                    onChange={(e) => setFormData({...formData, procurementType: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="ANNUAL_PLAN">📋 Годовой план</option>
                    <option value="REGULATION">📜 Регламент</option>
                    <option value="ANNOUNCEMENT">📢 Объявление</option>
                  </select>
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
                    🇰🇿 Қазақша
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

                {/* Русский язык */}
                {activeTab === 'ru' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Название (RU) *</label>
                      <input
                        type="text"
                        value={formData.titleRu}
                        onChange={(e) => setFormData({...formData, titleRu: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                        placeholder="Введите название закупки"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Описание (RU) - с форматированием</label>
                      <div className="border rounded-lg overflow-hidden">
                        <ReactQuill
                          theme="snow"
                          value={formData.descriptionRu}
                          onChange={(value) => setFormData({...formData, descriptionRu: value})}
                          modules={quillModules}
                          formats={quillFormats}
                          style={{ height: '300px', marginBottom: '42px' }}
                          placeholder="Добавьте подробное описание закупки..."
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Используйте панель инструментов для форматирования: жирный текст, списки, ссылки, изображения
                      </p>
                    </div>
                  </div>
                )}

                {/* Казахский язык */}
                {activeTab === 'kk' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Атауы (KK)</label>
                      <input
                        type="text"
                        value={formData.titleKk}
                        onChange={(e) => setFormData({...formData, titleKk: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Сатып алу атауын енгізіңіз"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Сипаттама (KK) - форматтаумен</label>
                      <div className="border rounded-lg overflow-hidden">
                        <ReactQuill
                          theme="snow"
                          value={formData.descriptionKk}
                          onChange={(value) => setFormData({...formData, descriptionKk: value})}
                          modules={quillModules}
                          formats={quillFormats}
                          style={{ height: '300px', marginBottom: '42px' }}
                          placeholder="Сатып алудың толық сипаттамасын қосыңыз..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Английский язык */}
                {activeTab === 'en' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title (EN)</label>
                      <input
                        type="text"
                        value={formData.titleEn}
                        onChange={(e) => setFormData({...formData, titleEn: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter procurement title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description (EN) - with formatting</label>
                      <div className="border rounded-lg overflow-hidden">
                        <ReactQuill
                          theme="snow"
                          value={formData.descriptionEn}
                          onChange={(value) => setFormData({...formData, descriptionEn: value})}
                          modules={quillModules}
                          formats={quillFormats}
                          style={{ height: '300px', marginBottom: '42px' }}
                          placeholder="Add detailed procurement description..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Даты и документ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">📅 Дата публикации</label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({...formData, publishDate: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">⏰ Срок подачи</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">📎 Ссылка на документ</label>
                  <input
                    type="url"
                    value={formData.documentUrl}
                    onChange={(e) => setFormData({...formData, documentUrl: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com/doc.pdf"
                  />
                </div>
              </div>

              {/* Активность */}
              <div className="flex items-center bg-blue-50 p-4 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-primary-600 rounded"
                  id="isActive"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium">
                  ✅ Активна (опубликовать на сайте)
                </label>
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 pt-3 border-t sticky bottom-0 bg-white pb-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-lg"
                >
                  {editingProcurement ? '💾 Сохранить изменения' : '✨ Создать закупку'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingProcurement(null)
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