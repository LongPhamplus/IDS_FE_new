# Page Transitions - Hiệu Ứng Chuyển Trang

## ✨ Tổng Quan

Ứng dụng sử dụng Vue's transition system để tạo hiệu ứng mượt mà khi chuyển trang.

## 🎨 Các Loại Transitions

### 1. **Page Transition** (Mặc định)
- **Effect**: Slide từ phải sang trái
- **Duration**: 0.3s
- **Easing**: ease
- **Usage**: Tất cả các trang (default)

```css
.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
```

### 2. **Slide Up Transition**
- **Effect**: Trượt từ dưới lên
- **Duration**: 0.4s
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Usage**: Trang chi tiết trademark

```css
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
```

### 3. **Scale Transition**
- **Effect**: Phóng to/thu nhỏ với bounce
- **Duration**: 0.3s
- **Easing**: cubic-bezier(0.34, 1.56, 0.64, 1)
- **Usage**: Trang login/register

```css
.scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.scale-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
```

### 4. **Fade Transition**
- **Effect**: Chỉ fade in/out
- **Duration**: 0.3s
- **Easing**: ease
- **Usage**: Có thể dùng cho modal, overlay

```css
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### 5. **Rotate Transition**
- **Effect**: Xoay nhẹ + scale
- **Duration**: 0.4s
- **Easing**: ease
- **Usage**: Có thể dùng cho trang đặc biệt

```css
.rotate-enter-from {
  opacity: 0;
  transform: rotate(-5deg) scale(0.95);
}
.rotate-leave-to {
  opacity: 0;
  transform: rotate(5deg) scale(0.95);
}
```

## 🔧 Cách Sử Dụng

### Global Transition (app.vue)
```vue
<template>
  <NuxtLayout>
    <NuxtPage :transition="{
      name: 'page',
      mode: 'out-in'
    }" />
  </NuxtLayout>
</template>
```

### Custom Transition Per Page
```vue
<script setup lang="ts">
definePageMeta({
  pageTransition: {
    name: 'slide-up',
    mode: 'out-in'
  }
})
</script>
```

### Disable Transition
```vue
<script setup lang="ts">
definePageMeta({
  pageTransition: false
})
</script>
```

## 📁 Files Modified

### 1. `/app/assets/css/main.css`
- Thêm CSS cho tất cả transitions
- 5 loại transitions: page, slide-up, fade, scale, rotate

### 2. `/app/app.vue`
- Cấu hình global page transition
- Mode: 'out-in' (trang cũ biến mất trước, trang mới xuất hiện sau)

### 3. `/app/pages/trademarks/[id].vue`
- Custom transition: slide-up
- Hiệu ứng trượt từ dưới lên cho trang chi tiết

### 4. `/app/pages/login.vue`
- Custom transition: scale
- Hiệu ứng phóng to với bounce

## 🎯 Transition Modes

### `out-in`
- Trang cũ biến mất hoàn toàn trước
- Sau đó trang mới xuất hiện
- **Ưu điểm**: Không bị chồng chéo
- **Nhược điểm**: Có khoảng trống giữa 2 trang

### `in-out`
- Trang mới xuất hiện trước
- Sau đó trang cũ biến mất
- **Ưu điểm**: Mượt mà hơn
- **Nhược điểm**: Có thể bị chồng chéo

### Default (no mode)
- Cả 2 trang transition cùng lúc
- **Ưu điểm**: Nhanh nhất
- **Nhược điểm**: Dễ bị chồng chéo

## 🎨 Best Practices

1. **Consistency**: Dùng cùng transition cho các trang cùng loại
2. **Duration**: Giữ transitions ngắn (0.3-0.4s)
3. **Easing**: Dùng ease-in-out cho smooth transitions
4. **Mode**: Dùng 'out-in' để tránh chồng chéo
5. **Performance**: Chỉ animate opacity và transform

## 🚀 Advanced Usage

### JavaScript Hooks
```vue
<script setup lang="ts">
definePageMeta({
  pageTransition: {
    name: 'page',
    mode: 'out-in',
    onBeforeEnter: (el) => {
      console.log('Before enter')
    },
    onEnter: (el, done) => {
      // Custom animation
      done()
    },
    onAfterEnter: (el) => {
      console.log('After enter')
    }
  }
})
</script>
```

### Dynamic Transitions
```vue
<script setup lang="ts">
const route = useRoute()

const pageTransition = computed(() => {
  if (route.path.includes('trademark')) {
    return { name: 'slide-up', mode: 'out-in' }
  }
  return { name: 'page', mode: 'out-in' }
})

definePageMeta({
  pageTransition: pageTransition
})
</script>
```

## 📊 Performance

- **GPU Acceleration**: Sử dụng transform và opacity
- **Will-change**: Tự động được browser optimize
- **No Layout Shift**: Transitions không gây layout shift
- **Smooth 60fps**: Tất cả transitions chạy ở 60fps

## 🐛 Troubleshooting

### Transition không hoạt động
1. Check CSS đã import trong `main.css`
2. Check `app.vue` có cấu hình transition
3. Check browser console có lỗi không

### Transition bị giật
1. Giảm duration
2. Dùng transform thay vì position
3. Thêm `will-change: transform, opacity`

### Transition bị chồng chéo
1. Dùng mode: 'out-in'
2. Tăng duration một chút
3. Check z-index của các elements

## 🎉 Demo

Để xem transitions hoạt động:
1. Chạy `npm run dev`
2. Navigate giữa các trang
3. Quan sát hiệu ứng chuyển trang mượt mà

**Trang nào có transition đặc biệt:**
- `/trademarks/[id]` - Slide up
- `/login` - Scale with bounce
- Các trang khác - Default slide
