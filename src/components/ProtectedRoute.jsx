import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children, requiredRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  // Если указаны требуемые роли, проверяем доступ
  if (requiredRoles.length > 0) {
    // ADMIN всегда имеет доступ
    if (user?.role === 'ADMIN') {
      return children
    }

    // Проверяем наличие роли пользователя в списке разрешенных
    if (!requiredRoles.includes(user?.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
            <p className="text-xl text-gray-600 mb-4">Доступ запрещен</p>
            <p className="text-gray-500 mb-8">У вас нет прав для просмотра этой страницы</p>
            <a 
              href="/admin" 
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Вернуться на главную
            </a>
          </div>
        </div>
      )
    }
  }

  return children
}