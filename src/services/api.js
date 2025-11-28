import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// КРИТИЧЕСКИ ВАЖНО: Блокировка одновременных refresh запросов
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      // КРИТИЧЕСКАЯ ПРОВЕРКА: Если уже идет refresh, НЕ ДЕЛАЕМ второй запрос!
      if (isRefreshing) {
        // Добавляем запрос в очередь и ждем завершения текущего refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        console.log('🔄 Refreshing token...')
        
        const { data } = await axios.post('/api/auth/refresh', {
          refreshToken: refreshToken
        })
        
        console.log('✅ Token refreshed successfully')
        
        localStorage.setItem('accessToken', data.accessToken)
        
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken)
        }
        
        // Обрабатываем все запросы из очереди
        processQueue(null, data.accessToken)
        
        // Повторяем оригинальный запрос
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        
        return api(originalRequest)
        
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError)
        
        // Очищаем очередь с ошибкой
        processQueue(refreshError, null)
        
        // Очищаем хранилище
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        
        // Редирект на логин
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login'
        }
        
        return Promise.reject(refreshError)
        
      } finally {
        // ВАЖНО: Сбрасываем флаг после завершения
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export const newsAPI = {
  getAll: (page = 0, size = 10) => api.get(`/news?page=${page}&size=${size}`),
  getLatest: () => api.get('/news/latest'),
  getLatestByType: (type) => api.get(`/news/latest/${type}`),
  getByType: (type, page = 0, size = 10) => 
    api.get(`/news/type/${type}?page=${page}&size=${size}`),
  getById: (id) => api.get(`/news/${id}`),
  search: (keyword, page = 0, size = 10) => 
    api.get(`/news/search?keyword=${keyword}&page=${page}&size=${size}`),
  searchByType: (keyword, type, page = 0, size = 10) => 
    api.get(`/news/search/${type}?keyword=${keyword}&page=${page}&size=${size}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
}

export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  getByType: (type) => api.get(`/services/type/${type}`),
  create: (data) => {
    const payload = {
      ...data,
      titleKk: data.titleKk || data.titleRu,
      titleEn: data.titleEn || data.titleRu
    }
    return api.post('/services', payload)
  },
  update: (id, data) => {
    const payload = {
      ...data,
      titleKk: data.titleKk || data.titleRu,
      titleEn: data.titleEn || data.titleRu
    }
    return api.put(`/services/${id}`, payload)
  },
  delete: (id) => api.delete(`/services/${id}`),
}

export const procurementsAPI = {
  getAll: (page = 0, size = 10) => api.get(`/procurements?page=${page}&size=${size}`),
  getById: (id) => api.get(`/procurements/${id}`),
  getByYear: (year) => api.get(`/procurements/year/${year}`),
  getByType: (type) => api.get(`/procurements/type/${type}`),
  create: (data) => api.post('/procurements', data),
  update: (id, data) => api.put(`/procurements/${id}`, data),
  delete: (id) => api.delete(`/procurements/${id}`),
}

export const contactsAPI = {
  getAll: () => api.get('/contacts'),
  getById: (id) => api.get(`/contacts/${id}`),
  getByType: (type) => api.get(`/contacts/type/${type}`),
  create: (data) => api.post('/contacts', data),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
}

export const departmentsAPI = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
}

export const aboutAPI = {
  getBySection: (section) => api.get(`/about/section/${section}`),
  getByKey: (key) => api.get(`/about/key/${key}`),
  getById: (id) => api.get(`/about/${id}`),
  create: (data) => api.post('/about', data),
  update: (id, data) => api.put(`/about/${id}`, data),
  delete: (id) => api.delete(`/about/${id}`),
}

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: (username) => api.post('/auth/logout', { username }),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
}

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  getUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
  changePassword: (id, newPassword) => api.patch(`/admin/users/${id}/change-password`, { newPassword }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  getAuditLogs: (page = 0, size = 20) => 
    api.get(`/admin/audit-logs?page=${page}&size=${size}`),
  getAuditLogsByUser: (userId) => api.get(`/admin/audit-logs/user/${userId}`),
  getAuditLogsByEntity: (entityType, entityId) => 
    api.get(`/admin/audit-logs/entity/${entityType}/${entityId}`),
}

export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export default api