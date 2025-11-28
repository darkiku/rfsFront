import { useAuthStore } from '../store/authStore'

/**
 * Компонент для условного рендеринга на основе ролей пользователя
 * @param {Array} roles - Массив ролей, которым разрешен доступ
 * @param {React.ReactNode} children - Контент для отображения
 * @param {React.ReactNode} fallback - Контент для отображения при отсутствии доступа
 */
export default function RoleBasedAccess({ roles = [], children, fallback = null }) {
  const { user } = useAuthStore()

  if (!user) return fallback

  // ADMIN всегда имеет доступ
  if (user.role === 'ADMIN') return children

  // Проверяем наличие роли пользователя в списке разрешенных
  if (roles.includes(user.role)) return children

  return fallback
}

/**
 * Хук для проверки прав доступа
 */
export function useHasRole(roles = []) {
  const { user } = useAuthStore()

  if (!user) return false
  if (user.role === 'ADMIN') return true
  return roles.includes(user.role)
}

/**
 * Хук для проверки конкретной роли
 */
export function useIsRole(role) {
  const { user } = useAuthStore()
  return user?.role === role
}

/**
 * Хук для проверки является ли пользователь админом
 */
export function useIsAdmin() {
  const { user } = useAuthStore()
  return user?.role === 'ADMIN'
}