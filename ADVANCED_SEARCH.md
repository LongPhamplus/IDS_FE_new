# 🔍 Advanced Search Feature

## ✨ Tổng Quan

Đã thêm tính năng **Tìm kiếm Nâng cao** với nhiều trường lọc để tìm kiếm nhãn hiệu và sáng chế chính xác hơn.

---

## 🎯 Các Trường Tìm Kiếm

### 1. **Trường Chính**
- **Số đơn / Tên nhãn hiệu** (`q`)
  - Input text chính
  - Tìm kiếm theo số đơn hoặc tên nhãn hiệu
  - Placeholder: "Nhập số đơn hoặc tên nhãn hiệu..."

### 2. **Trường Nâng Cao** (Mở rộng khi click "Nâng cao")

#### a. Chủ đơn (`owner`)
- Input text
- Tìm kiếm theo tên chủ sở hữu đơn
- Placeholder: "Nhập tên chủ đơn..."

#### b. Trạng thái (`status`)
- Select dropdown
- 5 trạng thái:
  1. **Cấp bằng** (`granted`)
  2. **Đang kiểm tra** (`examining`)
  3. **Hủy** (`cancelled`)
  4. **Hết hạn** (`expired`)
  5. **Từ chối** (`rejected`)

#### c. Loại sở hữu trí tuệ (`type`)
- Select dropdown
- 2 loại:
  1. **Nhãn hiệu** (`trademark`)
  2. **Sáng chế** (`patent`)

#### d. Phân loại (`class`)
- Input text
- Nhập mã phân loại
- Placeholder: "Nhập mã phân loại..."

---

## 🎨 UI/UX Features

### 1. **Collapsible Advanced Filters**
- Nút "Nâng cao" với icon chevron
- Smooth transition khi mở/đóng
- Animation slide-up

### 2. **Filter Summary**
- Hiển thị các bộ lọc đang áp dụng
- Badges với màu primary
- Nút X để xóa từng filter
- Nút "Xóa bộ lọc" để xóa tất cả

### 3. **Glass Effect Search Bar**
- Background blur effect
- Modern glassmorphism design
- Rounded corners (rounded-2xl)
- Shadow effects

### 4. **Responsive Layout**
- Grid 2 columns trên tablet/desktop
- Stack layout trên mobile
- Adaptive spacing

---

## 📝 Component Structure

### `AdvancedSearch.vue`
**Location:** `/app/components/trademark/AdvancedSearch.vue`

**Props:**
```typescript
interface Props {
  modelValue: SearchParams
}
```

**Emits:**
```typescript
{
  'update:modelValue': [value: SearchParams]
  search: []
}
```

**Features:**
- ✅ Two-way binding với v-model
- ✅ Collapsible advanced filters
- ✅ Filter summary badges
- ✅ Clear individual filters
- ✅ Clear all filters
- ✅ Smooth animations

---

## 🔧 Updated Types

### `SearchParams` Interface
```typescript
export interface SearchParams {
  q?: string                    // Số đơn hoặc tên nhãn hiệu
  class?: string                // Phân loại
  owner?: string                // Chủ đơn
  status?: string               // Trạng thái
  type?: 'trademark' | 'patent' // Loại
  page?: number                 // Trang hiện tại
  limit?: number                // Số kết quả mỗi trang
}
```

### New Types
```typescript
export type TrademarkStatus = 
  | 'granted'      // Cấp bằng
  | 'examining'    // Đang kiểm tra
  | 'cancelled'    // Hủy
  | 'expired'      // Hết hạn
  | 'rejected'     // Từ chối

export type IPType = 
  | 'trademark'    // Nhãn hiệu
  | 'patent'       // Sáng chế
```

---

## 📄 Updated Pages

### `search.vue`
**Changes:**
- ✅ Replaced simple search bar with `AdvancedSearch` component
- ✅ Updated to use `searchParams` object instead of separate refs
- ✅ URL query params include all filters
- ✅ Vietnamese translations
- ✅ Improved empty states
- ✅ Better pagination UI

---

## 🌐 API Integration

### Request Format
```typescript
GET /api/trademarks/search?
  q=Nike&
  owner=Nike Inc&
  status=granted&
  type=trademark&
  class=25&
  page=1&
  limit=12
```

### Response Format
```typescript
{
  data: Trademark[],
  total: number,
  page: number,
  limit: number,
  totalPages: number
}
```

---

## 💡 Usage Example

### Basic Search
```vue
<TrademarkAdvancedSearch
  v-model="searchParams"
  @search="handleSearch"
/>
```

### With Initial Values
```typescript
const searchParams = ref<SearchParams>({
  q: 'Nike',
  status: 'granted',
  type: 'trademark',
  page: 1,
  limit: 12
})
```

---

## ✨ Key Features

### 1. **Smart URL Management**
- All filters reflected in URL
- Shareable search URLs
- Browser back/forward support
- Deep linking support

### 2. **Filter Badges**
- Visual representation of active filters
- Quick remove individual filters
- Clear all filters button
- Color-coded badges

### 3. **Responsive Design**
- Mobile-first approach
- Adaptive grid layout
- Touch-friendly controls
- Optimized spacing

### 4. **Smooth Animations**
- Slide-up animation for advanced filters
- Fade-in for results
- Scale animation for cards
- Smooth transitions

---

## 🎯 User Flow

1. **User visits /search**
2. **Enters main search query** (số đơn/tên nhãn hiệu)
3. **Clicks "Nâng cao"** to expand filters
4. **Fills additional filters:**
   - Chủ đơn
   - Trạng thái
   - Loại (Nhãn hiệu/Sáng chế)
   - Phân loại
5. **Clicks "Tìm kiếm"**
6. **Views results** with active filter badges
7. **Can remove filters** individually or all at once
8. **Paginate through results**

---

## 📊 Benefits

### For Users:
- ✅ More precise search results
- ✅ Save time with advanced filters
- ✅ Better organization
- ✅ Easy to modify search criteria

### For Developers:
- ✅ Clean component architecture
- ✅ Type-safe with TypeScript
- ✅ Reusable component
- ✅ Easy to extend

---

## 🚀 Future Enhancements

Potential improvements:
- [ ] Date range filters (registration date, expiry date)
- [ ] Multi-select for status
- [ ] Autocomplete for owner names
- [ ] Save search presets
- [ ] Export search results
- [ ] Advanced sorting options

---

## 📝 Notes

- Tất cả text đã được Việt hóa
- Component hoàn toàn responsive
- Animations mượt mà và hiện đại
- Type-safe với TypeScript
- URL-friendly cho sharing

---

**Tính năng Advanced Search đã hoàn thành! 🎉**
