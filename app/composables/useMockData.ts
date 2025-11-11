import type { Trademark, PaginatedResponse, SearchParams } from '~/types'

// Dữ liệu nhãn hiệu mẫu
const mockTrademarks: Trademark[] = [
  // Nhãn hiệu Việt Nam
  {
    id: 'TM-VN-001',
    name: 'TRUNG NGUYÊN',
    class: '30',
    owner: 'Công ty Cổ phần Tập đoàn Trung Nguyên',
    status: 'granted',
    registrationNumber: 'VN-4-00111111',
    registrationDate: '2005-03-15',
    expiryDate: '2025-03-15',
    description: 'Cà phê và các sản phẩm từ cà phê',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    classes: [
      {
        classNumber: '30',
        description: 'Cà phê, trà, ca cao và các chất thay thế',
        services: ['Cà phê rang', 'Cà phê hòa tan', 'Bột cà phê', 'Hạt cà phê', 'Đồ uống từ cà phê']
      },
      {
        classNumber: '43',
        description: 'Dịch vụ ăn uống',
        services: ['Quán cà phê', 'Nhà hàng', 'Dịch vụ phục vụ đồ uống']
      }
    ],
    progress: [
      {
        id: 1,
        nhan_hieu_id: 1,
        ngay_xu_ly: '2004-06-15',
        noi_dung_xu_ly: 'Nộp đơn đăng ký nhãn hiệu - Đơn đã được tiếp nhận và cấp số'
      },
      {
        id: 2,
        nhan_hieu_id: 1,
        ngay_xu_ly: '2004-08-20',
        noi_dung_xu_ly: 'Thẩm định hình thức - Kiểm tra tính hợp lệ của đơn'
      },
      {
        id: 3,
        nhan_hieu_id: 1,
        ngay_xu_ly: '2004-11-10',
        noi_dung_xu_ly: 'Công bố đơn - Công bố đơn trên Công báo SHCN (Thời hạn nộp ý kiến: 2 tháng)'
      },
      {
        id: 4,
        nhan_hieu_id: 1,
        ngay_xu_ly: '2005-02-05',
        noi_dung_xu_ly: 'Thẩm định nội dung - Thẩm định khả năng đăng ký'
      },
      {
        id: 5,
        nhan_hieu_id: 1,
        ngay_xu_ly: '2005-03-15',
        noi_dung_xu_ly: 'Cấp bằng - Cấp Giấy chứng nhận đăng ký nhãn hiệu (Bằng số: VN-4-00111111)'
      }
    ]
  },
  {
    id: 'TM-VN-002',
    name: 'VIETTEL',
    class: '38',
    owner: 'Tập đoàn Công nghiệp - Viễn thông Quân đội',
    status: 'granted',
    registrationNumber: 'VN-4-00222222',
    registrationDate: '2010-05-20',
    expiryDate: '2030-05-20',
    description: 'Dịch vụ viễn thông và internet',
    imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
    classes: [
      {
        classNumber: '38',
        description: 'Dịch vụ viễn thông',
        services: ['Dịch vụ điện thoại di động', 'Dịch vụ internet', 'Truyền dữ liệu', 'Dịch vụ tin nhắn', 'Dịch vụ email']
      },
      {
        classNumber: '09',
        description: 'Thiết bị viễn thông',
        services: ['Điện thoại thông minh', 'Modem', 'Router', 'Thiết bị mạng']
      }
    ],
    progress: [
      {
        id: 6,
        nhan_hieu_id: 2,
        ngay_xu_ly: '2009-08-10',
        noi_dung_xu_ly: 'Nộp đơn đăng ký nhãn hiệu'
      },
      {
        id: 7,
        nhan_hieu_id: 2,
        ngay_xu_ly: '2009-10-15',
        noi_dung_xu_ly: 'Thẩm định hình thức - Đơn đạt yêu cầu hình thức'
      },
      {
        id: 8,
        nhan_hieu_id: 2,
        ngay_xu_ly: '2010-01-20',
        noi_dung_xu_ly: 'Công bố đơn - Công bố trên Công báo SHCN số 01/2010'
      },
      {
        id: 9,
        nhan_hieu_id: 2,
        ngay_xu_ly: '2010-05-20',
        noi_dung_xu_ly: 'Cấp bằng - Cấp Giấy chứng nhận đăng ký nhãn hiệu (Bằng số: VN-4-00222222)'
      }
    ]
  },
  {
    id: 'TM-VN-003',
    name: 'VINHOMES',
    class: '36',
    owner: 'Công ty Cổ phần Vinhomes',
    status: 'granted',
    registrationNumber: 'VN-4-00333333',
    registrationDate: '2012-08-10',
    expiryDate: '2032-08-10',
    description: 'Dịch vụ bất động sản',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop'
  },
  {
    id: 'TM-VN-004',
    name: 'VINFAST',
    class: '12',
    owner: 'Công ty TNHH Sản xuất và Kinh doanh VinFast',
    status: 'granted',
    registrationNumber: 'VN-4-00444444',
    registrationDate: '2018-11-15',
    expiryDate: '2038-11-15',
    description: 'Xe ô tô và phương tiện vận tải',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=400&fit=crop',
    classes: [
      {
        classNumber: '12',
        description: 'Phương tiện vận tải',
        services: ['Xe ô tô', 'Xe điện', 'Xe máy điện', 'Phụ tùng ô tô', 'Xe buýt điện']
      },
      {
        classNumber: '37',
        description: 'Dịch vụ sửa chữa',
        services: ['Bảo dưỡng xe', 'Sửa chữa ô tô', 'Dịch vụ kỹ thuật']
      }
    ],
    progress: [
      {
        id: 10,
        nhan_hieu_id: 4,
        ngay_xu_ly: '2017-09-01',
        noi_dung_xu_ly: 'Nộp đơn đăng ký nhãn hiệu - Đơn ưu tiên nhanh'
      },
      {
        id: 11,
        nhan_hieu_id: 4,
        ngay_xu_ly: '2017-11-15',
        noi_dung_xu_ly: 'Thẩm định hình thức - Đơn đạt yêu cầu hình thức'
      },
      {
        id: 12,
        nhan_hieu_id: 4,
        ngay_xu_ly: '2018-03-20',
        noi_dung_xu_ly: 'Công bố đơn - Công bố trên Công báo SHCN'
      },
      {
        id: 13,
        nhan_hieu_id: 4,
        ngay_xu_ly: '2018-08-10',
        noi_dung_xu_ly: 'Thẩm định nội dung - Thẩm định khả năng đăng ký (Không có ý kiến phản đối)'
      },
      {
        id: 14,
        nhan_hieu_id: 4,
        ngay_xu_ly: '2018-11-15',
        noi_dung_xu_ly: 'Cấp bằng - Cấp Giấy chứng nhận đăng ký nhãn hiệu (Bằng số: VN-4-00444444)'
      }
    ]
  },
  {
    id: 'TM-VN-005',
    name: "BITI'S",
    class: '25',
    owner: "Công ty Cổ phần Biti's",
    status: 'granted',
    registrationNumber: 'VN-4-00555555',
    registrationDate: '2008-02-20',
    expiryDate: '2028-02-20',
    description: 'Giày dép và sản phẩm da',
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
    classes: [
      {
        classNumber: '25',
        description: 'Quần áo, giày dép',
        services: ['Giày thể thao', 'Giày da', 'Dép', 'Sandal', 'Giày cao gót']
      },
      {
        classNumber: '18',
        description: 'Da và sản phẩm từ da',
        services: ['Túi xách', 'Ví da', 'Balo', 'Thắt lưng da']
      }
    ],
    progress: [
      {
        id: 15,
        nhan_hieu_id: 5,
        ngay_xu_ly: '2007-05-10',
        noi_dung_xu_ly: 'Nộp đơn đăng ký nhãn hiệu'
      },
      {
        id: 16,
        nhan_hieu_id: 5,
        ngay_xu_ly: '2007-07-20',
        noi_dung_xu_ly: 'Thẩm định hình thức - Đơn đạt yêu cầu'
      },
      {
        id: 17,
        nhan_hieu_id: 5,
        ngay_xu_ly: '2007-10-15',
        noi_dung_xu_ly: 'Công bố đơn - Công bố trên Công báo SHCN'
      },
      {
        id: 18,
        nhan_hieu_id: 5,
        ngay_xu_ly: '2008-02-20',
        noi_dung_xu_ly: 'Cấp bằng - Cấp Giấy chứng nhận đăng ký nhãn hiệu (Bằng số: VN-4-00555555)'
      }
    ]
  },
  {
    id: 'TM-VN-006',
    name: 'PHÚC LONG',
    class: '30',
    owner: 'Công ty TNHH Phúc Long Heritage',
    status: 'granted',
    registrationNumber: 'VN-4-00666666',
    registrationDate: '2015-07-25',
    expiryDate: '2035-07-25',
    description: 'Trà, cà phê và đồ uống',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop'
  },
  {
    id: 'TM-VN-007',
    name: 'HIGHLANDS COFFEE',
    class: '43',
    owner: 'Công ty TNHH Phát triển Thương hiệu Việt',
    status: 'granted',
    registrationNumber: 'VN-4-00777777',
    registrationDate: '2011-04-10',
    expiryDate: '2031-04-10',
    description: 'Dịch vụ cà phê và nhà hàng',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop'
  },
  {
    id: 'TM-VN-008',
    name: 'MASAN',
    class: '30',
    owner: 'Công ty Cổ phần Tập đoàn Masan',
    status: 'granted',
    registrationNumber: 'VN-4-00888888',
    registrationDate: '2009-09-15',
    expiryDate: '2029-09-15',
    description: 'Thực phẩm và gia vị',
    imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=400&fit=crop'
  },
  // Nhãn hiệu quốc tế
  {
    id: 'TM-001',
    name: 'NIKE',
    class: '25',
    owner: 'Nike, Inc.',
    status: 'granted',
    registrationNumber: 'VN-4-00012345',
    registrationDate: '2020-05-15',
    expiryDate: '2030-05-15',
    description: 'Nhãn hiệu cho giày dép, quần áo thể thao',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
  },
  {
    id: 'TM-002',
    name: 'NIKE AIR',
    class: '25',
    owner: 'Nike, Inc.',
    status: 'granted',
    registrationNumber: 'VN-4-00012346',
    registrationDate: '2019-03-20',
    expiryDate: '2029-03-20',
    description: 'Nhãn hiệu cho giày thể thao công nghệ Air',
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop'
  },
  {
    id: 'TM-101',
    name: 'VINAMILK',
    class: '29',
    owner: 'Công ty Cổ phần Sữa Việt Nam',
    status: 'granted',
    registrationNumber: 'VN-4-00098765',
    registrationDate: '2015-01-10',
    expiryDate: '2025-01-10',
    description: 'Nhãn hiệu cho sản phẩm sữa và các sản phẩm từ sữa',
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop'
  },
  {
    id: 'TM-102',
    name: 'VINAMILK FLEX',
    class: '29',
    owner: 'Công ty Cổ phần Sữa Việt Nam',
    status: 'granted',
    registrationNumber: 'VN-4-00098766',
    registrationDate: '2020-06-15',
    expiryDate: '2030-06-15',
    description: 'Sữa tươi tiệt trùng',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop'
  },
  // Đang kiểm tra
  {
    id: 'TM-201',
    name: 'TECH INNOVATE',
    class: '9',
    owner: 'Công ty TNHH Công nghệ ABC',
    status: 'examining',
    registrationNumber: 'VN-4-00055555',
    description: 'Phần mềm và ứng dụng di động',
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop'
  },
  {
    id: 'TM-202',
    name: 'SMART HOME PRO',
    class: '9',
    owner: 'Công ty TNHH Nhà Thông Minh',
    status: 'examining',
    registrationNumber: 'VN-4-00055556',
    description: 'Thiết bị điều khiển nhà thông minh',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop'
  },
  // Samsung
  {
    id: 'TM-301',
    name: 'SAMSUNG',
    class: '9',
    owner: 'Samsung Electronics Co., Ltd.',
    status: 'granted',
    registrationNumber: 'VN-4-00077777',
    registrationDate: '2018-01-10',
    expiryDate: '2028-01-10',
    description: 'Thiết bị điện tử, điện thoại di động, máy tính bảng',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop'
  },
  {
    id: 'TM-302',
    name: 'SAMSUNG GALAXY',
    class: '9',
    owner: 'Samsung Electronics Co., Ltd.',
    status: 'granted',
    registrationNumber: 'VN-4-00077778',
    registrationDate: '2019-05-15',
    expiryDate: '2029-05-15',
    description: 'Dòng điện thoại thông minh cao cấp',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
  },
  // Các trạng thái khác
  {
    id: 'TM-401',
    name: 'OLD BRAND',
    class: '35',
    owner: 'Công ty Cũ',
    status: 'expired',
    registrationNumber: 'VN-4-00011111',
    registrationDate: '2000-01-01',
    expiryDate: '2010-01-01',
    description: 'Nhãn hiệu đã hết hạn bảo hộ'
  },
  {
    id: 'TM-501',
    name: 'REJECTED MARK',
    class: '25',
    owner: 'Công ty ABC',
    status: 'rejected',
    registrationNumber: 'VN-4-00099999',
    description: 'Đơn bị từ chối do trùng với nhãn hiệu nổi tiếng'
  },
  {
    id: 'TM-601',
    name: 'CANCELLED MARK',
    class: '30',
    owner: 'Công ty XYZ',
    status: 'cancelled',
    registrationNumber: 'VN-4-00088888',
    registrationDate: '2015-06-10',
    expiryDate: '2025-06-10',
    description: 'Nhãn hiệu đã bị hủy theo yêu cầu chủ đơn'
  }
]

export const useMockData = () => {
  const searchMockTrademarks = (params: SearchParams): PaginatedResponse<Trademark> => {
    let filtered = [...mockTrademarks]

    // Filter by query (name or registration number)
    if (params.q) {
      const query = params.q.toLowerCase()
      filtered = filtered.filter(tm => 
        tm.name.toLowerCase().includes(query) ||
        tm.registrationNumber?.toLowerCase().includes(query)
      )
    }

    // Filter by owner
    if (params.owner) {
      const owner = params.owner.toLowerCase()
      filtered = filtered.filter(tm => 
        tm.owner.toLowerCase().includes(owner)
      )
    }

    // Filter by status
    if (params.status) {
      filtered = filtered.filter(tm => tm.status === params.status)
    }

    // Filter by type (for now, all are trademarks in mock data)
    if (params.type === 'patent') {
      filtered = [] // No patents in mock data yet
    }

    // Filter by class
    if (params.class) {
      filtered = filtered.filter(tm => tm.class === params.class)
    }

    // Pagination
    const page = params.page || 1
    const limit = params.limit || 12
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = filtered.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    }
  }

  const getMockTrademarkById = (id: string): Trademark | undefined => {
    return mockTrademarks.find(tm => tm.id === id)
  }

  const getMockDemoFavorites = (): Trademark[] => {
    // Return 3 pre-selected trademarks for demo user
    return [
      mockTrademarks[0], // TRUNG NGUYÊN
      mockTrademarks[1], // VIETTEL
      mockTrademarks[3], // VINFAST
    ].filter(Boolean) as Trademark[]
  }

  return {
    searchMockTrademarks,
    getMockTrademarkById,
    getMockDemoFavorites,
    mockTrademarks
  }
}
