export default defineNuxtRouteMiddleware(async (to, from) => {
    const auth = useAuthStore()
    // Nếu Pinia chưa có user → fetch (SSR hoặc client đều được)
    if (!auth.user) {
        try {
            await auth.fetchUser()
        } catch (e) {
            return navigateTo('/login')
        }
    }
})
