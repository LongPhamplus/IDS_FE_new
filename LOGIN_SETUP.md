# Hướng dẫn sử dụng chức năng Login

## Tổng quan

Chức năng đăng nhập đã được tích hợp với backend NestJS sử dụng JWT token được lưu trong HTTP-only cookies.

## Cấu hình Backend

### Endpoints đã tích hợp:

1. **POST /fe/login** - Đăng nhập
   - Body: `{ email: string, password: string }`
   - Response: `{ message: 'Login successful' }`
   - Cookie: `access_token_fe` (HTTP-only, 1 giờ)

2. **GET /fe/userPage** - Lấy thông tin user
   - Headers: Cookie `access_token_fe`
   - Response: `{ user: { sub, email, name, iat, exp } }`

3. **GET /fe/logout** - Đăng xuất
   - Headers: Cookie `access_token_fe`
   - Response: `{ message: 'Logout successful' }`
   - Xóa cookie `access_token_fe`

4. **POST /fe/user/add/** - Lưu nhãn hiệu yêu thích
   - Body: `{ userId: number, order: string }`
   - Response: `{ message: 'Thêm thành công' | 'Đã tồn tại đơn.' }`

5. **POST /fe/user/delete/** - Xóa nhãn hiệu yêu thích
   - Body: `{ userId: number, order: string }`
   - Response: `{ message: 'Xóa thành công' | 'Không tồn tại đơn' }`

## Cấu hình Frontend

### 1. Tạo file .env

```bash
cp .env.example .env
```

Nội dung file `.env`:
```
NUXT_PUBLIC_API_BASE=http://localhost:3001
NODE_ENV=development
```

### 2. Cấu trúc đã cập nhật

#### Auth Store (`/app/stores/auth.ts`)
- ✅ Gọi endpoint `/fe/login` với credentials
- ✅ Lưu JWT trong cookie (backend xử lý)
- ✅ Fetch thông tin user sau khi login thành công
- ✅ Xử lý logout và xóa cookie
- ✅ Hỗ trợ demo account (email: demo@example.com, password: password123)

#### Favorites Store (`/app/stores/favorites.ts`)
- ✅ Gọi endpoint `/fe/user/add/` để lưu nhãn hiệu
- ✅ Gọi endpoint `/fe/user/delete/` để xóa nhãn hiệu
- ✅ Sử dụng `so_don` (số đơn) thay vì `trademarkId`
- ✅ Optimistic updates với rollback khi lỗi

#### Login Page (`/app/pages/login.vue`)
- ✅ Form đăng nhập với email và password
- ✅ Toggle hiển thị password
- ✅ Hiển thị thông báo lỗi từ backend (tiếng Việt)
- ✅ Redirect sau khi đăng nhập thành công

## Cách sử dụng

### 1. Khởi động Backend

```bash
cd /home/long/CODE/ids/ips_be
npm run start:dev
```

Backend sẽ chạy tại: `http://localhost:3001`

### 2. Khởi động Frontend

```bash
cd /home/long/CODE/ids/FE
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 3. Đăng nhập

#### Demo Account:
- Email: `demo@example.com`
- Password: `password123`

#### Real Account:
- Sử dụng tài khoản đã đăng ký trong database
- Backend sẽ validate và trả về JWT token

### 4. Luồng hoạt động

1. **User nhập email/password** → Click "Sign in"
2. **Frontend gọi** `POST /fe/login` với credentials
3. **Backend validate** → Tạo JWT → Lưu vào cookie `access_token_fe`
4. **Frontend gọi** `GET /fe/userPage` để lấy thông tin user
5. **Backend decode JWT** → Trả về user info
6. **Frontend lưu** user vào store và localStorage
7. **Redirect** về trang được yêu cầu hoặc homepage

### 5. Lưu/Xóa nhãn hiệu yêu thích

```typescript
// Lưu nhãn hiệu
await favoritesStore.addFavorite(trademark)
// Gọi: POST /fe/user/add/ { userId, order: so_don }

// Xóa nhãn hiệu
await favoritesStore.removeFavorite(trademarkId)
// Gọi: POST /fe/user/delete/ { userId, order: so_don }
```

## Xử lý lỗi

### Lỗi đăng nhập
- Backend trả về: `{ message: '*Sai mật khẩu hoặc tài khoản.' }`
- Frontend hiển thị thông báo lỗi màu đỏ

### Lỗi token hết hạn
- Khi gọi `/fe/userPage` mà token hết hạn
- Frontend tự động logout và redirect về `/login`

### Lỗi CORS
Nếu gặp lỗi CORS, kiểm tra backend đã cấu hình:
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true
})
```

## Security

- ✅ JWT lưu trong **HTTP-only cookie** (không thể truy cập từ JavaScript)
- ✅ Cookie có thuộc tính `secure: true` khi production (HTTPS)
- ✅ Cookie tự động gửi kèm mọi request với `credentials: 'include'`
- ✅ Token expire sau 1 giờ (maxAge: 3600000ms)

## Kiểm tra

### Test đăng nhập thành công:
1. Mở DevTools → Network tab
2. Đăng nhập với demo account
3. Kiểm tra request `POST /fe/login` → Response 200
4. Kiểm tra request `GET /fe/userPage` → Response có user info
5. Kiểm tra Application → Cookies → Có `access_token_fe`

### Test đăng xuất:
1. Click nút Logout
2. Kiểm tra request `GET /fe/logout` → Response 200
3. Kiểm tra Application → Cookies → `access_token_fe` đã bị xóa
4. Redirect về `/login`

## Troubleshooting

### Lỗi: "Cannot find name 'process'"
- Đây là lỗi TypeScript trong editor, không ảnh hưởng runtime
- Nuxt tự động inject `process` global
- Có thể bỏ qua hoặc cài `@types/node`

### Lỗi: Cookie không được set
- Kiểm tra backend có `credentials: true` trong CORS
- Kiểm tra frontend có `credentials: 'include'` trong fetch
- Kiểm tra cùng domain/port (localhost)

### Lỗi: User không được lưu sau login
- Kiểm tra `/fe/userPage` trả về đúng format
- Kiểm tra localStorage có key `user`
- Kiểm tra console log có lỗi

## Tài liệu tham khảo

- Backend Controller: `/home/long/CODE/ids/ips_be/src/controllers/frontend/user.controller.ts`
- Auth Store: `/home/long/CODE/ids/FE/app/stores/auth.ts`
- Favorites Store: `/home/long/CODE/ids/FE/app/stores/favorites.ts`
- Login Page: `/home/long/CODE/ids/FE/app/pages/login.vue`
