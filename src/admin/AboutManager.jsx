// AboutManager.jsx - ПОЛНАЯ ВЕРСИЯ

import { useState, useEffect } from 'react'
import { aboutAPI } from '../services/api'
import { Plus, Edit, Trash2, FileText, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Расширенная конфигурация Quill
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
  'script', 'list', 'bullet', 'indent', 'align',
  'link', 'image', 'video', 'blockquote', 'code-block'
]

export default function AboutManager() {
  const [aboutItems, setAboutItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAbout, setEditingAbout] = useState(null)
  const [selectedSection, setSelectedSection] = useState('ALL')
  const [activeTab, setActiveTab] = useState('ru')
  
  const [formData, setFormData] = useState({
    sectionKey: '',
    titleRu: '',
    titleKk: '',
    titleEn: '',
    contentRu: '',
    contentKk: '',
    contentEn: '',
    section: 'GENERAL_INFO',
    displayOrder: 0
  })

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const sections = ['GENERAL_INFO', 'INFO_SECURITY', 'ANTI_CORRUPTION', 'LEGAL_ACTS']
      const allData = []
      
      for (const section of sections) {
        try {
          const { data } = await aboutAPI.getBySection(section)
          allData.push(...data)
        } catch (err) {
          console.log(`No data for section ${section}`)
        }
      }
      
      setAboutItems(allData)
    } catch (error) {
      toast.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.sectionKey || !formData.titleRu) {
      toast.error('Заполните обязательные поля: ключ и название (RU)')
      return
    }
    
    try {
      if (editingAbout) {
        await aboutAPI.update(editingAbout.id, formData)
        toast.success('✅ Раздел обновлен')
      } else {
        await aboutAPI.create(formData)
        toast.success('✅ Раздел создан')
      }
      setIsModalOpen(false)
      setEditingAbout(null)
      resetForm()
      fetchAbout()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка сохранения')
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('❌ Удалить раздел? Это действие нельзя отменить.')) return
    try {
      await aboutAPI.delete(id)
      toast.success('🗑️ Раздел удален')
      fetchAbout()
    } catch (error) {
      toast.error('Ошибка удаления')
    }
  }

  const handleEdit = (about) => {
    setEditingAbout(about)
    setFormData({
      sectionKey: about.sectionKey || '',
      titleRu: about.titleRu || '',
      titleKk: about.titleKk || '',
      titleEn: about.titleEn || '',
      contentRu: about.contentRu || '',
      contentKk: about.contentKk || '',
      contentEn: about.contentEn || '',
      section: about.section || 'GENERAL_INFO',
      displayOrder: about.displayOrder || 0
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      sectionKey: '',
      titleRu: '',
      titleKk: '',
      titleEn: '',
      contentRu: '',
      contentKk: '',
      contentEn: '',
      section: 'GENERAL_INFO',
      displayOrder: 0
    })
    setActiveTab('ru')
  }

  const getSectionColor = (section) => {
    const colors = {
      GENERAL_INFO: 'bg-blue-100 text-blue-800 border-blue-300',
      INFO_SECURITY: 'bg-green-100 text-green-800 border-green-300',
      ANTI_CORRUPTION: 'bg-red-100 text-red-800 border-red-300',
      LEGAL_ACTS: 'bg-purple-100 text-purple-800 border-purple-300'
    }
    return colors[section] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getSectionText = (section) => {
    const texts = {
      GENERAL_INFO: 'ℹ️ Общая информация',
      INFO_SECURITY: '🔒 Информационная безопасность',
      ANTI_CORRUPTION: '⚖️ Антикоррупция',
      LEGAL_ACTS: '📜 Нормативные акты'
    }
    return texts[section] || section
  }

  const getSectionIcon = (section) => {
    const icons = {
      GENERAL_INFO: 'ℹ️',
      INFO_SECURITY: '🔒',
      ANTI_CORRUPTION: '⚖️',
      LEGAL_ACTS: '📜'
    }
    return icons[section] || '📄'
  }

  const filteredItems = selectedSection === 'ALL' 
    ? aboutItems 
    : aboutItems.filter(item => item.section === selectedSection)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Загрузка разделов...</span>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">ℹ️ Управление разделами "О предприятии"</h1>
          <p className="text-gray-600 mt-1">Всего разделов: {aboutItems.length}</p>
        </div>
        <button
          onClick={() => {
            setEditingAbout(null)
            resetForm()
            setIsModalOpen(true)
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить раздел</span>
        </button>
      </div>

      {/* Фильтры */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedSection('ALL')}
          className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
            selectedSection === 'ALL' 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Все разделы ({aboutItems.length})
        </button>
        {['GENERAL_INFO', 'INFO_SECURITY', 'ANTI_CORRUPTION', 'LEGAL_ACTS'].map(section => (
          <button
            key={section}
            onClick={() => setSelectedSection(section)}
            className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
              selectedSection === section 
                ? 'bg-primary-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {getSectionText(section)} ({aboutItems.filter(i => i.section === section).length})
          </button>
        ))}
      </div>

      {/* Список разделов */}
      <div className="grid gap-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <Info className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Разделов не найдено</p>
            <p className="text-gray-400 text-sm mt-2">Добавьте первый раздел, нажав кнопку выше</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-l-4" style={{
              borderLeftColor: item.section === 'GENERAL_INFO' ? '#3b82f6' : 
                               item.section === 'INFO_SECURITY' ? '#10b981' :
                               item.section === 'ANTI_CORRUPTION' ? '#ef4444' : '#a855f7'
            }}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getSectionIcon(item.section)}</span>
                    <h3 className="font-bold text-lg">{item.titleRu}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSectionColor(item.section)}`}>
                      {getSectionText(item.section)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    🔑 Ключ: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{item.sectionKey}</span>
                  </p>
                  <div className="text-sm text-gray-600 mb-2 space-y-1">
                    <p>🇷🇺 <span className="font-medium">{item.titleRu}</span></p>
                    {item.titleKk && <p>🇰🇿 <span className="font-medium">{item.titleKk}</span></p>}
                    {item.titleEn && <p>🇬🇧 <span className="font-medium">{item.titleEn}</span></p>}
                  </div>
                  {item.contentRu && (
                    <div 
                      className="text-gray-600 text-sm line-clamp-2 mt-3 bg-gray-50 p-3 rounded"
                      dangerouslySetInnerHTML={{ __html: item.contentRu.substring(0, 200) + '...' }}
                    />
                  )}
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
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full my-4 max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white pb-4 border-b mb-4 z-10">
              <h2 className="text-2xl font-bold">
                {editingAbout ? '✏️ Редактировать раздел' : '➕ Новый раздел'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Основная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">🔑 Ключ раздела (уникальный) *</label>
                  <input
                    type="text"
                    value={formData.sectionKey}
                    onChange={(e) => setFormData({...formData, sectionKey: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono"
                    required
                    disabled={!!editingAbout}
                    placeholder="company_history"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Используется в URL. Только латиница, цифры и подчеркивание
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">📁 Раздел *</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="GENERAL_INFO">ℹ️ Общая информация</option>
                    <option value="INFO_SECURITY">🔒 Информационная безопасность</option>
                    <option value="ANTI_CORRUPTION">⚖️ Антикоррупция</option>
                    <option value="LEGAL_ACTS">📜 Нормативные акты</option>
                  </select>
                </div>
              </div>

              {/* Заголовки на 3 языках */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">🇷🇺 Заголовок (RU) *</label>
                  <input
                    type="text"
                    value={formData.titleRu}
                    onChange={(e) => setFormData({...formData, titleRu: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                    placeholder="Введите заголовок"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">🇰🇿 Заголовок (KK)</label>
                  <input
                    type="text"
                    value={formData.titleKk}
                    onChange={(e) => setFormData({...formData, titleKk: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Тақырыпты енгізіңіз"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">🇬🇧 Заголовок (EN)</label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({...formData, titleEn: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter title"
                  />
                </div>
              </div>

              {/* Табы для контента */}
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
                    🇷🇺 Русский
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

                {activeTab === 'ru' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Контент (RU) - с форматированием</label>
                    <div className="border rounded-lg overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={formData.contentRu}
                        onChange={(content) => setFormData({...formData, contentRu: content})}
                        modules={quillModules}
                        formats={quillFormats}
                        style={{ height: '400px', marginBottom: '42px' }}
                        placeholder="Добавьте подробное содержание раздела..."
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Полный редактор: форматирование, изображения, таблицы, ссылки, видео
                    </p>
                  </div>
                )}

                {activeTab === 'kk' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Мазмұны (KK) - форматтаумен</label>
                    <div className="border rounded-lg overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={formData.contentKk}
                        onChange={(content) => setFormData({...formData, contentKk: content})}
                        modules={quillModules}
                        formats={quillFormats}
                        style={{ height: '400px', marginBottom: '42px' }}
                        placeholder="Бөлімнің толық мазмұнын қосыңыз..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'en' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Content (EN) - with formatting</label>
                    <div className="border rounded-lg overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={formData.contentEn}
                        onChange={(content) => setFormData({...formData, contentEn: content})}
                        modules={quillModules}
                        formats={quillFormats}
                        style={{ height: '400px', marginBottom: '42px' }}
                        placeholder="Add detailed section content..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Порядок отображения */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-2">📊 Порядок отображения</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="0"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Меньшее число = выше в списке
                </p>
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 pt-3 border-t sticky bottom-0 bg-white pb-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-lg"
                >
                  {editingAbout ? '💾 Сохранить изменения' : '✨ Создать раздел'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingAbout(null)
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