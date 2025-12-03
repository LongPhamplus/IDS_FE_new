export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    // Initialize auth if not already done (client-side only)
    if (process.client && !authStore.user) {
        authStore.initAuth()
    }

    // If not authenticated, redirect to login with return URL
    if (!authStore.isAuthenticated) {
        return navigateTo({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    }
})
