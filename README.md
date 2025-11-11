# 🔍 Trademark Search - Nuxt 4 Frontend

A modern, full-featured trademark search application built with **Nuxt 4**, **TypeScript**, **TailwindCSS**, and **Pinia**. This frontend integrates with a backend API to provide comprehensive trademark search, management, and feedback capabilities.

![Nuxt 4](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css)
![Pinia](https://img.shields.io/badge/Pinia-2.x-FFD859?logo=pinia)

---

## ✨ Features

### 🔍 **Search Trademarks**
- Advanced search by name, class, or owner
- Real-time filtering and pagination
- Detailed search results with status indicators

### 🧾 **View Trademark Details**
- Comprehensive trademark information
- Registration details and dates
- Related trademarks discovery

### 💾 **Save Favorites**
- Bookmark trademarks for quick access
- Optimistic UI updates
- Protected route (requires authentication)

### 💬 **Send Feedback**
- Report issues or suggest improvements
- Reference specific trademarks
- Attach screenshots

### 🔐 **Authentication**
- Secure login system
- Token-based authentication
- Protected routes with middleware

### 🌓 **Dark Mode**
- System preference detection
- Persistent user preference
- Smooth transitions

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **pnpm** or **yarn**
- Backend API running (default: `http://localhost:3001`)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ids

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your API endpoint in .env
# NUXT_PUBLIC_API_BASE=http://localhost:3001
```

### Development

```bash
# Start development server
npm run dev

# Server will start at http://localhost:3000
```

### Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site (optional)
npm run generate
```

---

## 📁 Project Structure

```
ids/
├── assets/
│   └── css/
│       └── main.css              # Global styles & Tailwind
├── components/
│   ├── layout/
│   │   ├── Navbar.vue            # Main navigation
│   │   └── Footer.vue            # Footer component
│   ├── trademark/
│   │   ├── TrademarkCard.vue     # Trademark display card
│   │   └── SearchBar.vue         # Search input component
│   └── ui/
│       ├── Modal.vue             # Reusable modal
│       ├── LoadingSkeleton.vue   # Loading states
│       └── EmptyState.vue        # Empty state displays
├── composables/
│   ├── useApi.ts                 # API calls composable
│   └── useDarkMode.ts            # Dark mode management
├── layouts/
│   └── default.vue               # Default layout
├── middleware/
│   ├── auth.ts                   # Authentication guard
│   └── guest.ts                  # Guest-only guard
├── pages/
│   ├── index.vue                 # Home page
│   ├── login.vue                 # Login page
│   ├── search.vue                # Search page
│   ├── saved.vue                 # Saved trademarks
│   ├── feedback.vue              # Feedback form
│   ├── trademarks/
│   │   └── [id].vue              # Trademark details
│   ├── about.vue                 # About page
│   ├── privacy.vue               # Privacy policy
│   └── terms.vue                 # Terms of service
├── stores/
│   ├── auth.ts                   # Authentication store
│   └── favorites.ts              # Favorites store
├── types/
│   └── index.ts                  # TypeScript types
├── nuxt.config.ts                # Nuxt configuration
├── tailwind.config.js            # Tailwind configuration
└── package.json
```

---

## 🎨 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Nuxt 4** | Vue.js framework with SSR/SSG |
| **TypeScript** | Type-safe development |
| **TailwindCSS** | Utility-first CSS framework |
| **Pinia** | State management |
| **@headlessui/vue** | Accessible UI components |
| **@heroicons/vue** | Beautiful SVG icons |

---

## 🔌 API Integration

### Backend Endpoints

The application expects the following backend endpoints:

#### Authentication
- `POST /api/login` - User login
- `GET /api/user` - Get current user

#### Trademarks
- `GET /api/trademarks/search?q=` - Search trademarks
- `GET /api/trademarks/:id` - Get trademark details

#### Favorites
- `GET /api/user/favorites` - Get user favorites
- `POST /api/user/favorites` - Add favorite
- `DELETE /api/user/favorites/:id` - Remove favorite

#### Feedback
- `POST /api/feedback` - Send feedback

### Configuration

Set your API base URL in `.env`:

```env
NUXT_PUBLIC_API_BASE=http://localhost:3001
```

---

## 🎯 User Stories Implementation

### ✅ Search Trademarks
**Location:** `/pages/search.vue`
- Search by name or class
- Pagination support
- Real-time filtering
- Loading skeletons

### ✅ View Trademark Details
**Location:** `/pages/trademarks/[id].vue`
- Detailed information display
- Related trademarks
- Save to favorites
- Feedback link

### ✅ Save Favorites
**Location:** `/pages/saved.vue` + `stores/favorites.ts`
- Authentication required
- Optimistic UI updates
- Persistent storage
- Quick access

### ✅ Send Feedback
**Location:** `/pages/feedback.vue`
- Subject selection
- Message input
- Optional trademark reference
- Success confirmation

### ✅ Authentication
**Location:** `/pages/login.vue` + `stores/auth.ts`
- Token-based auth
- LocalStorage persistence
- Route protection
- Auto-initialization

---

## 🎨 UI/UX Features

### Design Principles
- **Mobile-first** responsive design
- **Clean** and spacious layout
- **Accessible** components (ARIA-compliant)
- **Fast** loading with skeletons
- **Intuitive** navigation

### Dark Mode
- System preference detection
- Manual toggle in navbar
- Persistent user choice
- Smooth color transitions

### Components
- **Modal** - Accessible dialogs
- **LoadingSkeleton** - Loading states
- **EmptyState** - Friendly empty views
- **TrademarkCard** - Consistent display
- **SearchBar** - Enhanced search input

---

## 🔒 Authentication Flow

1. User visits protected route (e.g., `/saved`)
2. Middleware checks authentication
3. If not authenticated → redirect to `/login`
4. User logs in → token stored in localStorage
5. Redirect to original destination
6. Subsequent requests include Bearer token

---

## 🛠️ Development Guide

### Adding a New Page

```bash
# Create page file
touch pages/my-page.vue
```

```vue
<script setup lang="ts">
// Page logic
</script>

<template>
  <div>
    <!-- Page content -->
  </div>
</template>
```

### Creating a Component

```bash
# Create component
touch components/MyComponent.vue
```

```vue
<script setup lang="ts">
interface Props {
  // Define props
}

const props = defineProps<Props>()
</script>

<template>
  <!-- Component template -->
</template>
```

### Adding a Store

```typescript
// stores/myStore.ts
import { defineStore } from 'pinia'

export const useMyStore = defineStore('myStore', {
  state: () => ({
    // State
  }),
  getters: {
    // Getters
  },
  actions: {
    // Actions
  }
})
```

---

## 🧪 Testing

```bash
# Run type checking
npm run build

# Check for TypeScript errors
npx nuxi typecheck
```

---

## 📝 Environment Variables

```env
# API Configuration
NUXT_PUBLIC_API_BASE=http://localhost:3001

# Application
NODE_ENV=development
```

---

## 🚢 Deployment

### Vercel / Netlify

```bash
# Build command
npm run build

# Output directory
.output/public
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

---

## 📚 Resources

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Headless UI Documentation](https://headlessui.com/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ using Nuxt 4, TypeScript, and TailwindCSS

---

## 🎉 Demo Credentials

For testing purposes:

```
Email: demo@example.com
Password: password123
```

**Note:** These credentials are for demonstration only. Replace with your actual authentication system.
