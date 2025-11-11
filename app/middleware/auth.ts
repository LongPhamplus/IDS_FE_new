export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Initialize auth if not already done
  // if (!authStore.token && process.client) {
  //   authStore.initAuth()
  // }

  // If not authenticated, redirect to login
  // if (!authStore.isAuthenticated) {
  //   return navigateTo({
  //     path: '/login',
  //     query: { redirect: to.fullPath }
  //   })
  // }
})
