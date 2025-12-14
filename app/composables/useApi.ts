import type { Trademark, SearchParams, PaginatedResponse, Feedback } from '~/types'

export const useApi = () => {
  const config = useRuntimeConfig()

  // ==================== REFRESH TOKEN LOGIC ====================

  // Biến để tránh gọi refresh nhiều lần cùng lúc (race condition)
  let isRefreshing = false
  let refreshPromise: Promise<boolean> | null = null

  /**
   * POST /fe/auth/refresh
   * Refresh access token using refresh_token_fe cookie
   * Returns true if refresh successful, false otherwise
   */
  const refreshToken = async (): Promise<boolean> => {
    // Nếu đang refresh, đợi kết quả
    if (isRefreshing && refreshPromise) {
      return refreshPromise
    }

    isRefreshing = true
    refreshPromise = (async () => {
      try {
        const response = await $fetch<{ success: boolean; message: string }>('/fe/auth/refresh', {
          baseURL: config.public.apiBase,
          method: 'POST',
          credentials: 'include'
        })
        return response.success
      } catch (error) {
        console.error('Refresh token failed:', error)
        return false
      } finally {
        isRefreshing = false
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  /**
   * Helper function to make API calls with automatic token refresh
   * Automatically retries the request once if 401 is received and refresh succeeds
   */
  const fetchWithAuth = async <T>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> => {
    const fetchOptions = {
      ...options,
      baseURL: config.public.apiBase,
      credentials: 'include' as const
    }

    try {
      return await $fetch<T>(url, fetchOptions)
    } catch (error: any) {
      // Nếu lỗi 401 (Unauthorized), thử refresh token
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        console.log('Access token expired, attempting refresh...')
        const refreshed = await refreshToken()

        if (refreshed) {
          console.log('Token refreshed successfully, retrying request...')
          // Retry request sau khi refresh thành công
          return await $fetch<T>(url, fetchOptions)
        } else {
          // Refresh thất bại, redirect về login
          console.log('Refresh failed, redirecting to login...')
          const router = useRouter()
          router.push('/login')
          throw new Error('Session expired. Please login again.')
        }
      }

      // Các lỗi khác, throw lại
      throw error
    }
  }

  // ==================== TRADEMARK APIs ====================

  /**
   * GET /api/trademark
   * Search/Get all trademarks with query parameters
   * Maps frontend params to backend expected params
   */
  const searchTrademarks = async (params: SearchParams): Promise<PaginatedResponse<Trademark>> => {
    try {
      const queryParams = new URLSearchParams()

      // Map frontend params to backend params
      if (params.q) {
        queryParams.append('mo_ta_nhan_hieu', params.q) // Tên nhãn hiệu hoặc số đơn
      }
      if (params.owner) {
        queryParams.append('chu_don', params.owner) // Chủ đơn
      }
      if (params.class) {
        queryParams.append('dich_vu_nhom_sp', params.class) // Dịch vụ/nhóm sản phẩm
      }
      if (params.so_don) {
        queryParams.append('so_don', params.so_don) // Số đơn
      }
      // Map status to backend format
      if (params.status) {
        switch (params.status.toLowerCase()) {
          case 'granted':
          case 'cấp bằng':
            queryParams.append('cap_bang', 'true')
            break
          case 'examining':
          case 'đang giải quyết':
            queryParams.append('dang_xu_ly', 'true')
            break
          case 'cancelled':
          case 'rút đơn':
            queryParams.append('rut_don', 'true')
            break
          case 'rejected':
          case 'từ chối':
            queryParams.append('tu_choi', 'true')
            break
        }
      }

      // Map type to backend format
      if (params.type) {
        if (params.type === 'trademark') {
          queryParams.append('cong_bo', 'true')
        } else if (params.type === 'patent') {
          queryParams.append('cong_khai', 'true')
        }
      }


      const response = await fetchWithAuth<Trademark[]>(
        `/api/trademark?${queryParams.toString()}`
      )


      // Kiểm tra response có phải là array không
      if (!Array.isArray(response)) {
        return {
          data: [],
          total: 0,
          page: params.page || 1,
          limit: params.limit || 12,
          totalPages: 0
        }
      }

      // Transform backend data to frontend format
      const transformedData: Trademark[] = response.map((item: any) => {
        // Helper function to get unique ma_nhom values
        const getMaNhom = (trademark: any) => {
          if (!trademark.nhom_dich_vu || !Array.isArray(trademark.nhom_dich_vu)) {
            return [];
          }
          // Lọc ra danh sách mã nhóm duy nhất
          const maNhomList = trademark.nhom_dich_vu
            .filter((nhom: any) => nhom.dich_vu?.ma_nhom)
            .map((nhom: any) => nhom.dich_vu.ma_nhom);
          return [...new Set(maNhomList)];
        };

        // Safely get classes from nhom_dich_vu
        const classes = Array.isArray(item.nhom_dich_vu)
          ? item.nhom_dich_vu.map((nhom: any) => {
            const services = Array.isArray(nhom.dich_vu)
              ? nhom.dich_vu.map((dv: any) => dv.mo_ta_dich_vu || '')
              : []

            // Get ma_nhom from dich_vu
            const classNumber = nhom.dich_vu?.ma_nhom || nhom.nhom_sp || ''

            return {
              classNumber,
              description: services.join(', '),
              services
            }
          })
          : []

        // Get unique ma_nhom values for display
        const maNhomList = getMaNhom(item);
        const displayClass = maNhomList.join(', ') || classes[0]?.classNumber || '';

        // Safely get progress
        const progress = Array.isArray(item.tien_trinh)
          ? item.tien_trinh.map((tt: any) => ({
            id: tt.id,
            nhan_hieu_id: tt.nhan_hieu_id,
            ngay_xu_ly: tt.ngay_xu_ly,
            noi_dung_xu_ly: tt.noi_dung_xu_ly
          }))
          : []

        return {
          id: item.id?.toString() || '',
          name: item.ten_nhan_hieu || '',
          class: displayClass,
          owner: item.chu_don?.ten_chu_don || '',
          status: item.trang_thai || '',
          so_don: item.so_don || '',
          registrationNumber: item.so_bang || '',
          registrationDate: item.ngay_nop_don || '',
          expiryDate: item.ngay_het_han || '',
          description: item.mo_ta || '',
          imageUrl: item.so_don ? `/api/trademark/logo/${item.so_don}` : undefined,
          classes,
          progress
        }
      })

      // Backend trả về array, cần transform thành PaginatedResponse
      const page = params.page || 1
      const limit = params.limit || 12
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit

      const paginatedData = transformedData.slice(startIndex, endIndex)
      const total = transformedData.length
      const totalPages = Math.ceil(total / limit)

      return {
        data: paginatedData,
        total,
        page,
        limit,
        totalPages
      }
    } catch (error: any) {
      console.error('Search failed:', error)
      console.error('Error details:', {
        message: error.message,
        statusCode: error.statusCode,
        data: error.data
      })
      throw error
    }
  }

  /**
   * GET /api/trademark/:slug
   * Get trademark by slug (so_don)
   */
  const getTrademarkBySlug = async (slug: string): Promise<any> => {
    try {

      const response = await fetchWithAuth<any>(`/api/trademark/${slug}`)


      // Transform backend data to frontend format
      if (response) {
        // Helper function to get unique ma_nhom values
        const getMaNhom = (trademark: any) => {
          if (!trademark.nhom_dich_vu || !Array.isArray(trademark.nhom_dich_vu)) {
            return [];
          }
          // Lọc ra danh sách mã nhóm duy nhất
          const maNhomList = trademark.nhom_dich_vu
            .filter((nhom: any) => nhom.dich_vu?.ma_nhom)
            .map((nhom: any) => nhom.dich_vu.ma_nhom);
          return [...new Set(maNhomList)];
        };

        // Safely get classes from nhom_dich_vu
        const classes = Array.isArray(response.nhom_dich_vu)
          ? response.nhom_dich_vu.map((nhom: any) => {
            const services = Array.isArray(nhom.dich_vu)
              ? nhom.dich_vu.map((dv: any) => dv.mo_ta_dich_vu || '')
              : []

            // Get ma_nhom from dich_vu
            const classNumber = nhom.dich_vu?.ma_nhom || nhom.nhom_sp || ''

            return {
              classNumber,
              description: services.join(', '),
              services
            }
          })
          : []

        // Get unique ma_nhom values for display
        const maNhomList = getMaNhom(response);
        const displayClass = maNhomList.join(', ') || classes[0]?.classNumber || '';

        // Safely get progress
        const progress = Array.isArray(response.tien_trinh)
          ? response.tien_trinh.map((tt: any) => ({
            id: tt.id,
            nhan_hieu_id: tt.nhan_hieu_id,
            ngay_xu_ly: tt.ngay_xu_ly,
            noi_dung_xu_ly: tt.noi_dung_xu_ly
          }))
          : []

        return {
          ...response, // Keep all original fields
          id: response.id?.toString() || '',
          name: response.ten_nhan_hieu || '',
          class: displayClass,
          owner: response.chu_don?.ten_chu_don || '',
          status: response.trang_thai || '',
          so_don: response.so_don || '',
          registrationNumber: response.so_bang || '',
          registrationDate: response.ngay_nop_don || '',
          expiryDate: response.ngay_het_han || '',
          description: response.mo_ta || '',
          imageUrl: response.so_don ? `/api/trademark/logo/${response.so_don}` : undefined,
          classes,
          progress
        }
      }

      return response
    } catch (error: any) {
      console.error('Failed to get trademark:', error)
      console.error('Error details:', {
        message: error.message,
        statusCode: error.statusCode,
        data: error.data
      })
      throw error
    }
  }

  /**
   * GET /api/trademark/logo/:slug
   * Get trademark logo image
   */
  const getTrademarkLogoUrl = (slug: string): string => {
    return `${config.public.apiBase}/api/trademark/logo/${slug}`
  }

  // ==================== USER APIs ====================

  /**
   * POST /api/user/report
   * Create a report for trademark violation
   */
  const createReport = async (reportData: {
    report_content: string
    user_data: number
    trademark: number
  }) => {
    try {
      const response = await fetchWithAuth<{ message: string; status: boolean }>('/api/user/report', {
        method: 'POST',
        body: reportData
      })

      return response
    } catch (error) {
      console.error('Failed to create report:', error)
      throw error
    }
  }

  // ==================== AUTH APIs ====================
  /**
   * GET /auth/verify?token=xxx
   * Verify user account with token
   */
  const verifyAccount = async (token: string) => {
    try {
      const response = await $fetch(`/auth/verify?token=${token}`, {
        baseURL: config.public.apiBase,
        credentials: 'include'
      })

      return response
    } catch (error) {
      console.error('Verification failed:', error)
      throw error
    }
  }

  // ==================== FRONTEND USER APIs ====================

  /**
   * POST /fe/login
   * Frontend user login (sets access_token_fe cookie)
   */
  const feLogin = async (credentials: { email: string; password: string }) => {
    try {
      const response = await $fetch<{ message: string }>('/fe/auth/login', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        body: credentials
      })
      console.log(response)
      return response
    } catch (error) {
      console.error('FE Login failed:', error)
      throw error
    }
  }

  /**
   * GET /fe/userPage
   * Get current user profile from JWT cookie
   */
  const getUserProfile = async () => {
    try {
      const response = await fetchWithAuth<{ user: any }>('/fe/auth/me')

      return response.user
    } catch (error) {
      console.error('Failed to get user profile:', error)
      throw error
    }
  }

  /**
   * GET /fe/logout
   * Frontend user logout (clears access_token_fe cookie)
   */
  const feLogout = async () => {
    try {
      const response = await $fetch<{ message: string }>('/fe/auth/logout', {
        baseURL: config.public.apiBase,
        credentials: 'include'
      })

      return response
    } catch (error) {
      console.error('FE Logout failed:', error)
      throw error
    }
  }

  /**
   * POST /fe/register
   * Register new user account
   */
  const register = async (userData: {
    email: string
    password: string
    name?: string
  }) => {
    try {
      const response = await $fetch('/fe/auth/register', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        body: userData
      })

      return response
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  /**
   * POST /fe/saved/add
   * Add trademark to user's saved list (favorites)
   */
  const addToFavorites = async (userId: number | undefined, so_don: string) => {
    try {
      const response = await fetchWithAuth<{ message: string; success?: boolean }>('/fe/saved/add', {
        method: 'POST',
        body: { userId, order: so_don }
      })

      return response
    } catch (error) {
      console.error('Failed to add to favorites:', error)
      throw error
    }
  }

  /**
   * POST /fe/saved/delete
   * Remove trademark from user's saved list (favorites)
   */
  const removeFromFavorites = async (userId: number | undefined, so_don: string) => {
    try {
      const response = await fetchWithAuth<{ message: string; success?: boolean }>('/fe/saved/delete', {
        method: 'POST',
        body: { userId, order: so_don }
      })

      return response
    } catch (error) {
      console.error('Failed to remove from favorites:', error)
      throw error
    }
  }

  /**
   * GET /fe/saved/list
   * Get user's saved trademarks list
   */
  const getSavedTrademarks = async () => {
    try {
      const response = await fetchWithAuth<{ success: boolean; data: any[] } | any[]>('/fe/saved/list')

      return response
    } catch (error) {
      console.error('Failed to get saved trademarks:', error)
      throw error
    }
  }

  // ==================== LEGACY/FEEDBACK APIs ====================

  /**
   * POST /api/feedback
   * Send general feedback
   */
  const sendFeedback = async (feedback: Feedback): Promise<void> => {
    try {
      await fetchWithAuth('/api/feedback', {
        method: 'POST',
        body: feedback
      })
    } catch (error) {
      console.error('Failed to send feedback:', error)
      throw error
    }
  }

  // ==================== SAVE LIMIT APIs ====================

  /**
   * GET /fe/saved/limit
   * Get user's save limit and current count
   */
  const getSaveLimit = async () => {
    try {
      const response = await fetchWithAuth<{
        success: boolean
        data: {
          limit: number
          currentCount: number
          remainingSlots: number
          isLimitReached: boolean
        }
      }>('/fe/saved/limit')
      return response.data
    } catch (error) {
      console.error('Failed to get save limit:', error)
      throw error
    }
  }

  /**
   * POST /fe/saved/increase-limit
   * Increase user's save limit
   */
  const increaseSaveLimit = async (amount: number = 10) => {
    try {
      const response = await fetchWithAuth<{
        success: boolean
        message: string
        data: {
          limit: number
          currentCount: number
          remainingSlots: number
          isLimitReached: boolean
        }
      }>('/fe/saved/increase-limit', {
        method: 'POST',
        body: { amount }
      })
      return response.data
    } catch (error) {
      console.error('Failed to increase save limit:', error)
      throw error
    }
  }

  return {
    // Auth & Token Management
    refreshToken,
    fetchWithAuth,

    // Trademark APIs
    searchTrademarks,
    getTrademarkBySlug,
    getTrademarkLogoUrl,

    // User APIs
    createReport,

    // Auth APIs (Backend page auth)
    verifyAccount,

    // Frontend User APIs
    feLogin,
    feLogout,
    getUserProfile,
    register,
    addToFavorites,
    removeFromFavorites,
    getSavedTrademarks,

    // Save Limit APIs
    getSaveLimit,
    increaseSaveLimit,

    // Feedback APIs
    sendFeedback,

    // Legacy aliases (for backward compatibility)
    getTrademarkById: getTrademarkBySlug
  }
}

