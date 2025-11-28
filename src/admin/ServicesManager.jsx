// ServicesManager.jsx - ПОЛНАЯ ВЕРСИЯ

import { useState, useEffect } from 'react'
import { servicesAPI, uploadAPI } from '../services/api'
import { Upload, X, Plus, Edit, Trash2, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ServicesManager() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [iconPreview, setIconPreview] = useState(null)
  const [filterType, setFilterType] = useState('ALL')
  
  const [formData, setFormData] = useState({
    titleRu: '',
    titleKk: '',
    titleEn: '',
    descriptionRu: '',
    descriptionKk: '',
    descriptionEn: '',
    iconUrl: '',
    link: '',
    displayOrder: 0,
    serviceType: 'QUALITY_CONTROL',
    isActive: true
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data } = await servicesAPI.getAll()
      setServices(data)
    } catch (error) {
      toast.error('Ошибка загрузки сервисов')
    } finally {
      setLoading(false)
    }
  }

  const handleIconUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Выберите изображение')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 5MB')
      return
    }

    setUploading(true)
    try {
      const { data } = await uploadAPI.uploadImage(file)
      setFormData({ ...formData, iconUrl: data.url || data.imageUrl })
      setIconPreview(URL.createObjectURL(file))
      toast.success('✅ Иконка загружена')
    } catch (error) {
      toast.error('Ошибка загрузки иконки')
    } finally {
      setUploading(false)
    }
  }

  const removeIcon = () => {
    setFormData({ ...formData, iconUrl: '' })
    setIconPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.titleRu) {
      toast.error('Заполните название на русском языке')
      return
    }
    
    try {
      if (editingService) {
        await servicesAPI.update(editingService.id, formData)
        toast.success('✅ Сервис обновлен')
      } else {
        await servicesAPI.create(formData)
        toast.success('✅ Сервис создан')
      }
      setIsModalOpen(false)
      setEditingService(null)
      resetForm()
      fetchServices()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Ошибка сохранения')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('❌ Удалить сервис?')) return
    try {
      await servicesAPI.delete(id)
      toast.success('🗑️ Сервис удален')
      fetchServices()
    } catch (error) {
      toast.error('Ошибка удаления')
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      titleRu: service.titleRu || '',
      titleKk: service.titleKk || '',
      titleEn: service.titleEn || '',
      descriptionRu: service.descriptionRu || '',
      descriptionKk: service.descriptionKk || '',
      descriptionEn: service.descriptionEn || '',
      iconUrl: service.iconUrl || '',
      link: service.link || '',
      displayOrder: service.displayOrder || 0,
      serviceType: service.serviceType || 'QUALITY_CONTROL',
      isActive: service.isActive !== false
    })
    setIconPreview(service.iconUrl || null)
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
      iconUrl: '',
      link: '',
      displayOrder: 0,
      serviceType: 'QUALITY_CONTROL',
      isActive: true
    })
    setIconPreview(null)
  }

  const getTypeText = (type) => {
    const texts = {
      QUALITY_CONTROL: '🎯 Контроль качества',
      SYSTEM_MONITORING: '📊 Мониторинг систем',
      SPACE_COORDINATION: '🛰️ Космическая координация',
      GROUND_COORDINATION: '🌍 Наземная координация',
      EMC_COMPATIBILITY: '⚡ ЭМС совместимость'
    }
    return texts[type] || type
  }

  const getTypeIcon = (type) => {
    const icons = {
      QUALITY_CONTROL: '🎯',
      SYSTEM_MONITORING: '📊',
      SPACE_COORDINATION: '🛰️',
      GROUND_COORDINATION: '🌍',
      EMC_COMPATIBILITY: '⚡'
    }
    return icons[type] || '⚙️'
  }

  const filteredServices = filterType === 'ALL' 
    ? services 
    : services.filter(s => s.serviceType === filterType)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Загрузка сервисов...</span>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">⚙️ Управление сервисами</h1>
          <p className="text-gray-600 mt-1">Всего сервисов: {services.length}</p>
        </div>
        <button
          onClick={() => {
            setEditingService(null)
            resetForm()
            setIsModalOpen(true)
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить сервис</span>
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
          Все ({services.length})
        </button>
        {['QUALITY_CONTROL', 'SYSTEM_MONITORING', 'SPACE_COORDINATION', 'GROUND_COORDINATION', 'EMC_COMPATIBILITY'].map(type => {
          const count = services.filter(s => s.serviceType === type).length
          if (count === 0) return null
          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterType === type 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {getTypeText(type)} ({count})
            </button>
          )
        })}
      </div>

      {/* Список сервисов */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Иконка</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Название</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Тип</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ссылка</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Порядок</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Сервисов не найдено</p>
                </td>
              </tr>
            ) : (
              filteredServices.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {item.iconUrl ? (
                      <img src={item.iconUrl} alt="" className="w-12 h-12 object-cover rounded-lg shadow" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                        {getTypeIcon(item.serviceType)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{item.titleRu}</div>
                    <div className="text-xs text-gray-500">{item.titleKk}</div>
                    {item.descriptionRu && (
                      <div className="text-xs text-gray-400 mt-1 line-clamp-1">{item.descriptionRu}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-700">
                      {getTypeIcon(item.serviceType)} {getTypeText(item.serviceType).replace(/^.{2}\s/, '')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline flex items-center gap-1">
                        🔗 Ссылка
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.displayOrder}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                      title="Редактировать"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingService ? '✏️ Редактировать сервис' : '➕ Новый сервис'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Иконка */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                <label className="block text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {iconPreview ? (
                    <div className="relative inline-block">
                      <img src={iconPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow-lg" />
                      <button
                        type="button"
                        onClick={removeIcon}
                        className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 font-medium">
                        {uploading ? '⏳ Загрузка...' : '📷 Загрузить иконку сервиса'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">PNG, JPG, SVG до 5MB</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Названия */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">🇷🇺 Название (RU) *</label>
                  <input
                    type="text"
                    value={formData.titleRu}
                    onChange={(e) => setFormData({...formData, titleRu: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                    placeholder="Название сервиса"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">🇰🇿 Название (KK)</label>
                  <input
                    type="text"
                    value={formData.titleKk}
                    onChange={(e) => setFormData({...formData, titleKk: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Қызмет атауы"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">🇬🇧 Название (EN)</label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({...formData, titleEn: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Service name"
                  />
                </div>
              </div>

              {/* Описания */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Описание (RU)</label>
                  <textarea
                    value={formData.descriptionRu}
                    onChange={(e) => setFormData({...formData, descriptionRu: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    placeholder="Краткое описание"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание (KK)</label>
                  <textarea
                    value={formData.descriptionKk}
                    onChange={(e) => setFormData({...formData, descriptionKk: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    placeholder="Қысқаша сипаттама"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание (EN)</label>
                  <textarea
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    placeholder="Short description"
                  />
                </div>
              </div>

              {/* Настройки */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-2">🔗 Ссылка</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">📁 Тип сервиса *</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="QUALITY_CONTROL">🎯 Контроль качества</option>
                    <option value="SYSTEM_MONITORING">📊 Мониторинг систем</option>
                    <option value="SPACE_COORDINATION">🛰️ Космическая координация</option>
                    <option value="GROUND_COORDINATION">🌍 Наземная координация</option>
                    <option value="EMC_COMPATIBILITY">⚡ ЭМС совместимость</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">📊 Порядок отображения</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="0"
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
                  ✅ Активен (отображать на сайте)
                </label>
              </div>

              {/* Кнопки */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg font-medium"
                >
                  {editingService ? '💾 Сохранить' : '✨ Создать'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingService(null)
                    resetForm()
                  }}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
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