import { create } from 'zustand'
import { authAPI } from '../services/api'

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      const { data } = await authAPI.login(credentials)
      
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        username: data.username,
        email: data.email,
        role: data.role,
      }))
      
      set({
        user: {
          id: data.userId,
          username: data.username,
          email: data.email,
          role: data.role,
        },
        isAuthenticated: true,
        loading: false,
        error: null,
      })
      
      return true
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || 'Login failed'
      set({
        error: errorMessage,
        loading: false,
        isAuthenticated: false,
        user: null,
      })
      return false
    }
  },

  logout: async () => {
    const user = get().user
    
    try {
      if (user && user.username) {
        await authAPI.logout(user.username)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      set({ 
        user: null, 
        isAuthenticated: false,
        error: null,
      })
    }
  },

  checkAuth: () => {
    const token = localStorage.getItem('accessToken')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      try {
        set({
          user: JSON.parse(user),
          isAuthenticated: true,
          error: null,
        })
      } catch (error) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        set({
          user: null,
          isAuthenticated: false,
        })
      }
    } else {
      set({
        user: null,
        isAuthenticated: false,
      })
    }
  },

  clearError: () => set({ error: null }),
}))