// ContactsManager.jsx - ПОЛНАЯ ВЕРСИЯ

import { useState, useEffect } from 'react'
import { contactsAPI } from '../services/api'
import { Plus, Edit, Trash2, Phone, Mail, MapPin, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactsManager() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [filterType, setFilterType] = useState('ALL')
  
  const [formData, setFormData] = useState({
    labelRu: '',
    labelKk: '',
    labelEn: '',
    value: '',
    contactType: 'PHONE',
    displayOrder: 0
  })

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const { data } = await contactsAPI.getAll()
      setContacts(data)
    } catch (error) {
      toast.error('Ошибка загрузки контактов')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.labelRu || !formData.value) {
      toast.error('Заполните обязательные поля: название и значение')
      return
    }
    
    try {
      if (editingContact) {
        await contactsAPI.update(editingContact.id, formData)
        toast.success('✅ Контакт обновлен')
      } else {
        await contactsAPI.create(formData)
        toast.success('✅ Контакт создан')
      }
      setIsModalOpen(false)
      setEditingContact(null)
      resetForm()
      fetchContacts()
    } catch (error) {
      toast.error('Ошибка сохранения')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('❌ Удалить контакт?')) return
    try {
      await contactsAPI.delete(id)
      toast.success('🗑️ Контакт удален')
      fetchContacts()
    } catch (error) {
      toast.error('Ошибка удаления')
    }
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setFormData({
      labelRu: contact.labelRu || '',
      labelKk: contact.labelKk || '',
      labelEn: contact.labelEn || '',
      value: contact.value || '',
      contactType: contact.contactType || 'PHONE',
      displayOrder: contact.displayOrder || 0
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      labelRu: '',
      labelKk: '',
      labelEn: '',
      value: '',
      contactType: 'PHONE',
      displayOrder: 0
    })
  }

  const getIcon = (type) => {
    const icons = {
      PHONE: Phone,
      EMAIL: Mail,
      ADDRESS: MapPin,
      WORKING_HOURS: Clock
    }
    const Icon = icons[type] || Phone
    return <Icon className="w-5 h-5" />
  }

  const getTypeColor = (type) => {
    const colors = {
      PHONE: 'bg-blue-100 text-blue-800 border-blue-300',
      EMAIL: 'bg-green-100 text-green-800 border-green-300',
      ADDRESS: 'bg-purple-100 text-purple-800 border-purple-300',
      WORKING_HOURS: 'bg-orange-100 text-orange-800 border-orange-300'
    }
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getTypeText = (type) => {
    const texts = {
      PHONE: '📞 Телефон',
      EMAIL: '📧 Email',
      ADDRESS: '📍 Адрес',
      WORKING_HOURS: '🕒 Часы работы'
    }
    return texts[type] || type
  }

  const getTypeIcon = (type) => {
    const icons = {
      PHONE: '📞',
      EMAIL: '📧',
      ADDRESS: '📍',
      WORKING_HOURS: '🕒'
    }
    return icons[type] || '📄'
  }

  const filteredContacts = filterType === 'ALL' 
    ? contacts 
    : contacts.filter(c => c.contactType === filterType)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Загрузка контактов...</span>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">📞 Управление контактами</h1>
          <p className="text-gray-600 mt-1">Всего контактов: {contacts.length}</p>
        </div>
        <button
          onClick={() => {
            setEditingContact(null)
            resetForm()
            setIsModalOpen(true)
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить контакт</span>
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
          Все ({contacts.length})
        </button>
        {['PHONE', 'EMAIL', 'ADDRESS', 'WORKING_HOURS'].map(type => {
          const count = contacts.filter(c => c.contactType === type).length
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

      {/* Список контактов - карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContacts.length === 0 ? (
          <div className="col-span-2 bg-white p-12 rounded-lg shadow text-center">
            <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Контактов не найдено</p>
            <p className="text-gray-400 text-sm mt-2">Добавьте первый контакт, нажав кнопку выше</p>
          </div>
        ) : (
          filteredContacts.map(contact => (
            <div key={contact.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-l-4" style={{
              borderLeftColor: contact.contactType === 'PHONE' ? '#3b82f6' : 
                               contact.contactType === 'EMAIL' ? '#10b981' :
                               contact.contactType === 'ADDRESS' ? '#a855f7' : '#f59e0b'
            }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${getTypeColor(contact.contactType)}`}>
                    {getIcon(contact.contactType)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{contact.labelRu}</h3>
                    {contact.labelKk && <p className="text-sm text-gray-500">{contact.labelKk}</p>}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(contact.contactType)}`}>
                  {getTypeIcon(contact.contactType)} {getTypeText(contact.contactType).replace(/^.{2}\s/, '')}
                </span>
              </div>
              
              <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-900 font-medium break-all">{contact.value}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(contact)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Редактировать</span>
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Удалить</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingContact ? '✏️ Редактировать контакт' : '➕ Новый контакт'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Тип контакта */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-2">📁 Тип контакта *</label>
                <select
                  value={formData.contactType}
                  onChange={(e) => setFormData({...formData, contactType: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="PHONE">📞 Телефон</option>
                  <option value="EMAIL">📧 Email</option>
                  <option value="ADDRESS">📍 Адрес</option>
                  <option value="WORKING_HOURS">🕒 Часы работы</option>
                </select>
              </div>

              {/* Названия на 3 языках */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">🇷🇺 Название (RU) *</label>
                  <input
                    type="text"
                    value={formData.labelRu}
                    onChange={(e) => setFormData({...formData, labelRu: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                    placeholder="Телефон приемной"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">🇰🇿 Название (KK)</label>
                  <input
                    type="text"
                    value={formData.labelKk}
                    onChange={(e) => setFormData({...formData, labelKk: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Қабылдау бөлмесінің телефоны"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">🇬🇧 Название (EN)</label>
                  <input
                    type="text"
                    value={formData.labelEn}
                    onChange={(e) => setFormData({...formData, labelEn: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Reception phone"
                  />
                </div>
              </div>

              {/* Значение */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {formData.contactType === 'PHONE' && '📞 Номер телефона *'}
                  {formData.contactType === 'EMAIL' && '📧 Email адрес *'}
                  {formData.contactType === 'ADDRESS' && '📍 Адрес *'}
                  {formData.contactType === 'WORKING_HOURS' && '🕒 Часы работы *'}
                </label>
                {formData.contactType === 'ADDRESS' || formData.contactType === 'WORKING_HOURS' ? (
                  <textarea
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                    rows="3"
                    placeholder={
                      formData.contactType === 'ADDRESS' 
                        ? 'г. Астана, ул. Примерная, д. 1' 
                        : 'Пн-Пт: 9:00-18:00\nСб-Вс: выходной'
                    }
                  />
                ) : (
                  <input
                    type={formData.contactType === 'EMAIL' ? 'email' : 'text'}
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                    placeholder={
                      formData.contactType === 'PHONE' 
                        ? '+7 (XXX) XXX-XX-XX' 
                        : 'email@example.com'
                    }
                  />
                )}
              </div>

              {/* Порядок */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-2">📊 Порядок отображения</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Меньшее число = выше в списке
                </p>
              </div>

              {/* Кнопки */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg font-medium"
                >
                  {editingContact ? '💾 Сохранить' : '✨ Создать'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingContact(null)
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