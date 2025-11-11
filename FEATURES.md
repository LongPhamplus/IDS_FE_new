# 📋 Feature Documentation

Complete breakdown of all features implemented in the Trademark Search application.

---

## 🔍 1. Search Trademarks

### File: `/pages/search.vue`

**Description:** Advanced trademark search with filtering and pagination.

**Features:**
- **Search by query** - Enter trademark name or keywords
- **Filter by class** - Select from predefined trademark classes
- **Pagination** - Navigate through large result sets
- **URL state management** - Search parameters reflected in URL
- **Loading states** - Skeleton loaders during search
- **Empty states** - Friendly messages when no results found

**Components Used:**
- `TrademarkSearchBar` - Search input component
- `TrademarkCard` - Result display cards
- `LoadingSkeleton` - Loading animation
- `EmptyState` - No results display

**API Endpoint:**
```
GET /api/trademarks/search?q={query}&class={class}&page={page}&limit={limit}
```

**User Flow:**
1. User enters search query or selects class
2. Click search or press Enter
3. Loading skeleton appears
4. Results displayed in grid layout
5. Pagination controls at bottom

---

## 🧾 2. View Trademark Details

### File: `/pages/trademarks/[id].vue`

**Description:** Comprehensive trademark information page.

**Features:**
- **Full trademark details** - Name, class, owner, status
- **Registration information** - Number, dates, expiry
- **Status badge** - Color-coded status indicator
- **Save to favorites** - Quick bookmark button
- **Related trademarks** - Similar or connected marks
- **Feedback link** - Report issues with this trademark
- **Back navigation** - Return to search results

**Data Displayed:**
- Trademark name
- Current status (Active, Pending, Expired, Cancelled)
- Class number
- Owner name
- Registration number
- Registration date
- Expiry date
- Description
- Related trademarks

**API Endpoint:**
```
GET /api/trademarks/:id
```

**User Flow:**
1. Click trademark from search results
2. Navigate to detail page
3. View comprehensive information
4. Option to save to favorites
5. View related trademarks
6. Send feedback if needed

---

## 💾 3. Save Favorites

### Files: 
- `/pages/saved.vue` (UI)
- `/stores/favorites.ts` (State)

**Description:** Bookmark and manage favorite trademarks.

**Features:**
- **Authentication required** - Must be logged in
- **Optimistic UI updates** - Instant feedback
- **Persistent storage** - Saved across sessions
- **Quick toggle** - Add/remove from any trademark
- **Favorites count** - Badge in navigation
- **Refresh capability** - Manual sync with server

**Store Actions:**
- `fetchFavorites()` - Load user's favorites
- `addFavorite(trademark)` - Save a trademark
- `removeFavorite(id)` - Remove from favorites
- `isFavorite(id)` - Check if saved

**API Endpoints:**
```
GET /api/user/favorites
POST /api/user/favorites
DELETE /api/user/favorites/:id
```

**User Flow:**
1. User must be authenticated
2. Click bookmark icon on any trademark
3. Optimistic update (instant UI change)
4. API call in background
5. Rollback on error
6. View all saved in `/saved` page

---

## 💬 4. Send Feedback

### File: `/pages/feedback.vue`

**Description:** Submit feedback, bug reports, or feature requests.

**Features:**
- **Authentication required** - Protected route
- **Subject selection** - Predefined categories
- **Message input** - Detailed description
- **Trademark reference** - Link to specific trademark
- **Screenshot URL** - Attach visual evidence
- **Form validation** - Required fields and length
- **Success notification** - Confirmation message
- **Auto-reset** - Clear form after submission

**Feedback Types:**
- Bug Report
- Feature Request
- Data Issue
- General Feedback
- Other

**API Endpoint:**
```
POST /api/feedback
```

**Request Body:**
```typescript
{
  subject: string
  message: string
  trademarkId?: string
  screenshot?: string
}
```

**User Flow:**
1. Navigate to feedback page
2. Select subject category
3. Write detailed message
4. Optionally add trademark ID
5. Optionally add screenshot URL
6. Submit feedback
7. See success confirmation

---

## 🔐 5. Authentication

### Files:
- `/pages/login.vue` (UI)
- `/stores/auth.ts` (State)
- `/middleware/auth.ts` (Guard)
- `/middleware/guest.ts` (Guard)

**Description:** Secure user authentication system.

**Features:**
- **Token-based auth** - JWT Bearer tokens
- **LocalStorage persistence** - Stay logged in
- **Auto-initialization** - Restore session on load
- **Route protection** - Middleware guards
- **Redirect handling** - Return to intended page
- **Error handling** - Clear error messages
- **Demo credentials** - Testing support

**Store State:**
```typescript
{
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}
```

**Store Actions:**
- `login(credentials)` - Authenticate user
- `logout()` - Clear session
- `fetchUser()` - Get current user
- `initAuth()` - Restore from storage

**Protected Routes:**
- `/saved` - Favorites page
- `/feedback` - Feedback form

**API Endpoints:**
```
POST /api/login
GET /api/user
```

**User Flow:**
1. Visit protected route
2. Redirect to login if not authenticated
3. Enter credentials
4. Token stored in localStorage
5. Redirect to original destination
6. Subsequent requests include token

---

## 🌓 6. Dark Mode

### File: `/composables/useDarkMode.ts`

**Description:** System-wide dark mode support.

**Features:**
- **System preference detection** - Auto-detect OS setting
- **Manual toggle** - Switch in navbar
- **Persistent preference** - Saved in localStorage
- **Smooth transitions** - CSS animations
- **Class-based** - Tailwind dark mode
- **Global state** - useState composable

**Implementation:**
```typescript
const { isDark, toggleDarkMode, initDarkMode } = useDarkMode()
```

**Storage:**
- Key: `darkMode`
- Value: `'true'` | `'false'`

**CSS Classes:**
- Light: No class
- Dark: `class="dark"` on `<html>`

**User Flow:**
1. App loads
2. Check localStorage for preference
3. Fall back to system preference
4. Apply dark class if needed
5. User can toggle in navbar
6. Preference saved

---

## 🎨 7. UI Components

### Modal Component
**File:** `/components/ui/Modal.vue`

**Features:**
- Headless UI Dialog
- Backdrop overlay
- Smooth transitions
- Close button
- Click outside to close
- Keyboard accessible (ESC)

**Usage:**
```vue
<UiModal :isOpen="isOpen" title="Modal Title" @close="closeModal">
  <!-- Content -->
</UiModal>
```

---

### Loading Skeleton
**File:** `/components/ui/LoadingSkeleton.vue`

**Features:**
- Multiple types (card, list, detail)
- Configurable count
- Pulse animation
- Dark mode support

**Usage:**
```vue
<UiLoadingSkeleton :count="3" type="card" />
```

---

### Empty State
**File:** `/components/ui/EmptyState.vue`

**Features:**
- Icon support
- Title and description
- Action slot
- Multiple icon types

**Usage:**
```vue
<UiEmptyState 
  title="No results" 
  description="Try a different search"
  icon="search"
>
  <template #action>
    <button>Clear Filters</button>
  </template>
</UiEmptyState>
```

---

### Trademark Card
**File:** `/components/trademark/TrademarkCard.vue`

**Features:**
- Trademark information display
- Status badge with colors
- Favorite toggle button
- Click to view details
- Hover effects
- Responsive layout

**Props:**
```typescript
{
  trademark: Trademark
}
```

---

### Search Bar
**File:** `/components/trademark/SearchBar.vue`

**Features:**
- Search icon
- Placeholder text
- Enter key support
- Search button
- v-model binding
- Emit search event

**Props:**
```typescript
{
  modelValue: string
  placeholder?: string
}
```

---

## 🧭 8. Navigation

### Navbar
**File:** `/components/layout/Navbar.vue`

**Features:**
- Logo and branding
- Navigation links
- Dark mode toggle
- User menu dropdown
- Mobile responsive
- Favorites count badge
- Sticky positioning

**Navigation Items:**
- Search
- Saved (authenticated only)
- User menu (authenticated)
  - Send Feedback
  - Logout
- Login button (guest)

---

### Footer
**File:** `/components/layout/Footer.vue`

**Features:**
- Copyright notice
- Footer links
- Responsive layout
- Dark mode support

**Links:**
- About
- Privacy
- Terms

---

## 🛡️ 9. Middleware

### Auth Middleware
**File:** `/middleware/auth.ts`

**Purpose:** Protect authenticated routes

**Logic:**
1. Check if user is authenticated
2. Initialize auth if needed
3. Redirect to login if not authenticated
4. Pass redirect URL in query

**Usage:**
```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

---

### Guest Middleware
**File:** `/middleware/guest.ts`

**Purpose:** Prevent authenticated users from accessing guest pages

**Logic:**
1. Check if user is authenticated
2. Redirect to home if authenticated

**Usage:**
```vue
<script setup>
definePageMeta({
  middleware: 'guest'
})
</script>
```

---

## 📦 10. State Management

### Auth Store
**File:** `/stores/auth.ts`

**State:**
- `user` - Current user object
- `token` - JWT token
- `loading` - Request state
- `error` - Error messages

**Getters:**
- `isAuthenticated` - Boolean check
- `currentUser` - User object

**Actions:**
- `login()` - Authenticate
- `logout()` - Clear session
- `fetchUser()` - Get user data
- `initAuth()` - Restore session

---

### Favorites Store
**File:** `/stores/favorites.ts`

**State:**
- `favorites` - Array of trademarks
- `loading` - Request state
- `error` - Error messages

**Getters:**
- `isFavorite(id)` - Check if saved
- `favoritesCount` - Total count

**Actions:**
- `fetchFavorites()` - Load favorites
- `addFavorite()` - Save trademark
- `removeFavorite()` - Delete favorite
- `clearFavorites()` - Reset state

---

## 🔧 11. Composables

### useApi
**File:** `/composables/useApi.ts`

**Methods:**
- `searchTrademarks(params)` - Search API
- `getTrademarkById(id)` - Get details
- `sendFeedback(feedback)` - Submit feedback

**Features:**
- Auto-inject auth headers
- Error handling
- Type-safe responses

---

### useDarkMode
**File:** `/composables/useDarkMode.ts`

**Methods:**
- `toggleDarkMode()` - Switch theme
- `initDarkMode()` - Initialize on load

**State:**
- `isDark` - Boolean reactive state

---

## 📱 12. Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Features:**
- Hamburger menu
- Stacked layouts
- Touch-friendly buttons
- Optimized spacing

**Desktop Features:**
- Multi-column grids
- Hover effects
- Larger typography
- Expanded navigation

---

## ♿ 13. Accessibility

**Features:**
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support
- Semantic HTML
- Color contrast (WCAG AA)

**Headless UI Benefits:**
- Built-in accessibility
- Keyboard shortcuts
- Focus management
- ARIA attributes

---

## 🎯 Summary

**Total Pages:** 9
**Total Components:** 8
**Total Stores:** 2
**Total Composables:** 2
**Total Middleware:** 2

**All User Stories:** ✅ Implemented
**Dark Mode:** ✅ Supported
**Authentication:** ✅ Complete
**Responsive:** ✅ Mobile-first
**Accessible:** ✅ WCAG compliant
**Type-safe:** ✅ Full TypeScript
