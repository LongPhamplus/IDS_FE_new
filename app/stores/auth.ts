import { defineStore } from 'pinia'
import type { User, LoginCredentials, AuthResponse } from '~/types'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        loading: false,
        error: null as string | null
    }),

    getters: {
        // Check if user exists (httpOnly cookie không đọc được bằng JS)
        isAuthenticated: (state) => !!state.user,
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
                    // Note: Với httpOnly cookie thật, backend sẽ set cookie
                    // Demo account không set cookie vì không qua backend
                    return demoResponse
                }

                // Real API call using useApi composable
                const { feLogin } = useApi()
                const response = await feLogin(credentials)

                // After successful login, fetch user profile
                await this.fetchUser()

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
                // Use useApi composable
                const { register } = useApi()
                const response = await register(credentials)

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
                // Use useApi composable
                const { getUserProfile } = useApi()
                const response = await getUserProfile()

                // Extract user from JWT payload
                const user: User = {
                    id: response.sub || response.userId,
                    email: response.email,
                    name: response.name || response.email.split('@')[0],
                    createdAt: response.iat ? new Date(response.iat * 1000).toISOString() : new Date().toISOString()
                }

                this.user = user
            } catch (error) {
                console.error('Failed to fetch user:', error)
                // Không gọi logout ở đây vì có thể gây lỗi context
                // Clear user state và throw error để caller xử lý
                this.user = null
                throw error
            }
        },

        async logout() {
            this.user = null
            this.error = null

            // Call logout endpoint to clear cookie on server using useApi
            try {
                const { feLogout } = useApi()
                await feLogout()
            } catch (error) {
                console.error('Logout error:', error)
            }

            navigateTo('/login')
        },

        initAuth() {
            // Với httpOnly cookie, không thể check cookie bằng useCookie ở client
            // Chỉ cần check nếu chưa có user thì fetch
            if (!this.user) {
                this.fetchUser().catch(() => {
                    // Nếu lỗi (không có cookie hoặc cookie invalid), bỏ qua
                    // User sẽ ở trạng thái not authenticated
                })
            }
        }
    }
})
