# View Mode Feature - Card & Table View

## ✨ Tính Năng

Chuyển đổi giữa 2 chế độ hiển thị kết quả tìm kiếm:
- **Card View** (Dạng thẻ) - Hiển thị dạng grid với hình ảnh lớn
- **Table View** (Dạng bảng) - Hiển thị dạng bảng với nhiều thông tin

## 🎯 Vị Trí

Trang: `/search`
Toggle buttons nằm ở góc phải phía trên kết quả tìm kiếm

## 🎨 UI/UX

### Toggle Buttons
- Background: Gray rounded pill
- Active state: White background + Primary color text + Shadow
- Inactive state: Gray text + Hover effect
- Icons: Squares2X2Icon (Card) & TableCellsIcon (Table)
- Smooth transitions

### Card View
- Grid layout: 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- Hiển thị:
  - Hình ảnh lớn (192px height)
  - Tên nhãn hiệu
  - Owner, Class, Status, Registration Number
  - Bookmark button
  - View Details link
- Hover effects: Scale image, shadow

### Table View
- Responsive table với horizontal scroll
- Columns:
  - Image (64x64px thumbnail)
  - Name (clickable)
  - Owner
  - Class
  - Status (colored badge)
  - Registration Number
  - Actions (Bookmark + View link)
- Row hover effect

## 💾 Persistence

View mode được lưu vào `localStorage`:
- Key: `trademarkViewMode`
- Values: `'card'` | `'table'`
- Auto-load khi quay lại trang

## 📁 Files

### New Files
- `/app/components/trademark/TableView.vue` - Table view component

### Modified Files
- `/app/pages/search.vue` - Added view mode toggle and logic

## 🔧 Technical Details

### State Management
```typescript
const viewMode = ref<'card' | 'table'>('card')
```

### LocalStorage
```typescript
// Load on mount
onMounted(() => {
  if (process.client) {
    const savedViewMode = localStorage.getItem('trademarkViewMode')
    if (savedViewMode === 'card' || savedViewMode === 'table') {
      viewMode.value = savedViewMode
    }
  }
})

// Save on change
watch(viewMode, (newMode) => {
  if (process.client) {
    localStorage.setItem('trademarkViewMode', newMode)
  }
})
```

### Conditional Rendering
```vue
<!-- Card View -->
<div v-if="viewMode === 'card'" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  <TrademarkCard ... />
</div>

<!-- Table View -->
<div v-else-if="viewMode === 'table'">
  <TrademarkTableView :trademarks="trademarks" />
</div>
```

## 🎯 Benefits

1. **Flexibility** - Users choose preferred view
2. **Information Density** - Table shows more data at once
3. **Visual Appeal** - Card view for browsing with images
4. **Persistence** - Remembers user preference
5. **Responsive** - Both views work on mobile

## 🚀 Future Enhancements

- [ ] Add list view (compact)
- [ ] Column sorting in table view
- [ ] Column visibility toggle
- [ ] Export table to CSV
- [ ] Keyboard shortcuts (C for card, T for table)
- [ ] Transition animations between views
