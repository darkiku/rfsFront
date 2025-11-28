import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Newspaper, Briefcase, ShoppingCart, TrendingUp } from 'lucide-react'
import { adminAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const { data } = await adminAPI.getDashboard()
      setStats(data)
    } catch (error) {
      toast.error('Ошибка загрузки статистики')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  const cards = [
    {
      title: 'Всего пользователей',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Активных пользователей',
      value: stats?.activeUsers || 0,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Новостей',
      value: stats?.totalNews || 0,
      icon: Newspaper,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Сервисов',
      value: stats?.totalServices || 0,
      icon: Briefcase,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Закупок',
      value: stats?.totalProcurements || 0,
      icon: ShoppingCart,
      color: 'from-pink-500 to-pink-600'
    }
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Общая статистика системы</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-xl p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/news"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <Newspaper className="w-8 h-8 text-primary-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Создать новость</h3>
            <p className="text-sm text-gray-600">Добавить новую публикацию</p>
          </a>
          <a
            href="/admin/services"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <Briefcase className="w-8 h-8 text-primary-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Добавить сервис</h3>
            <p className="text-sm text-gray-600">Новый онлайн-сервис</p>
          </a>
          <a
            href="/admin/users"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <Users className="w-8 h-8 text-primary-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Управление доступом</h3>
            <p className="text-sm text-gray-600">Добавить пользователя</p>
          </a>
        </div>
      </motion.div>
    </div>
  )
}