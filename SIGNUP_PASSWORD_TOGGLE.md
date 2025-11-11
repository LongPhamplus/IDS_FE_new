# Signup Page & Password Toggle Feature

## ✨ Tính Năng Mới

### 1. **Trang Signup** (`/signup`)
- Form đăng ký với validation
- Các trường: Name, Email, Password, Confirm Password
- Password strength validation (min 6 characters)
- Password confirmation matching
- Scale transition effect
- Link đến trang login

### 2. **Password Toggle** (Ẩn/Hiện Mật Khẩu)
- Icon eye/eye-slash để toggle
- Hoạt động trên cả login và signup
- Smooth transition
- Accessible với keyboard

## 🎨 UI/UX Features

### Signup Page
- **Layout**: Centered card với max-width 448px
- **Animation**: Scale transition với bounce effect
- **Validation**: Real-time error messages
- **Fields**:
  - Name (text input)
  - Email (email input với validation)
  - Password (với toggle visibility)
  - Confirm Password (với toggle visibility)
- **Helper Text**: Password requirements (min 6 chars)
- **Links**: 
  - Login page link
  - Back to home link

### Password Toggle
- **Icon**: 
  - EyeIcon (khi password ẩn)
  - EyeSlashIcon (khi password hiện)
- **Position**: Absolute right, centered vertically
- **Hover Effect**: Color transition
- **Colors**:
  - Default: gray-400
  - Hover: gray-600 (light) / gray-300 (dark)

## 📁 Files Created/Modified

### New Files
1. **`/app/pages/signup.vue`**
   - Complete signup form
   - Password toggle for both password fields
   - Validation logic
   - Integration with auth store

### Modified Files
1. **`/app/pages/login.vue`**
   - Added password toggle
   - Updated signup link to `/signup`
   - Import EyeIcon and EyeSlashIcon

2. **`/app/stores/auth.ts`**
   - Added `register()` method
   - Same structure as login
   - Stores token and user after registration

## 🔧 Technical Implementation

### Password Toggle Logic
```vue
<script setup lang="ts">
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="relative">
    <input
      :type="showPassword ? 'text' : 'password'"
      class="input-field pr-12"
    />
    <button
      type="button"
      @click="togglePasswordVisibility"
      class="absolute right-3 top-1/2 -translate-y-1/2"
    >
      <EyeIcon v-if="!showPassword" class="h-5 w-5" />
      <EyeSlashIcon v-else class="h-5 w-5" />
    </button>
  </div>
</template>
```

### Validation Logic
```typescript
// Check all fields filled
if (!form.name || !form.email || !form.password || !form.confirmPassword) {
  error.value = 'Vui lòng điền đầy đủ thông tin'
  return
}

// Check password match
if (form.password !== form.confirmPassword) {
  error.value = 'Mật khẩu xác nhận không khớp'
  return
}

// Check password length
if (form.password.length < 6) {
  error.value = 'Mật khẩu phải có ít nhất 6 ký tự'
  return
}
```

### Auth Store Register Method
```typescript
async register(credentials: { name: string; email: string; password: string }) {
  this.loading = true
  this.error = null

  try {
    const config = useRuntimeConfig()
    const response = await $fetch<AuthResponse>('/api/register', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: credentials
    })

    this.token = response.token
    this.user = response.user

    // Store in localStorage
    if (process.client) {
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    }

    return response
  } catch (error: any) {
    this.error = error.data?.message || 'Registration failed'
    throw error
  } finally {
    this.loading = false
  }
}
```

## 🎯 Form Fields

### Signup Form
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | text | Yes | Non-empty |
| Email | email | Yes | Valid email format |
| Password | password | Yes | Min 6 characters |
| Confirm Password | password | Yes | Must match password |

### Login Form
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Email | email | Yes | Valid email format |
| Password | password | Yes | Non-empty |

## 🔐 Security Features

1. **Password Masking**: Default state is hidden
2. **Toggle Visibility**: User can choose to show/hide
3. **Autocomplete**: Proper autocomplete attributes
   - `new-password` for signup
   - `current-password` for login
4. **Client-side Validation**: Before API call
5. **Server-side Validation**: API should also validate

## 🎨 Styling Details

### Input Field with Toggle
```css
.input-field {
  /* Base input styles */
  padding-right: 3rem; /* pr-12 for icon space */
}

.toggle-button {
  position: absolute;
  right: 0.75rem; /* right-3 */
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af; /* gray-400 */
  transition: color 0.2s;
}

.toggle-button:hover {
  color: #4b5563; /* gray-600 */
}
```

## 🚀 Usage

### Navigate to Signup
```vue
<NuxtLink to="/signup">Sign up</NuxtLink>
```

### Navigate to Login
```vue
<NuxtLink to="/login">Login</NuxtLink>
```

### Toggle Password Programmatically
```typescript
// Show password
showPassword.value = true

// Hide password
showPassword.value = false

// Toggle
showPassword.value = !showPassword.value
```

## 📱 Responsive Design

- **Mobile**: Full width, stacked layout
- **Tablet**: Centered with max-width
- **Desktop**: Same as tablet

## ♿ Accessibility

1. **Labels**: All inputs have proper labels
2. **Type Button**: Toggle button is `type="button"` to prevent form submission
3. **Focus States**: Proper focus rings on inputs and buttons
4. **Keyboard Navigation**: Tab through all fields
5. **Screen Readers**: Icons have semantic meaning

## 🐛 Known Issues & Limitations

1. **Process.client Error**: TypeScript lint warning về `process.client`
   - **Solution**: Đã được Nuxt handle tự động, warning có thể ignore
   
2. **API Integration**: Hiện tại chưa có backend API
   - **Workaround**: API calls sẽ fail, cần implement backend hoặc mock

## 🎉 Demo Flow

### Signup Flow
1. User visits `/signup`
2. Fills in name, email, password, confirm password
3. Clicks eye icon to verify password
4. Submits form
5. Redirects to home or intended page

### Login Flow
1. User visits `/login`
2. Fills in email and password
3. Clicks eye icon to verify password
4. Submits form
5. Redirects to home or intended page

## 🔄 Future Enhancements

- [ ] Password strength indicator
- [ ] Social login (Google, Facebook)
- [ ] Email verification
- [ ] Forgot password flow
- [ ] Two-factor authentication
- [ ] Remember me functionality
- [ ] Auto-hide password after delay
- [ ] Caps lock warning
- [ ] Password requirements checklist
