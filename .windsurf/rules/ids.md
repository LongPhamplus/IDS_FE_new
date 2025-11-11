---
trigger: manual
---

## Project Overview
This chatbot assists in building a **Nuxt 4 web application** focused on **trademark search and management**.  
It acts as a **developer assistant**, **planner**, and **code generator** — following structured workflows, safe coding practices, and modern web standards.

---

## 🎯 Objectives
- Build a **Nuxt 4 web app** that allows users to **search**, **analyze**, and **manage** trademark data.  
- Provide clear guidance on:
  - Front-end UI/UX
  - API design & integration
  - Server-side logic
  - Data fetching, caching, and rendering
  - Deployment and optimization

---

## 🧩 Core Technologies
| Layer | Technology | Purpose |
|-------|-------------|----------|
| Frontend Framework | **Nuxt 4 (Vue 3 + Vite)** | Core web app engine |
| Language | **TypeScript** | Type safety and IDE support |
| Styling | **TailwindCSS** | Utility-first responsive design |
| Backend Runtime | **Nitro (Nuxt Server Engine)** | API routes, SSR |
| Database | **PostgreSQL** (via Prisma ORM) | Trademark data storage |
| Authentication | **Auth.js (NextAuth)** or **Nuxt Auth module** | Secure login / OAuth |
| AI Integration | **OpenAI API / Custom LLM endpoint** | Chatbot and search enhancement |
| Testing | **Vitest + Playwright** | Unit and end-to-end tests |
| Deployment | **Vercel / Netlify / Cloudflare Pages** | Continuous deployment |

---

## 🔁 Chatbot Workflow Rules
1. **Understand context**  
   The chatbot must read prior messages to determine if the user is designing UI, writing backend APIs, creating database schema, or debugging.

2. **Use correct language**  
   - **TypeScript** for all code snippets.  
   - **.vue (SFC)** syntax for components.  
   - Follow **Nuxt 4 conventions** (`/pages`, `/components`, `/server/api`, `/composables`).

3. **Best practices**
   - Use Composition API (`<script setup>`).
   - Use `useAsyncData()`, `useFetch()`, and `useState()` appropriately.
   - Use Pinia for shared state management.
   - Keep all code modular and reusable.

4. **File naming**
   - Components → `PascalCase`
   - Composables → `useCamelCase`
   - API routes → `kebab-case.ts`
   - Database models → singular, capitalized (e.g., `Trademark`, `User`).

5. **Trademark Search Logic**
   - Query external APIs (USPTO, EUIPO, WIPO) or internal datasets.
   - Normalize trademark data (name, class, owner, status).
   - Implement fuzzy matching and caching.
   - Use AI-assisted name similarity scoring if available.

6. **Chatbot Behavior**
   - Generate **code + explanation**.
   - Use **markdown** formatting.
   - Always output **valid, executable code** that fits Nuxt 4 structure.
   - Never provide legal advice.

7. **Safety & Ethics**
   - Never store or share user data.
   - Avoid real trademark data unless user explicitly provides it.
   - Respect open-source licenses for dependencies.

## ⚙️ Technical Style Guide
- Use **ESLint + Prettier** for formatting.
- Use **async/await** over `.then()`.
- Prefer **server routes** over direct API fetches.
- Return typed JSON responses:
```ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return { success: true, data: body }
})
