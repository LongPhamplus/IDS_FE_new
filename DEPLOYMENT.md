# 🚀 Deployment Guide - Trademark Search

Complete guide for deploying the Nuxt 4 Trademark Search application to production.

---

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] Build completes without errors
- [ ] TypeScript type checking passes
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] Dark mode working
- [ ] Authentication flow tested

---

## 🔧 Build Configuration

### 1. Update Environment Variables

Create production `.env`:

```env
NUXT_PUBLIC_API_BASE=https://your-production-api.com
NODE_ENV=production
```

### 2. Build for Production

```bash
npm run build
```

Expected output:
```
✔ Building client...
✔ Building server...
✔ Generated public .output/public
```

### 3. Test Production Build Locally

```bash
npm run preview
```

Visit: http://localhost:3000

---

## ☁️ Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero configuration for Nuxt
- Automatic deployments
- Edge network
- Free SSL
- Preview deployments

**Steps:**

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Set Environment Variables**
```bash
vercel env add NUXT_PUBLIC_API_BASE
# Enter: https://your-api.com
```

5. **Deploy to Production**
```bash
vercel --prod
```

**Configuration File** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nuxtjs"
}
```

---

### Option 2: Netlify

**Why Netlify?**
- Great for static sites
- Form handling
- Split testing
- Free tier

**Steps:**

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Build**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod
```

4. **Configure**
- Build command: `npm run build`
- Publish directory: `.output/public`

**Configuration File** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = ".output/public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: Docker

**Why Docker?**
- Consistent environments
- Easy scaling
- Self-hosted option

**Dockerfile:**
```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app files
COPY . .

# Build app
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start app
CMD ["node", ".output/server/index.mjs"]
```

**Build and Run:**
```bash
# Build image
docker build -t trademark-search .

# Run container
docker run -p 3000:3000 \
  -e NUXT_PUBLIC_API_BASE=https://your-api.com \
  trademark-search
```

**Docker Compose** (`docker-compose.yml`):
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NUXT_PUBLIC_API_BASE=https://your-api.com
      - NODE_ENV=production
    restart: unless-stopped
```

---

### Option 4: AWS (EC2 + Nginx)

**Steps:**

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.micro (free tier)
   - Open ports 80, 443, 22

2. **SSH into Instance**
```bash
ssh -i your-key.pem ubuntu@your-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Clone and Build**
```bash
git clone your-repo
cd trademark-search
npm install
npm run build
```

5. **Install PM2**
```bash
sudo npm install -g pm2
```

6. **Start App**
```bash
pm2 start .output/server/index.mjs --name trademark-search
pm2 save
pm2 startup
```

7. **Install Nginx**
```bash
sudo apt-get install nginx
```

8. **Configure Nginx** (`/etc/nginx/sites-available/trademark-search`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

9. **Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/trademark-search /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

10. **SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option 5: DigitalOcean App Platform

**Steps:**

1. **Connect GitHub Repository**
2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Run Command: `node .output/server/index.mjs`
3. **Set Environment Variables**
4. **Deploy**

---

## 🔐 Environment Variables

### Required Variables

```env
# API Base URL (REQUIRED)
NUXT_PUBLIC_API_BASE=https://api.yourapp.com

# Node Environment
NODE_ENV=production
```

### Optional Variables

```env
# Port (if not using default)
PORT=3000

# Analytics
NUXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry (Error Tracking)
NUXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## 📊 Performance Optimization

### 1. Enable Compression

In `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  nitro: {
    compressPublicAssets: true
  }
})
```

### 2. Image Optimization

Use `@nuxt/image`:
```bash
npm install @nuxt/image
```

```typescript
export default defineNuxtConfig({
  modules: ['@nuxt/image']
})
```

### 3. Caching Headers

In `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/api/**': { cors: true },
    '/assets/**': { headers: { 'cache-control': 'max-age=31536000' } }
  }
})
```

---

## 🔍 SEO Configuration

### Meta Tags

Already configured in `nuxt.config.ts`:
```typescript
app: {
  head: {
    title: 'Trademark Search',
    meta: [
      { name: 'description', content: 'Search and manage trademarks' },
      { property: 'og:title', content: 'Trademark Search' },
      { property: 'og:description', content: 'Search and manage trademarks' }
    ]
  }
}
```

### Sitemap

Install `@nuxtjs/sitemap`:
```bash
npm install @nuxtjs/sitemap
```

---

## 📈 Monitoring

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/vue
```

Create `plugins/sentry.client.ts`:
```typescript
import * as Sentry from '@sentry/vue'

export default defineNuxtPlugin((nuxtApp) => {
  Sentry.init({
    app: nuxtApp.vueApp,
    dsn: 'YOUR_SENTRY_DSN',
    environment: process.env.NODE_ENV
  })
})
```

### 2. Analytics (Google Analytics)

```bash
npm install @nuxtjs/google-analytics
```

---

## 🧪 Testing Before Deploy

### 1. Build Test
```bash
npm run build
```

### 2. Preview Test
```bash
npm run preview
```

### 3. Type Check
```bash
npx nuxi typecheck
```

### 4. Manual Testing
- [ ] All pages load
- [ ] Search works
- [ ] Login/logout works
- [ ] Favorites work
- [ ] Feedback sends
- [ ] Dark mode toggles
- [ ] Mobile responsive
- [ ] No console errors

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          NUXT_PUBLIC_API_BASE: ${{ secrets.API_BASE }}
          
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .nuxt node_modules
npm install
npm run build
```

### API Connection Issues

1. Check CORS settings on backend
2. Verify API_BASE URL
3. Check SSL certificates
4. Test API endpoints directly

### 404 Errors

Configure server to redirect all routes to index.html

---

## 📚 Post-Deployment

### 1. Test Production
- Visit your domain
- Test all features
- Check mobile
- Verify API calls

### 2. Monitor
- Check error logs
- Monitor performance
- Track analytics

### 3. Backup
- Database backups
- Code repository
- Environment variables

---

## ✅ Deployment Checklist

- [ ] Environment variables set
- [ ] Build successful
- [ ] Preview tested
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] API accessible
- [ ] All features working
- [ ] Mobile responsive
- [ ] SEO configured
- [ ] Analytics setup
- [ ] Error tracking enabled
- [ ] Monitoring active

---

## 🎉 Success!

Your Trademark Search application is now live! 🚀

**Next Steps:**
1. Share with users
2. Gather feedback
3. Monitor performance
4. Plan updates

---

**Need Help?**
- Check logs
- Review documentation
- Test locally first
- Verify environment variables
