import { useState, useEffect } from 'react'
import { adminAPI } from '../services/api'
import { Plus, Edit, Trash2, UserCheck, UserX, Key, Shield, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const ROLES = {
  USER: { label: 'Пользователь', color: 'gray', icon: '👤' },
  ADMIN: { label: 'Администратор', color: 'red', icon: '👑' },
  NEWS_MANAGER: { label: 'Менеджер новостей', color: 'blue', icon: '📰' },
  PROCUREMENT_MANAGER: { label: 'Менеджер закупок', color: 'green', icon: '🛒' },
  ABOUT_MANAGER: { label: 'Менеджер информации', color: 'purple', icon: 'ℹ️' },
  SERVICES_MANAGER: { label: 'Менеджер сервисов', color: 'orange', icon: '⚙️' },
  CONTACTS_MANAGER: { label: 'Менеджер контактов', color: 'pink', icon: '📞' },
  HR_MANAGER: { label: 'Менеджер кадров', color: 'indigo', icon: '👥' }
}

export default function UsersManager() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [filterRole, setFilterRole] = useState('ALL')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    role: 'USER',
    isActive: true
  })
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Fetch users error:', error)
      toast.error('Ошибка загрузки пользователей')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.email) {
      toast.error('Заполните обязательные поля')
      return
    }

    if (!editingUser && !formData.password) {
      toast.error('Укажите пароль для нового пользователя')
      return
    }

    // Валидация пароля при создании
    if (!editingUser && formData.password) {
      if (formData.password.length < 8) {
        toast.error('Пароль должен содержать минимум 8 символов')
        return
      }
      
      const hasLetters = /[a-zA-Z]/.test(formData.password)
      const hasNumbers = /[0-9]/.test(formData.password)
      
      if (!hasLetters || !hasNumbers) {
        toast.error('Пароль должен содержать и буквы, и цифры')
        return
      }
    }

    try {
      const submitData = {
        ...formData,
        fullName: formData.fullName || formData.username
      }

      if (editingUser) {
        await adminAPI.updateUser(editingUser.id, submitData)
        toast.success('Пользователь обновлен')
      } else {
        await adminAPI.createUser(submitData)
        toast.success('Пользователь создан')
      }
      
      setIsModalOpen(false)
      setEditingUser(null)
      resetForm()
      fetchUsers()
    } catch (error) {
      console.error('User save error:', error)
      const errorMsg = error.response?.data?.message || 
                      error.response?.data ||
                      'Ошибка сохранения пользователя'
      toast.error(errorMsg)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    // Валидация: проверка совпадения паролей
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Пароли не совпадают')
      return
    }

    // Валидация: минимум 8 символов
    if (passwordData.newPassword.length < 8) {
      toast.error('Пароль должен содержать минимум 8 символов')
      return
    }

    // КРИТИЧЕСКАЯ ВАЛИДАЦИЯ: пароль должен содержать буквы И цифры
    const hasLetters = /[a-zA-Z]/.test(passwordData.newPassword)
    const hasNumbers = /[0-9]/.test(passwordData.newPassword)
    
    if (!hasLetters || !hasNumbers) {
      toast.error('Пароль должен содержать и буквы, и цифры')
      return
    }

    try {
      await adminAPI.changePassword(selectedUserId, passwordData.newPassword)
      
      toast.success('✅ Пароль изменен! Пользователь должен войти заново.', {
        duration: 4000
      })
      
      setIsPasswordModalOpen(false)
      setSelectedUserId(null)
      setPasswordData({ newPassword: '', confirmPassword: '' })
      
      // НЕ обновляем список пользователей, чтобы не терять фокус
    } catch (error) {
      console.error('Password change error:', error)
      
      // Детальная обработка ошибок
      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.message || 
                        error.response?.data ||
                        'Неверный формат пароля'
        toast.error(errorMsg)
      } else if (error.response?.status === 401) {
        toast.error('Ваша сессия истекла. Войдите заново.')
      } else {
        toast.error('Ошибка изменения пароля. Попробуйте еще раз.')
      }
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await adminAPI.toggleUserStatus(id)
      toast.success(currentStatus ? 'Пользователь деактивирован' : 'Пользователь активирован')
      fetchUsers()
    } catch (error) {
      toast.error('Ошибка изменения статуса')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить пользователя? Это действие нельзя отменить.')) return
    
    try {
      await adminAPI.deleteUser(id)
      toast.success('Пользователь удален')
      fetchUsers()
    } catch (error) {
      toast.error('Ошибка удаления')
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName || '',
      password: '',
      role: user.role,
      isActive: user.isActive !== false
    })
    setIsModalOpen(true)
  }

  const openPasswordModal = (userId) => {
    setSelectedUserId(userId)
    setPasswordData({ newPassword: '', confirmPassword: '' })
    setIsPasswordModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      fullName: '',
      password: '',
      role: 'USER',
      isActive: true
    })
  }

  const getRoleColor = (role) => {
    const colors = {
      gray: 'bg-gray-100 text-gray-700',
      red: 'bg-red-100 text-red-700',
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      purple: 'bg-purple-100 text-purple-700',
      orange: 'bg-orange-100 text-orange-700',
      pink: 'bg-pink-100 text-pink-700',
      indigo: 'bg-indigo-100 text-indigo-700'
    }
    return colors[ROLES[role]?.color] || colors.gray
  }

  const filteredUsers = filterRole === 'ALL' 
    ? users 
    : users.filter(user => user.role === filterRole)

  if (loading) return <div className="p-8">Загрузка...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Управление пользователями</h1>
          <p className="text-gray-600 mt-1">Всего пользователей: {users.length}</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null)
            resetForm()
            setIsModalOpen(true)
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить пользователя</span>
        </button>
      </div>

      {/* Фильтр по ролям */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <Filter className="w-5 h-5 text-gray-600" />
        <button
          onClick={() => setFilterRole('ALL')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            filterRole === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Все ({users.length})
        </button>
        {Object.entries(ROLES).map(([key, value]) => {
          const count = users.filter(u => u.role === key).length
          if (count === 0) return null
          return (
            <button
              key={key}
              onClick={() => setFilterRole(key)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterRole === key 
                  ? `bg-${value.color}-600 text-white` 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {value.icon} {value.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Список пользователей */}
      <div className="grid gap-4">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg">{user.fullName || user.username}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                    {ROLES[user.role]?.icon} {ROLES[user.role]?.label || user.role}
                  </span>
                  {!user.isActive && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                      Неактивен
                    </span>
                  )}
                </div>
                <div className="text-gray-600 text-sm space-y-1">
                  <p>👤 Логин: <span className="font-medium">{user.username}</span></p>
                  <p>📧 Email: <span className="font-medium">{user.email}</span></p>
                  {user.lastLogin && (
                    <p>🕐 Последний вход: {new Date(user.lastLogin).toLocaleString('ru-RU')}</p>
                  )}
                  {user.createdAt && (
                    <p className="text-xs text-gray-400">Создан: {new Date(user.createdAt).toLocaleDateString('ru-RU')}</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(user.id, user.isActive)}
                  className={`p-2 rounded-lg transition-colors ${
                    user.isActive 
                      ? 'text-orange-600 hover:bg-orange-50' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  title={user.isActive ? 'Деактивировать' : 'Активировать'}
                >
                  {user.isActive ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => openPasswordModal(user.id)}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Изменить пароль"
                >
                  <Key className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEdit(user)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Редактировать"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно создания/редактирования */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingUser ? 'Редактировать пользователя' : 'Новый пользователь'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Логин *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                    disabled={!!editingUser}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Полное имя</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium mb-2">Пароль *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required={!editingUser}
                    minLength={8}
                  />
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                    <p className="font-medium text-blue-900 mb-1">⚠️ Требования к паролю:</p>
                    <ul className="text-blue-700 space-y-1">
                      <li>✓ Минимум 8 символов</li>
                      <li>✓ Должен содержать буквы (a-z, A-Z)</li>
                      <li>✓ Должен содержать цифры (0-9)</li>
                    </ul>
                    <p className="mt-2 text-blue-600 text-xs">
                      Примеры: <code className="bg-blue-100 px-1 rounded">Admin123</code>, 
                      <code className="bg-blue-100 px-1 rounded ml-1">Password2024</code>
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Роль *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                >
                  {Object.entries(ROLES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.icon} {value.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="font-medium mb-1">Права доступа:</p>
                  <p className="text-gray-600">
                    {formData.role === 'ADMIN' && '👑 Полный доступ ко всем разделам'}
                    {formData.role === 'NEWS_MANAGER' && '📰 Управление новостями и вакансиями'}
                    {formData.role === 'PROCUREMENT_MANAGER' && '🛒 Управление закупками'}
                    {formData.role === 'ABOUT_MANAGER' && 'ℹ️ Управление информацией о предприятии'}
                    {formData.role === 'SERVICES_MANAGER' && '⚙️ Управление сервисами'}
                    {formData.role === 'CONTACTS_MANAGER' && '📞 Управление контактами'}
                    {formData.role === 'HR_MANAGER' && '👥 Управление пользователями'}
                    {formData.role === 'USER' && '👤 Базовый доступ без прав редактирования'}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label className="ml-2 text-sm font-medium">Активный пользователь</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingUser ? 'Сохранить' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingUser(null)
                    resetForm()
                  }}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно смены пароля */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Key className="w-6 h-6" />
              Изменить пароль
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Новый пароль</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Подтвердите пароль</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                  minLength={8}
                />
              </div>

              {/* НОВОЕ: Подсказка о требованиях к паролю */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <p className="font-medium text-blue-900 mb-1">⚠️ Требования к паролю:</p>
                <ul className="text-blue-700 space-y-1">
                  <li>✓ Минимум 8 символов</li>
                  <li>✓ Должен содержать буквы (a-z, A-Z)</li>
                  <li>✓ Должен содержать цифры (0-9)</li>
                </ul>
                <p className="mt-2 text-blue-600 text-xs">
                  Примеры: <code className="bg-blue-100 px-1 rounded">Admin123</code>, 
                  <code className="bg-blue-100 px-1 rounded ml-1">Password2024</code>
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Изменить
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false)
                    setSelectedUserId(null)
                    setPasswordData({ newPassword: '', confirmPassword: '' })
                  }}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
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