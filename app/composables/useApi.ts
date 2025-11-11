import type { Trademark, SearchParams, PaginatedResponse, Feedback } from '~/types'

export const useApi = () => {
  const config = useRuntimeConfig()

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

      console.log('Fetching from:', `${config.public.apiBase}/api/trademark?${queryParams.toString()}`)
      
      const response = await $fetch<Trademark[]>(
        `/api/trademark?${queryParams.toString()}`,
        {
          baseURL: config.public.apiBase,
          credentials: 'include'
        }
      )

      console.log('Backend response:', response)

      // Kiểm tra response có phải là array không
      if (!Array.isArray(response)) {
        console.error('Backend response is not an array:', response)
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
          registrationNumber: item.so_don || '',
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

      console.log(`Pagination: ${paginatedData.length} items (page ${page}/${totalPages})`)
      console.log('Transformed data sample:', paginatedData[0])

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
      console.log('Fetching trademark:', `${config.public.apiBase}/api/trademark/${slug}`)
      
      const response = await $fetch<any>(`/api/trademark/${slug}`, {
        baseURL: config.public.apiBase,
        credentials: 'include'
      })

      console.log('Trademark detail response:', response)

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
          registrationNumber: response.so_don || '',
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
   * GET /api/user/:email
   * Get user by email
   */
  const getUserByEmail = async (email: string) => {
    try {
      const response = await $fetch(`/api/user/${email}`, {
        baseURL: config.public.apiBase,
        credentials: 'include'
      })

      return response
    } catch (error) {
      console.error('Failed to fetch user:', error)
      throw error
    }
  }

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
      const response = await $fetch<{ message: string; status: boolean }>('/api/user/report', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
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
   * POST /auth/login
   * User login (returns redirect or error)
   * Note: This is handled by backend with cookies
   */
  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await $fetch('/auth/login', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        body: credentials
      })

      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  /**
   * GET /auth/logout
   * User logout
   */
  const logout = async () => {
    try {
      await $fetch('/auth/logout', {
        baseURL: config.public.apiBase,
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

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
      const response = await $fetch<{ message: string }>('/fe/login', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        body: credentials
      })

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
      const response = await $fetch<{ user: any }>('/fe/userPage', {
        baseURL: config.public.apiBase,
        credentials: 'include'
      })

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
      const response = await $fetch<{ message: string }>('/fe/logout', {
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
      const response = await $fetch('/fe/register', {
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
   * POST /fe/user/add/
   * Add trademark to user's saved list (favorites)
   */
  const addToFavorites = async (userId: number, so_don: string) => {
    try {
      const response = await $fetch<{ message: string }>('/fe/user/add/', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        body: { userId, order: so_don }
      })

      return response
    } catch (error) {
      console.error('Failed to add to favorites:', error)
      throw error
    }
  }

  /**
   * POST /fe/user/delete/
   * Remove trademark from user's saved list (favorites)
   */
  const removeFromFavorites = async (userId: number, so_don: string) => {
    try {
      const response = await $fetch<{ message: string }>('/fe/user/delete/', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        body: { userId, order: so_don }
      })

      return response
    } catch (error) {
      console.error('Failed to remove from favorites:', error)
      throw error
    }
  }

  // ==================== ADMIN APIs ====================

  /**
   * GET /admin/editors-leaders
   * Get all editors with their assigned leaders
   */
  const getEditorsWithLeaders = async () => {
    try {
      const response = await $fetch('/admin/editors-leaders', {
        baseURL: config.public.apiBase,
        credentials: 'include'
      })

      return response
    } catch (error) {
      console.error('Failed to get editors with leaders:', error)
      throw error
    }
  }

  /**
   * POST /admin/update-user-role
   * Update user role (admin only)
   */
  const updateUserRole = async (userId: number, role: string) => {
    try {
      const response = await $fetch('/admin/update-user-role', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        body: { userId, role }
      })

      return response
    } catch (error) {
      console.error('Failed to update user role:', error)
      throw error
    }
  }

  /**
   * POST /admin/update-editor-leader
   * Update editor's assigned leader (admin only)
   */
  const updateEditorLeader = async (editorId: number, newLeaderEmail: string) => {
    try {
      const response = await $fetch('/admin/update-editor-leader', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        body: { editorId, newLeaderEmail }
      })

      return response
    } catch (error) {
      console.error('Failed to update editor leader:', error)
      throw error
    }
  }

  /**
   * POST /admin/leader-data
   * Update leader report data (admin only)
   */
  const updateLeaderData = async () => {
    try {
      const response = await $fetch('/admin/leader-data', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include'
      })

      return response
    } catch (error) {
      console.error('Failed to update leader data:', error)
      throw error
    }
  }

  // ==================== TRADEMARK MANAGEMENT APIs ====================

  /**
   * POST /trademark-management/add
   * Create new trademark (with optional logo upload)
   */
  const createTrademark = async (formData: FormData) => {
    try {
      const response = await $fetch('/trademark-management/add', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      return response
    } catch (error) {
      console.error('Failed to create trademark:', error)
      throw error
    }
  }

  /**
   * POST /trademark-management/edit
   * Update existing trademark (with optional logo upload)
   */
  const updateTrademark = async (formData: FormData) => {
    try {
      const response = await $fetch('/trademark-management/edit', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      return response
    } catch (error) {
      console.error('Failed to update trademark:', error)
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
      await $fetch('/api/feedback', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        body: feedback
      })
    } catch (error) {
      console.error('Failed to send feedback:', error)
      throw error
    }
  }

  return {
    // Trademark APIs
    searchTrademarks,
    getTrademarkBySlug,
    getTrademarkLogoUrl,
    
    // User APIs
    getUserByEmail,
    createReport,
    
    // Auth APIs (Backend page auth)
    login,
    logout,
    verifyAccount,
    
    // Frontend User APIs
    feLogin,
    feLogout,
    getUserProfile,
    register,
    addToFavorites,
    removeFromFavorites,
    
    // Admin APIs
    getEditorsWithLeaders,
    updateUserRole,
    updateEditorLeader,
    updateLeaderData,
    
    // Trademark Management APIs
    createTrademark,
    updateTrademark,
    
    // Feedback APIs
    sendFeedback,

    // Legacy aliases (for backward compatibility)
    getTrademarkById: getTrademarkBySlug
  }
}
