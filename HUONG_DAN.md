# 🇻🇳 Hướng Dẫn Sử Dụng - Trademark Search

## 📖 Giới Thiệu

Ứng dụng tìm kiếm và quản lý thương hiệu (trademark) được xây dựng với **Nuxt 4**, **TypeScript**, và **TailwindCSS**.

---

## 🚀 Bắt Đầu Nhanh

### Bước 1: Cài Đặt Dependencies

```bash
npm install
```

### Bước 2: Cấu Hình Environment

```bash
# Sao chép file mẫu
cp .env.example .env

# Chỉnh sửa file .env
# NUXT_PUBLIC_API_BASE=http://localhost:3001
```

### Bước 3: Chạy Development Server

```bash
npm run dev
```

Mở trình duyệt tại: **http://localhost:3000**

---

## 📱 Các Tính Năng Chính

### 1. 🔍 Tìm Kiếm Trademark

**Đường dẫn:** `/search`

**Cách sử dụng:**
1. Nhập tên trademark vào ô tìm kiếm
2. Hoặc chọn class từ dropdown
3. Nhấn "Search" hoặc Enter
4. Xem kết quả dưới dạng cards
5. Click vào card để xem chi tiết

**Tính năng:**
- Tìm kiếm theo tên
- Lọc theo class
- Phân trang kết quả
- Loading animation
- Thông báo khi không có kết quả

---

### 2. 🧾 Xem Chi Tiết Trademark

**Đường dẫn:** `/trademarks/[id]`

**Thông tin hiển thị:**
- Tên trademark
- Trạng thái (Active, Pending, Expired, Cancelled)
- Class
- Chủ sở hữu
- Số đăng ký
- Ngày đăng ký
- Ngày hết hạn
- Mô tả
- Các trademark liên quan

**Hành động:**
- Lưu vào yêu thích (bookmark icon)
- Quay lại trang tìm kiếm
- Gửi feedback về trademark này

---

### 3. 💾 Quản Lý Yêu Thích

**Đường dẫn:** `/saved`

**Yêu cầu:** Phải đăng nhập

**Cách sử dụng:**
1. Đăng nhập vào hệ thống
2. Click icon bookmark trên bất kỳ trademark nào
3. Trademark được lưu ngay lập tức
4. Xem tất cả tại trang `/saved`
5. Click lại icon bookmark để xóa

**Tính năng:**
- Lưu không giới hạn
- Đồng bộ với server
- Hiển thị số lượng trong navbar
- Refresh thủ công

---

### 4. 💬 Gửi Feedback

**Đường dẫn:** `/feedback`

**Yêu cầu:** Phải đăng nhập

**Các loại feedback:**
- Bug Report (Báo lỗi)
- Feature Request (Đề xuất tính năng)
- Data Issue (Vấn đề dữ liệu)
- General Feedback (Phản hồi chung)
- Other (Khác)

**Cách gửi:**
1. Chọn chủ đề
2. Viết nội dung chi tiết (tối thiểu 10 ký tự)
3. (Tùy chọn) Nhập ID trademark liên quan
4. (Tùy chọn) Đính kèm link screenshot
5. Nhấn "Send Feedback"
6. Nhận thông báo thành công

---

### 5. 🔐 Đăng Nhập

**Đường dẫn:** `/login`

**Demo credentials:**
```
Email: demo@example.com
Password: password123
```

**Tính năng:**
- Lưu phiên đăng nhập
- Tự động chuyển về trang trước đó
- Thông báo lỗi rõ ràng
- Remember me option

**Các trang yêu cầu đăng nhập:**
- `/saved` - Danh sách yêu thích
- `/feedback` - Gửi feedback

---

## 🌓 Dark Mode

**Cách bật/tắt:**
- Click icon mặt trời/mặt trăng ở navbar
- Tự động lưu lựa chọn
- Tự động phát hiện theme hệ thống

**Hỗ trợ:**
- Tất cả các trang
- Tất cả components
- Smooth transition
- Persistent preference

---

## 📱 Responsive Design

### Mobile (< 768px)
- Hamburger menu
- Stacked layouts
- Touch-friendly buttons
- Optimized spacing

### Tablet (768px - 1024px)
- 2 columns grid
- Expanded menu
- Balanced layouts

### Desktop (> 1024px)
- 3 columns grid
- Full navigation
- Hover effects
- Spacious layouts

---

## 🎨 Giao Diện

### Màu Sắc
- **Primary:** Blue (#0ea5e9)
- **Success:** Green
- **Warning:** Yellow
- **Error:** Red
- **Neutral:** Gray

### Typography
- **Headings:** Bold, large
- **Body:** Regular, readable
- **Code:** Monospace

### Components
- **Cards:** Rounded, shadowed
- **Buttons:** Primary, Secondary
- **Inputs:** Bordered, focused
- **Badges:** Colored by status

---

## 🔧 Cấu Trúc Code

### Pages (`app/pages/`)
- `index.vue` - Trang chủ
- `login.vue` - Đăng nhập
- `search.vue` - Tìm kiếm
- `saved.vue` - Yêu thích
- `feedback.vue` - Feedback
- `trademarks/[id].vue` - Chi tiết

### Components (`app/components/`)
- `layout/` - Navbar, Footer
- `trademark/` - TrademarkCard, SearchBar
- `ui/` - Modal, LoadingSkeleton, EmptyState

### Stores (`app/stores/`)
- `auth.ts` - Quản lý authentication
- `favorites.ts` - Quản lý yêu thích

### Composables (`app/composables/`)
- `useApi.ts` - API calls
- `useDarkMode.ts` - Dark mode

---

## 🔌 API Integration

### Cấu hình
File `.env`:
```env
NUXT_PUBLIC_API_BASE=http://localhost:3001
```

### Endpoints cần thiết

**Authentication:**
```
POST /api/login
GET /api/user
```

**Trademarks:**
```
GET /api/trademarks/search?q=&class=&page=&limit=
GET /api/trademarks/:id
```

**Favorites:**
```
GET /api/user/favorites
POST /api/user/favorites
DELETE /api/user/favorites/:id
```

**Feedback:**
```
POST /api/feedback
```

---

## 🐛 Xử Lý Lỗi

### Lỗi kết nối API
1. Kiểm tra file `.env`
2. Verify backend đang chạy
3. Xem browser console
4. Check network tab

### Lỗi build
```bash
# Xóa cache và rebuild
rm -rf .nuxt node_modules
npm install
npm run dev
```

### Port đã được sử dụng
```bash
# Dùng port khác
PORT=3001 npm run dev
```

---

## 📚 Tài Liệu Tham Khảo

- **README.md** - Documentation đầy đủ (English)
- **FEATURES.md** - Chi tiết features (English)
- **QUICKSTART.md** - Quick start guide (English)
- **PROJECT_SUMMARY.md** - Tổng kết dự án (Vietnamese)

---

## 🚢 Deploy Production

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Deploy lên Vercel
```bash
npm i -g vercel
vercel
```

### Deploy lên Netlify
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod
```

---

## ✅ Checklist Kiểm Tra

- [ ] Dependencies đã cài đặt
- [ ] File .env đã cấu hình
- [ ] Backend API đang chạy
- [ ] Dev server khởi động thành công
- [ ] Trang chủ load được
- [ ] Tìm kiếm hoạt động
- [ ] Đăng nhập thành công
- [ ] Dark mode toggle được
- [ ] Responsive trên mobile
- [ ] Không có lỗi console

---

## 💡 Tips & Tricks

### 1. Sử dụng Demo Credentials
Để test nhanh, dùng:
```
Email: demo@example.com
Password: password123
```

### 2. Keyboard Shortcuts
- **Enter** trong search box = Tìm kiếm
- **ESC** trong modal = Đóng modal

### 3. Dark Mode
- Tự động theo system preference
- Lưu lựa chọn của user
- Toggle bằng icon trong navbar

### 4. Favorites
- Phải đăng nhập trước
- Click bookmark icon để lưu
- Xem tất cả tại `/saved`

### 5. Pagination
- Mỗi trang 12 kết quả
- Click số trang để chuyển
- URL được update tự động

---

## 🎯 Workflow Thông Thường

### Người dùng mới:
1. Vào trang chủ
2. Thử tìm kiếm
3. Xem chi tiết trademark
4. Đăng ký/Đăng nhập
5. Lưu yêu thích
6. Gửi feedback

### Người dùng đã đăng nhập:
1. Tìm kiếm trademark
2. Lưu vào favorites
3. Quản lý danh sách saved
4. Gửi feedback khi cần

---

## 🔒 Bảo Mật

- Token được lưu trong localStorage
- Tự động gửi trong header
- Middleware bảo vệ routes
- Logout xóa token
- Session persistence

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. **Đọc documentation**
2. **Check browser console**
3. **Verify API endpoints**
4. **Test với demo credentials**
5. **Rebuild project**

---

## 🎉 Kết Luận

Ứng dụng đã sẵn sàng sử dụng với đầy đủ tính năng:

✅ Tìm kiếm trademark  
✅ Xem chi tiết  
✅ Lưu yêu thích  
✅ Gửi feedback  
✅ Đăng nhập/Đăng xuất  
✅ Dark mode  
✅ Responsive  
✅ Type-safe  

**Chúc bạn sử dụng hiệu quả! 🚀**
