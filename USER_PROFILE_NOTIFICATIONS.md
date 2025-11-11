# User Profile & Notifications System

## ✨ Tính Năng Mới

### 1. **Trang Profile** (`/profile`)
- Thông tin người dùng với avatar
- Thống kê: Saved trademarks, Searches, Notifications
- Hoạt động gần đây
- Quick actions menu
- Cài đặt tài khoản

### 2. **Hệ Thống Thông Báo**
- Store quản lý notifications
- Trang notifications (`/notifications`)
- Badge hiển thị số thông báo chưa đọc
- 4 loại thông báo: info, success, warning, error
- Mark as read/unread
- Delete notifications

### 3. **Demo Account**
- Email: `demo@example.com`
- Password: `password123`
- Auto-login với mock data
- Không cần backend API

## 📁 Files Created

### New Pages
1. **`/app/pages/profile.vue`**
   - User profile dashboard
   - Stats cards
   - Recent activity
   - Account settings
   - Quick actions sidebar

2. **`/app/pages/notifications.vue`**
   - Notifications list
   - Mark as read/unread
   - Delete notifications
   - Filter by type
   - Stats overview

### New Stores
3. **`/app/stores/notifications.ts`**
   - Notification state management
   - CRUD operations
   - Unread count getter
   - Mock data

### Modified Files
4. **`/app/stores/auth.ts`**
   - Added demo account check
   - Mock authentication for demo user
   - No API call for demo account

5. **`/app/components/layout/Navbar.vue`**
   - Added Notifications link
   - Added Profile link
   - Notification badge with unread count
   - Mobile menu updates

## 🎨 Profile Page Features

### User Info Card
- **Avatar**: Gradient circle with initial
- **Name & Email**: User details
- **Member Since**: Join date
- **Stats Grid**: 3 columns
  - Saved trademarks count
  - Searches count
  - Notifications count

### Quick Actions
- 📑 Saved Trademarks
- 🔍 Search
- 🔔 Notifications (with badge)
- 🚪 Logout

### Recent Activity
- Activity timeline
- Icons by type
- Timestamps (relative)
- 3 sample activities

### Account Settings
- Email notifications toggle
- Push notifications toggle
- Advanced settings button

## 🔔 Notifications System

### Notification Types
```typescript
type NotificationType = 'info' | 'success' | 'warning' | 'error'
```

### Notification Structure
```typescript
interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: string
  link?: string
}
```

### Icons & Colors
| Type | Icon | Color |
|------|------|-------|
| info | InformationCircle | Blue |
| success | CheckCircle | Green |
| warning | ExclamationTriangle | Yellow |
| error | XCircle | Red |

### Features
- ✅ Mark as read
- ✅ Mark all as read
- ✅ Delete notification
- ✅ Clear all
- ✅ Click to view details
- ✅ Relative timestamps
- ✅ Unread indicator (dot + pulse)

## 🎯 Demo Account

### Login Credentials
```
Email: demo@example.com
Password: password123
```

### Demo User Data
```typescript
{
  id: 'demo-user-1',
  email: 'demo@example.com',
  name: 'Demo User',
  createdAt: '2024-01-01T00:00:00.000Z'
}
```

### Authentication Flow
1. User enters demo credentials
2. Auth store checks email/password
3. If match, create mock token and user
4. Store in localStorage
5. Redirect to intended page

### Mock Notifications
- 4 sample notifications
- 2 unread, 2 read
- Various types and timestamps
- Links to trademark pages

## 🎨 UI Components

### Profile Stats Card
```vue
<div class="grid grid-cols-3 gap-4 text-center">
  <div>
    <div class="text-2xl font-bold text-primary-600">{{ count }}</div>
    <div class="text-xs text-gray-600">Label</div>
  </div>
</div>
```

### Notification Badge
```vue
<span class="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full animate-pulse">
  {{ unreadCount }}
</span>
```

### Activity Item
```vue
<div class="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
  <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
    <Icon class="h-5 w-5 text-primary-600" />
  </div>
  <div class="flex-1">
    <p class="font-medium">Title</p>
    <p class="text-sm text-gray-600">Message</p>
    <p class="text-xs text-gray-500">Time</p>
  </div>
</div>
```

## 🔧 Store Actions

### Notifications Store
```typescript
// Fetch notifications
await notificationStore.fetchNotifications()

// Mark as read
notificationStore.markAsRead(id)

// Mark all as read
notificationStore.markAllAsRead()

// Delete notification
notificationStore.deleteNotification(id)

// Clear all
notificationStore.clearAll()
```

### Getters
```typescript
// Unread count
notificationStore.unreadCount

// Unread notifications
notificationStore.unreadNotifications

// All notifications
notificationStore.allNotifications
```

## 📱 Navbar Integration

### Desktop
- Notifications link with badge
- Profile in user dropdown menu
- Badge animates (pulse) when unread

### Mobile
- Notifications in mobile menu
- Profile in mobile menu
- Badge shows unread count

## 🎯 Navigation Flow

### After Login
```
Login → Profile/Dashboard
```

### Quick Access
```
Navbar → Notifications → View/Mark Read
Navbar → Profile → View Stats/Settings
Profile → Quick Actions → Navigate
```

## 🎨 Styling

### Profile Page
- Max width: 7xl (1280px)
- Grid: 1 column mobile, 3 columns desktop
- Cards with shadow and hover effects
- Gradient avatar
- Smooth transitions

### Notifications Page
- Max width: 4xl (896px)
- List layout
- Border-left for unread
- Hover effects
- Icon badges with colors

## ⚡ Performance

### Lazy Loading
- Notifications fetched on mount
- Only when authenticated
- Cached in store

### Optimizations
- Computed properties for counts
- Reactive updates
- No unnecessary re-renders

## 🔐 Security

### Demo Account
- Client-side only
- No real API calls
- Mock token generation
- LocalStorage persistence

### Production
- Replace with real API
- JWT tokens
- Server validation
- Secure endpoints

## 🚀 Usage

### Access Profile
```vue
<NuxtLink to="/profile">Profile</NuxtLink>
```

### Access Notifications
```vue
<NuxtLink to="/notifications">Notifications</NuxtLink>
```

### Login with Demo
```typescript
await authStore.login({
  email: 'demo@example.com',
  password: 'password123'
})
```

## 🎉 Demo Flow

1. **Visit** `/login`
2. **Enter** demo credentials
3. **Login** → Redirected to home
4. **Click** Profile → View dashboard
5. **Click** Notifications → View 2 unread
6. **Mark** as read → Badge updates
7. **Navigate** via quick actions

## 🔮 Future Enhancements

- [ ] Real-time notifications (WebSocket)
- [ ] Notification preferences
- [ ] Email notifications
- [ ] Push notifications
- [ ] Notification categories
- [ ] Search history tracking
- [ ] Activity log
- [ ] Profile editing
- [ ] Avatar upload
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Export data
