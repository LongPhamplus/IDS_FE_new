# 🎯 Hướng Dẫn Sử Dụng Mock Data

## ✅ Đã Hoàn Thành

Ứng dụng hiện đang sử dụng **dữ liệu mẫu (mock data)** để hiển thị kết quả tìm kiếm.

---

## 📊 Dữ Liệu Có Sẵn

### Tổng số: **19 nhãn hiệu mẫu**

#### 🇻🇳 Nhãn hiệu Việt Nam (8)
1. **TRUNG NGUYÊN** - Cà phê (Class 30)
2. **VIETTEL** - Viễn thông (Class 38)
3. **VINHOMES** - Bất động sản (Class 36)
4. **VINFAST** - Ô tô (Class 12)
5. **BITI'S** - Giày dép (Class 25)
6. **PHÚC LONG** - Trà & Cà phê (Class 30)
7. **HIGHLANDS COFFEE** - Cà phê (Class 43)
8. **MASAN** - Thực phẩm (Class 30)

#### 🌍 Nhãn hiệu Quốc tế (6)
1. **NIKE** - Giày thể thao (Class 25)
2. **NIKE AIR** - Giày công nghệ (Class 25)
3. **VINAMILK** - Sữa (Class 29)
4. **VINAMILK FLEX** - Sữa tươi (Class 29)
5. **SAMSUNG** - Điện tử (Class 9)
6. **SAMSUNG GALAXY** - Điện thoại (Class 9)

#### 🔬 Đang kiểm tra (2)
1. **TECH INNOVATE** - Phần mềm (Class 9)
2. **SMART HOME PRO** - Nhà thông minh (Class 9)

#### ⚠️ Các trạng thái khác (3)
1. **OLD BRAND** - Hết hạn (expired)
2. **REJECTED MARK** - Từ chối (rejected)
3. **CANCELLED MARK** - Hủy (cancelled)

---

## 🔍 Cách Test

### 1. Tìm kiếm cơ bản
```
Nhập: "Nike"
Kết quả: 2 nhãn hiệu Nike
```

### 2. Tìm theo chủ đơn
```
Mở "Nâng cao" → Chủ đơn: "Vinamilk"
Kết quả: 2 nhãn hiệu Vinamilk
```

### 3. Lọc theo trạng thái
```
Mở "Nâng cao" → Trạng thái: "Đang kiểm tra"
Kết quả: 2 nhãn hiệu đang kiểm tra
```

### 4. Tìm kiếm kết hợp
```
Nhập: "Samsung"
Chủ đơn: "Samsung"
Trạng thái: "Cấp bằng"
Kết quả: 2 nhãn hiệu Samsung đã cấp bằng
```

### 5. Tìm theo class
```
Mở "Nâng cao" → Phân loại: "30"
Kết quả: Tất cả nhãn hiệu class 30 (cà phê, thực phẩm)
```

---

## 🎨 Tính Năng Hoạt Động

### ✅ Đã hoạt động:
- Tìm kiếm theo tên/số đơn
- Lọc theo chủ đơn
- Lọc theo trạng thái (5 trạng thái)
- Lọc theo phân loại
- Phân trang (12 kết quả/trang)
- Xem chi tiết nhãn hiệu
- Loading animation (0.5s delay)
- Filter badges
- Xóa từng filter
- Xóa tất cả filters

### 🔄 Chuyển sang API thật:

Khi backend sẵn sàng, chỉ cần thay đổi 2 dòng code:

**File: `/app/pages/search.vue`**
```typescript
// Thay dòng này:
const response = searchMockTrademarks(searchParams.value)

// Thành:
const response = await searchTrademarks(searchParams.value)
```

**File: `/app/pages/trademarks/[id].vue`**
```typescript
// Thay dòng này:
const result = getMockTrademarkById(id)

// Thành:
const result = await getTrademarkById(id)
```

---

## 📝 Cấu Trúc Dữ Liệu

### Trademark Object
```typescript
{
  id: string                    // VD: "TM-VN-001"
  name: string                  // VD: "TRUNG NGUYÊN"
  class: string                 // VD: "30"
  owner: string                 // VD: "Công ty..."
  status: string                // granted/examining/cancelled/expired/rejected
  registrationNumber?: string   // VD: "VN-4-00111111"
  registrationDate?: string     // VD: "2005-03-15"
  expiryDate?: string          // VD: "2025-03-15"
  description?: string         // Mô tả
}
```

---

## 🎯 URL Examples

### Tìm kiếm cơ bản
```
/search?q=Nike
```

### Tìm kiếm nâng cao
```
/search?q=Samsung&owner=Samsung&status=granted&type=trademark
```

### Lọc theo trạng thái
```
/search?status=examining
```

### Lọc theo class
```
/search?class=30
```

### Xem chi tiết
```
/trademarks/TM-VN-001
```

---

## 💡 Tips

### Thêm dữ liệu mẫu mới:

Edit file: `/app/composables/useMockData.ts`

```typescript
const mockTrademarks: Trademark[] = [
  // Thêm nhãn hiệu mới vào đây
  {
    id: 'TM-NEW-001',
    name: 'TÊN NHÃN HIỆU',
    class: '25',
    owner: 'Công ty ABC',
    status: 'granted',
    registrationNumber: 'VN-4-00999999',
    registrationDate: '2024-01-01',
    expiryDate: '2034-01-01',
    description: 'Mô tả nhãn hiệu'
  },
  // ... existing data
]
```

---

## 🚀 Lợi Ích Mock Data

### ✅ Ưu điểm:
- Test frontend không cần backend
- Phát triển song song
- Demo cho khách hàng
- Không cần internet
- Tốc độ nhanh
- Dữ liệu nhất quán

### ⚠️ Lưu ý:
- Chỉ dùng cho development
- Nhớ chuyển sang API thật khi deploy
- Dữ liệu không thay đổi
- Không có validation thực tế

---

## 📊 Thống Kê

- **Tổng nhãn hiệu:** 19
- **Trạng thái Cấp bằng:** 14
- **Trạng thái Đang kiểm tra:** 2
- **Trạng thái Hết hạn:** 1
- **Trạng thái Từ chối:** 1
- **Trạng thái Hủy:** 1

---

## 🎉 Kết Luận

Mock data đã được tích hợp hoàn chỉnh! Bạn có thể:

1. ✅ Test tất cả tính năng search
2. ✅ Demo cho stakeholders
3. ✅ Phát triển UI/UX
4. ✅ Chuyển sang API thật dễ dàng

**Chạy `npm run dev` và test ngay! 🚀**
