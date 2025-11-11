import { defineStore } from 'pinia'
import type { User, LoginCredentials, AuthResponse } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null

      try {
        // Demo account check
        if (credentials.email === 'demo@example.com' && credentials.password === 'password123') {
          const demoResponse: AuthResponse = {
            token: 'demo-token-' + Date.now(),
            user: {
              id: 'demo-user-1',
              email: 'demo@example.com',
              name: 'Demo User',
              createdAt: '2024-01-01T00:00:00.000Z'
            }
          }

          this.user = demoResponse.user

          // Store user in localStorage (no token needed with cookies)
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(demoResponse.user))
          }

          return demoResponse
        }

        // Real API call - backend will set cookie
        const config = useRuntimeConfig()
        const response = await $fetch<AuthResponse>('/api/login', {
          baseURL: config.public.apiBase,
          method: 'POST',
          credentials: 'include', // Include cookies
          body: credentials
        })

        this.user = response.user

        // Store user in localStorage (token is in cookie)
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        return response
      } catch (error: any) {
        this.error = error.data?.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(credentials: { name: string; email: string; password: string }) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<AuthResponse>('/api/register', {
          baseURL: config.public.apiBase,
          method: 'POST',
          credentials: 'include', // Include cookies
          body: credentials
        })

        this.user = response.user

        // Store user in localStorage (token is in cookie)
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        return response
      } catch (error: any) {
        this.error = error.data?.message || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      try {
        const config = useRuntimeConfig()
        const user = await $fetch<User>('/api/user', {
          baseURL: config.public.apiBase,
          credentials: 'include' // Include cookies
        })

        this.user = user
        
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user))
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.logout()
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.error = null

      if (process.client) {
        localStorage.removeItem('user')
      }

      // Call logout endpoint to clear cookie
      try {
        const config = useRuntimeConfig()
        await $fetch('/api/logout', {
          baseURL: config.public.apiBase,
          method: 'POST',
          credentials: 'include'
        })
      } catch (error) {
        console.error('Logout error:', error)
      }

      navigateTo('/login')
    },

    initAuth() {
      if (process.client) {
        const userStr = localStorage.getItem('user')

        if (userStr) {
          this.user = JSON.parse(userStr)
          // Verify cookie is still valid by fetching user
          this.fetchUser()
        }
      }
    }
  }
})
