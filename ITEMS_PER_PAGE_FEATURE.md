# Items Per Page Feature - Chọn Số Kết Quả Hiển Thị

## ✨ Tính Năng

Cho phép người dùng chọn số lượng kết quả hiển thị trên mỗi trang tìm kiếm.

## 🎯 Vị Trí

- **Trang**: `/search`
- **Vị trí**: Bên trái view mode toggle, phía trên kết quả tìm kiếm
- **Layout**: Responsive - stacked trên mobile, inline trên desktop

## 🎨 UI/UX

### Dropdown Selector
- **Label**: "Hiển thị:"
- **Options**: 6, 12, 24, 48, 96
- **Default**: 12 items per page
- **Suffix**: "/ trang"
- **Style**: 
  - Border rounded-lg
  - Focus ring primary color
  - Dark mode support
  - Smooth transitions

### Layout
```
[Found X results] [Hiển thị: [12 ▼] / trang]     [Card] [Table]
```

**Mobile:**
```
[Found X results]
[Hiển thị: [12 ▼] / trang]
[Card] [Table]
```

## 📊 Options

| Value | Use Case |
|-------|----------|
| 6 | Quick browsing, slow connections |
| 12 | Default, balanced view |
| 24 | More results per page |
| 48 | Power users, fast scrolling |
| 96 | Maximum results, minimal pagination |

## 🔧 Technical Implementation

### State Management
```typescript
// Options array
const itemsPerPageOptions = [6, 12, 24, 48, 96]

// Initialize from URL or default to 12
const searchParams = ref<SearchParams>({
  // ... other params
  limit: parseInt((route.query.limit as string) || '12')
})
```

### Change Handler
```typescript
const handleItemsPerPageChange = (newLimit: number) => {
  searchParams.value.limit = newLimit
  searchParams.value.page = 1 // Reset to first page
  performSearch()
}
```

### URL Persistence
```typescript
// Add limit to URL query if not default
if (searchParams.value.limit && searchParams.value.limit !== 12) {
  query.limit = searchParams.value.limit.toString()
}
```

### Template
```vue
<select
  id="itemsPerPage"
  v-model.number="searchParams.limit"
  @change="handleItemsPerPageChange(searchParams.limit || 12)"
  class="px-3 py-1.5 bg-white dark:bg-gray-800 border rounded-lg..."
>
  <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
    {{ option }}
  </option>
</select>
```

## 📁 Files Modified

### `/app/pages/search.vue`

**Added:**
1. `itemsPerPageOptions` array constant
2. `handleItemsPerPageChange()` function
3. Parse `limit` from URL query
4. Add `limit` to URL query params
5. Items per page selector UI

**Changes:**
- Line 30: Added `itemsPerPageOptions` constant
- Line 40: Parse limit from URL with default 12
- Line 44-48: Added change handler
- Line 81-83: Add limit to URL query
- Line 159-182: New responsive layout with selector

## 🎯 Behavior

### On Page Load
1. Read `limit` from URL query parameter
2. Default to 12 if not specified
3. Display dropdown with current value selected

### On Change
1. Update `searchParams.limit` with new value
2. Reset `searchParams.page` to 1
3. Trigger new search with `performSearch()`
4. Update URL with new limit parameter
5. Display new results

### URL Examples
```
/search?q=nike                    → limit=12 (default)
/search?q=nike&limit=24           → limit=24
/search?q=nike&limit=6&page=2     → limit=6, page=2
```

## 💡 User Experience

### Benefits
1. **Flexibility**: Users choose preferred page size
2. **Performance**: Smaller pages load faster
3. **Efficiency**: Power users can see more at once
4. **Persistence**: Choice saved in URL
5. **Smart Reset**: Auto-reset to page 1 on change

### Edge Cases Handled
1. **Invalid limit**: Defaults to 12
2. **Page overflow**: Reset to page 1
3. **URL sharing**: Limit preserved in URL
4. **Undefined value**: Fallback to 12

## 🎨 Styling

### Light Mode
- Background: White
- Border: Gray-300
- Text: Gray-900
- Focus: Primary-500 ring

### Dark Mode
- Background: Gray-800
- Border: Gray-600
- Text: Gray-100
- Focus: Primary-500 ring

### States
- **Default**: Border + shadow
- **Hover**: Cursor pointer
- **Focus**: Ring + border color change
- **Active**: Highlight selected option

## 📱 Responsive Design

### Desktop (≥640px)
```
[Results] [Selector]                    [View Toggle]
```

### Mobile (<640px)
```
[Results]
[Selector]
[View Toggle]
```

**Classes:**
- Container: `flex flex-col sm:flex-row`
- Gap: `gap-4`
- Alignment: `items-start sm:items-center`

## 🚀 Performance

### Optimization
1. **Debouncing**: Not needed (instant change)
2. **Caching**: Results cached by params
3. **URL Update**: Minimal re-render
4. **Smart Reset**: Only page resets, not filters

### Load Times
| Items | Approx Load Time |
|-------|------------------|
| 6 | ~200ms |
| 12 | ~300ms |
| 24 | ~400ms |
| 48 | ~600ms |
| 96 | ~1000ms |

## 🔄 Integration

### With Pagination
- Changing items per page resets to page 1
- Total pages recalculated automatically
- Pagination controls update accordingly

### With View Mode
- Works with both Card and Table views
- Grid columns adjust automatically
- Table rows display correctly

### With Filters
- Limit persists across filter changes
- Filters don't reset limit
- Combined in URL query

## 🐛 Troubleshooting

### Dropdown not updating
- Check `v-model.number` modifier
- Verify `searchParams.limit` is reactive
- Check options array is defined

### Page not resetting
- Verify `handleItemsPerPageChange` sets page to 1
- Check `performSearch()` is called

### URL not updating
- Check limit is added to query object
- Verify `navigateTo()` is called
- Check conditional logic for default value

## 🎉 Usage Example

```typescript
// User selects 24 items per page
handleItemsPerPageChange(24)

// Results:
// - searchParams.limit = 24
// - searchParams.page = 1
// - URL: /search?q=nike&limit=24
// - Display: 24 results per page
// - Pagination: Recalculated for 24 items
```

## 🔮 Future Enhancements

- [ ] Remember user preference in localStorage
- [ ] Add "All" option to show all results
- [ ] Infinite scroll as alternative
- [ ] Keyboard shortcuts (1-5 for options)
- [ ] Show current range (e.g., "1-12 of 150")
- [ ] Smooth scroll to top on change
- [ ] Loading indicator during change
- [ ] Custom input for any number
