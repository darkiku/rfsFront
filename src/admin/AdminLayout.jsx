import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Newspaper, 
  Briefcase, 
  ShoppingCart, 
  Info, 
  Users, 
  Phone,
  FileText,
  LogOut,
  Menu,
  X,
  Settings,
  ChevronDown
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Проверка доступа по ролям
  const hasAccess = (requiredRoles) => {
    if (!user) return false
    if (user.role === 'ADMIN') return true
    return requiredRoles.includes(user.role)
  }

  const menuItems = [
    { 
      path: '/admin', 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      exact: true,
      roles: ['ADMIN', 'HR_MANAGER', 'NEWS_MANAGER', 'PROCUREMENT_MANAGER', 'ABOUT_MANAGER', 'SERVICES_MANAGER', 'CONTACTS_MANAGER']
    },
    { 
      path: '/admin/news', 
      icon: Newspaper, 
      label: 'Новости',
      roles: ['ADMIN', 'NEWS_MANAGER']
    },
    { 
      path: '/admin/services', 
      icon: Briefcase, 
      label: 'Сервисы',
      roles: ['ADMIN', 'SERVICES_MANAGER']
    },
    { 
      path: '/admin/procurements', 
      icon: ShoppingCart, 
      label: 'Закупки',
      roles: ['ADMIN', 'PROCUREMENT_MANAGER']
    },
    { 
      path: '/admin/about', 
      icon: Info, 
      label: 'О предприятии',
      roles: ['ADMIN', 'ABOUT_MANAGER']
    },
    { 
      path: '/admin/contacts', 
      icon: Phone, 
      label: 'Контакты',
      roles: ['ADMIN', 'CONTACTS_MANAGER']
    },
    { 
      path: '/admin/users', 
      icon: Users, 
      label: 'Пользователи',
      roles: ['ADMIN', 'HR_MANAGER']
    },
    { 
      path: '/admin/audit', 
      icon: FileText, 
      label: 'Журнал аудита',
      roles: ['ADMIN']
    },
  ]

  const visibleMenuItems = menuItems.filter(item => hasAccess(item.roles))

  const handleLogout = async () => {
    await logout()
    toast.success('Вы вышли из системы')
    navigate('/admin/login')
  }

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  const getRoleLabel = (role) => {
    const labels = {
      ADMIN: '👑 Администратор',
      NEWS_MANAGER: '📰 Менеджер новостей',
      PROCUREMENT_MANAGER: '🛒 Менеджер закупок',
      ABOUT_MANAGER: 'ℹ️ Менеджер информации',
      SERVICES_MANAGER: '⚙️ Менеджер сервисов',
      CONTACTS_MANAGER: '📞 Менеджер контактов',
      HR_MANAGER: '👥 Менеджер кадров',
      USER: '👤 Пользователь'
    }
    return labels[role] || role
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#5865F2] text-white shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">RFS Admin</h1>
              <p className="text-xs text-blue-200">Панель управления</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm text-white font-medium">{user?.fullName || user?.username}</p>
            <p className="text-xs text-white/80 mt-1">{getRoleLabel(user?.role)}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {visibleMenuItems.map((item) => {
            const active = isActive(item.path, item.exact)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-white text-[#5865F2] font-semibold shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex-1" />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.username}</p>
                <p className="text-xs text-gray-500">{getRoleLabel(user?.role)}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                >
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">{user?.fullName || user?.username}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">{getRoleLabel(user?.role)}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Выйти из системы</span>
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}