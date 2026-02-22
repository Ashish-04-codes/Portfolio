<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# The Daily Developer

A newspaper-themed personal portfolio & blog CMS built with React, TypeScript, and Firebase.

## ✨ Features

- **Newspaper Design** — Vintage newsprint aesthetic with custom typography, paper textures, and editorial layouts
- **Admin CMS** — Full CRUD for projects, blog posts, skills, profile, and site config
- **Firebase Auth** — Secure admin login with session management and rate limiting
- **Cloudinary Uploads** — Image uploads for projects, blog posts, and profile
- **Dark Mode** — OS-aware theme with persistent preference
- **Responsive** — Mobile-first design with collapsible navigation
- **Accessible** — Keyboard navigation, skip links, ARIA labels, screen reader support

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Routing | React Router v6 (lazy-loaded pages) |
| Styling | Tailwind CSS 3 |
| Auth | Firebase Auth |
| Storage | localStorage (Firestore migration planned) |
| Images | Cloudinary |
| Build | Vite 6 |
| Testing | Vitest + React Testing Library |
| Linting | ESLint + Prettier |
| CI/CD | GitHub Actions |

## 🚀 Quick Start

**Prerequisites:** Node.js 20+

1. Clone and install:
   ```bash
   git clone https://github.com/your-username/the-daily-developer.git
   cd the-daily-developer
   npm install
   ```

2. Create `.env.local` with your credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm test` | Run tests |
| `npm run type-check` | TypeScript type checking |

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/       # Admin UI components (Button, Card, Modal, etc.)
│   └── common/      # Shared components (Header, Footer, Navigation)
├── config/          # Firebase config, route mappings
├── hooks/           # Custom hooks (useTheme, useAppNavigate, etc.)
├── layouts/         # PublicLayout, AdminLayoutWrapper
├── models/          # TypeScript data models
├── pages/           # Page components (lazy-loaded)
│   └── admin/       # Admin page components
├── services/        # Data services (CRUD, auth, storage)
├── utils/           # Helpers, logger
├── App.tsx          # Root app with BrowserRouter
└── AppRouter.tsx    # Route tree with code splitting
```

## 📄 Additional Docs

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture overview |
| [CMS-GUIDE.md](./CMS-GUIDE.md) | Admin CMS usage guide |
| [FIREBASE-CLOUDINARY-SETUP.md](./FIREBASE-CLOUDINARY-SETUP.md) | Firebase & Cloudinary setup instructions |
| [SECURITY.md](./SECURITY.md) | Security implementation details |
| [QUICK-START.md](./QUICK-START.md) | Detailed quick start guide |
| [PORTFOLIO_EDITING_GUIDE.md](./PORTFOLIO_EDITING_GUIDE.md) | Guide for editing portfolio content |

## 📝 License

MIT
