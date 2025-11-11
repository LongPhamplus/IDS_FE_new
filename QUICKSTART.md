# ⚡ Quick Start Guide

Get the Trademark Search application running in 5 minutes.

---

## 📋 Prerequisites Checklist

- [ ] Node.js 18.x or higher installed
- [ ] npm, pnpm, or yarn installed
- [ ] Backend API running (or mock data ready)
- [ ] Git installed (optional)

---

## 🚀 Installation Steps

### 1. Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 742 packages in 30s
```

---

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and set your API endpoint
# NUXT_PUBLIC_API_BASE=http://localhost:3001
```

**Default configuration:**
```env
NUXT_PUBLIC_API_BASE=http://localhost:3001
NODE_ENV=development
```

---

### 3. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
Nuxt 4.2.1 with Nitro 2.x
  
  ➜ Local:    http://localhost:3000/
  ➜ Network:  use --host to expose
```

---

### 4. Open in Browser

Navigate to: **http://localhost:3000**

---

## 🎯 First Steps

### Test the Application

1. **Home Page** - http://localhost:3000
   - See the landing page
   - Try the search bar

2. **Search** - http://localhost:3000/search
   - Enter a search query
   - Filter by class
   - View results

3. **Login** - http://localhost:3000/login
   - Use demo credentials:
     - Email: `demo@example.com`
     - Password: `password123`

4. **Saved** - http://localhost:3000/saved
   - View your favorites (requires login)

5. **Feedback** - http://localhost:3000/feedback
   - Send feedback (requires login)

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate

# Type check
npx nuxi typecheck
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Use a different port
PORT=3001 npm run dev
```

### API Connection Issues

1. Check `.env` file exists
2. Verify `NUXT_PUBLIC_API_BASE` is correct
3. Ensure backend API is running
4. Check browser console for errors

### Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear Nuxt cache
rm -rf .nuxt
npm run dev
```

---

## 📦 Backend API Setup

### Option 1: Use Existing Backend

Point to your backend API in `.env`:

```env
NUXT_PUBLIC_API_BASE=https://your-api.com
```

### Option 2: Mock API (Development)

Create a simple mock server:

```bash
# Install json-server
npm install -g json-server

# Create db.json with mock data
# Run mock server
json-server --watch db.json --port 3001
```

### Option 3: Nuxt Server Routes (Recommended for Demo)

Create mock endpoints in `/server/api/`:

```typescript
// server/api/trademarks/search.get.ts
export default defineEventHandler((event) => {
  return {
    data: [
      {
        id: '1',
        name: 'Example Trademark',
        class: '9',
        owner: 'Example Corp',
        status: 'Active'
      }
    ],
    total: 1,
    page: 1,
    limit: 12,
    totalPages: 1
  }
})
```

---

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
        600: '#your-color',
      }
    }
  }
}
```

### Change App Title

Edit `nuxt.config.ts`:

```typescript
app: {
  head: {
    title: 'Your App Name'
  }
}
```

### Add New Page

```bash
# Create new page
touch pages/my-page.vue
```

```vue
<script setup lang="ts">
// Page logic
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1>My New Page</h1>
  </div>
</template>
```

---

## 📱 Testing on Mobile

### Local Network Access

```bash
# Start with host flag
npm run dev -- --host
```

Access from mobile device:
```
http://YOUR_LOCAL_IP:3000
```

Find your local IP:
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

---

## 🚢 Production Deployment

### Build

```bash
npm run build
```

### Preview Locally

```bash
npm run preview
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod
```

---

## 📚 Next Steps

1. **Read the full README** - `/README.md`
2. **Explore features** - `/FEATURES.md`
3. **Check the code** - Browse `/pages`, `/components`, `/stores`
4. **Customize** - Modify colors, content, and features
5. **Deploy** - Ship to production

---

## 💡 Tips

- **Dark Mode** - Toggle in the navbar (moon/sun icon)
- **Favorites** - Login first, then bookmark trademarks
- **Search** - Use the search bar on home or `/search` page
- **Feedback** - Report issues via `/feedback` page
- **Mobile** - Fully responsive, test on different devices

---

## 🆘 Need Help?

- Check browser console for errors
- Review API endpoint configuration
- Verify backend is running
- Check network tab for failed requests
- Read error messages carefully

---

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Dev server running
- [ ] Home page loads
- [ ] Search works
- [ ] Login works
- [ ] Dark mode toggles
- [ ] Mobile responsive
- [ ] No console errors

---

**You're ready to go! 🎉**

Start building amazing trademark search experiences!
