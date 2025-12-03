export interface TrademarkClass {
  classNumber: string // Số lớp (01, 02, 03...)
  description: string // Mô tả nhóm dịch vụ
  services: string[] // Danh sách dịch vụ cụ thể
}

export interface TrademarkProgress {
  id: number // ID từ database
  nhan_hieu_id: number // ID nhãn hiệu
  ngay_xu_ly: string // Ngày xử lý (date)
  noi_dung_xu_ly: string // Nội dung xử lý
}

export interface Trademark {
  id: string | number
  name: string
  class: string // Deprecated: Sử dụng classes thay thế
  classes?: TrademarkClass[] // Danh sách các lớp dịch vụ
  owner: string
  status: string
  registrationNumber?: string
  registrationDate?: string
  expiryDate?: string
  description?: string
  imageUrl?: string // URL hình ảnh nhãn hiệu
  relatedTrademarks?: Trademark[]
  progress?: TrademarkProgress[] // Tiến trình xử lý đơn
  so_don?: string // Số đơn từ backend

  // Backend raw fields (Vietnamese column names)
  ten_nhan_hieu?: string
  loai_don?: string
  so_bang?: string
  ngay_cap?: string
  trang_thai?: string
  ngay_het_han?: string
  ngay_nop_don?: string
  so_cong_bo?: string
  ngay_cong_bo?: string
  chu_don_id?: number
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Feedback {
  subject: string
  message: string
  trademarkId?: string
  screenshot?: string
}

export interface SearchParams {
  q?: string // Số đơn hoặc tên nhãn hiệu
  so_don?: string // Số đơn
  class?: string
  owner?: string // Chủ đơn
  status?: string // Trạng thái
  type?: 'trademark' | 'patent' // Nhãn hiệu hoặc Sáng chế
  page?: number
  limit?: number
}

export type TrademarkStatus = 'granted' | 'examining' | 'cancelled' | 'expired' | 'rejected'
export type IPType = 'trademark' | 'patent'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
