# Blog Management System

> A full-stack MERN blog platform with role-based access, JWT authentication, post management, search & pagination, comment system, and a polished modern UI.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Setup & Installation](#setup--installation)
6. [Environment Variables](#environment-variables)
7. [Running the Application](#running-the-application)
8. [API Reference](#api-reference)
9. [Frontend Architecture](#frontend-architecture)
10. [React Patterns Used](#react-patterns-used)
11. [Security Measures](#security-measures)
12. [Architectural Decisions](#architectural-decisions)
13. [Potential Improvements](#potential-improvements)

---

## Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Frontend  | React 18, React Router v6, Axios              |
| Backend   | Node.js, Express.js                           |
| Database  | MongoDB (Mongoose ODM)                        |
| Auth      | JWT (access + refresh tokens), bcryptjs       |
| Validation| Joi (backend), custom hooks (frontend)        |
| Styling   | Pure CSS with CSS custom properties (no framework) |

---

## Features

### Authentication
- Register and login with JWT access + refresh token pair
- Refresh token rotation — each refresh issues a new pair, old one invalidated
- Show/hide password toggle on all password fields
- Real-time password strength meter (Weak → Fair → Good → Strong)
- Password rule checklist (8+ chars, uppercase, lowercase, number)
- Persistent error messages that stay visible until user corrects input
- Auto token refresh on 401 via Axios response interceptor

### Role-Based Access Control
- **Author** — create/edit/delete their own posts, comment on published posts
- **Admin** — manage all posts on the platform, view site statistics, delete any comment
- Protected routes with role checking via `<ProtectedRoute>` component and `withAuth` HOC

### Post Management
- Create, edit, delete posts with title, content, excerpt, tags, status
- Publish / unpublish toggle (draft ↔ published)
- Rich form with live word count and estimated read time
- "Save & Publish" one-click shortcut
- Optimistic create — post appears immediately before server confirms
- Discard confirmation when navigating away with unsaved changes

### Public Blog
- View all published posts — no login required
- Full-text search (MongoDB `$text` index on title, content, tags)
- Filter by status (dashboard) and sort options
- Debounced search input (400ms) to avoid excessive API calls
- Server-side pagination with `page`, `limit`, `totalPages`

### Comments
- Authenticated users can comment on published posts
- Post author or admin can delete any comment
- Optimistic comment add / rollback on failure

### Admin Statistics
- Total posts, published count, drafts count
- Total comments and total users
- Top 5 authors by published post count (MongoDB aggregation pipeline)
- 5 most recently published posts
- Refresh button with loading state

### UI / UX
- Custom toast notification system (success / error / warning / info)
- Skeleton loading placeholders on all data-heavy views
- Custom animated ConfirmDialog for all destructive actions
- Responsive navbar with hamburger mobile menu
- Dark hero sections with glassmorphism navbar
- Role-specific post card views (public / author / admin)
- Color-coded status bars on post cards (published vs draft)
- Error boundaries catching rendering crashes
- Accessible form labels, ARIA attributes on interactive elements

---

## Project Structure

```
Blog Management System/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # register, login, refresh, logout, getMe
│   │   ├── postController.js      # CRUD + search + pagination + status toggle
│   │   ├── commentController.js   # get, add, delete comments
│   │   └── statsController.js     # aggregation pipeline stats
│   ├── middleware/
│   │   ├── auth.js                # protect (JWT verify), authorizeRoles factory
│   │   └── validate.js            # Joi schemas + validate() middleware factory
│   ├── models/
│   │   ├── User.js                # name, email, password (bcrypt), role, refreshTokens[]
│   │   ├── Post.js                # title, content, author ref, status, tags, text index
│   │   └── Comment.js             # content, author ref, post ref
│   ├── routes/
│   │   ├── auth.js                # /api/auth/*
│   │   ├── posts.js               # /api/posts/*
│   │   ├── comments.js            # /api/posts/:id/comments/*
│   │   └── stats.js               # /api/stats/*
│   ├── utils/
│   │   └── tokens.js              # generateAccessToken, generateRefreshToken, verifyRefreshToken
│   ├── .env                       # environment variables (not committed)
│   ├── .env.example               # environment variable template
│   ├── package.json
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js                 # Router + providers + React.lazy routes
        ├── styles.css             # Global CSS design system
        │
        ├── constants/
        │   └── index.js           # Routes, roles, password rules, avatar colours
        │
        ├── context/
        │   ├── AuthContext.js     # Auth state + login/register/logout actions
        │   ├── PostContext.js     # Post list state + CRUD + optimistic updates
        │   └── ToastContext.js    # Global toast notification system
        │
        ├── hooks/
        │   ├── useAuth.js         # Consumes AuthContext
        │   ├── usePosts.js        # Consumes PostContext
        │   ├── useApi.js          # Generic one-off API call hook (loading/error/data)
        │   ├── useComments.js     # Comment CRUD with optimistic add/delete
        │   └── useConfirm.js      # Controls ConfirmDialog open/close/callback state
        │
        ├── hoc/
        │   └── withAuth.js        # Higher-order component for auth + role guards
        │
        ├── components/
        │   ├── auth/
        │   │   ├── AuthIllustrationPanel.js  # Shared dark left panel (Login + Register)
        │   │   ├── Login.js
        │   │   └── Register.js
        │   │
        │   ├── common/
        │   │   ├── ErrorBoundary.js   # React class error boundary
        │   │   ├── Pagination.js      # Numbered page buttons (memoised)
        │   │   ├── ProtectedRoute.js  # Route guard with role check
        │   │   ├── SkeletonCard.js    # Shimmer skeleton placeholders
        │   │   └── Toast.js           # Animated toast notification container
        │   │
        │   ├── layout/
        │   │   └── Navbar.js          # Glassmorphism sticky nav + mobile hamburger
        │   │
        │   ├── posts/
        │   │   ├── PostCard.js        # Role-aware card (public/author/admin views)
        │   │   ├── PostList.js        # Search + filter + pagination grid
        │   │   ├── PostEditor.js      # Create/edit form with word count
        │   │   ├── PostDetail.js      # Full post view with management actions
        │   │   ├── CommentsSection.js # Self-contained comment feed
        │   │   ├── CommentItem.js     # Single comment row (memoised)
        │   │   └── CommentForm.js     # Add comment form (memoised)
        │   │
        │   └── ui/                    # Reusable atom component library
        │       ├── Avatar.js          # Initials avatar with deterministic colour
        │       ├── ConfirmDialog.js   # Animated delete confirmation modal
        │       ├── EmptyState.js      # Empty content placeholder
        │       ├── FormField.js       # Label + input + error/hint wrapper
        │       ├── LoadingButton.js   # Button with inline loading spinner
        │       ├── PageHeader.js      # Title + subtitle + action slot
        │       ├── PasswordInput.js   # Input with show/hide toggle
        │       ├── PasswordStrengthMeter.js  # Live strength bar + rule checklist
        │       ├── StatusBadge.js     # Published / Draft badge
        │       └── index.js           # Barrel export
        │
        ├── pages/
        │   ├── Home.js            # Public blog with hero section
        │   ├── Dashboard.js       # Author/admin post management
        │   ├── AdminPanel.js      # Site statistics (admin only)
        │   └── NotFound.js        # 404 page
        │
        └── utils/
            ├── api.js             # Axios instance + interceptors + all API calls
            └── helpers.js         # formatDate, truncate, generateExcerpt, parseTags, getErrorMessage
```

---

## Prerequisites

- **Node.js** v18+
- **npm** v9+
- **MongoDB** — local install or [MongoDB Atlas](https://cloud.mongodb.com) free tier

---

## Setup & Installation

### 1. Clone / Download

```bash
cd "Blog Management System"
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `backend/.env` with your values (see [Environment Variables](#environment-variables) below).

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Environment Variables

All variables live in `backend/.env`:

| Variable                | Required | Description                                      | Example                                 |
|-------------------------|----------|--------------------------------------------------|-----------------------------------------|
| `MONGO_URI`             | ✅        | MongoDB connection string                        | `mongodb+srv://user:pass@cluster.../db` |
| `JWT_SECRET`            | ✅        | Secret for signing access tokens                 | Any long random string                  |
| `JWT_REFRESH_SECRET`    | ✅        | Secret for signing refresh tokens (different!)   | Any long random string                  |
| `JWT_EXPIRES_IN`        | ➖        | Access token lifetime (default: `15m`)           | `15m`, `1h`                             |
| `JWT_REFRESH_EXPIRES_IN`| ➖        | Refresh token lifetime (default: `7d`)           | `7d`, `30d`                             |
| `PORT`                  | ➖        | Server port (default: `5001`)                    | `5001`                                  |
| `CLIENT_URL`            | ➖        | Frontend URL for CORS (default: `http://localhost:3000`) | `http://localhost:3001`         |

**Generate secure secrets:**
```bash
node -e "const c=require('crypto'); console.log(c.randomBytes(64).toString('hex')); console.log(c.randomBytes(64).toString('hex'));"
```

**Frontend environment** (`frontend/.env`):

| Variable            | Description                         |
|---------------------|-------------------------------------|
| `REACT_APP_API_URL` | Backend API base URL                |

```
REACT_APP_API_URL=http://localhost:5001/api
```

---

## Running the Application

Open **two terminal windows**:

**Terminal 1 — Backend**
```bash
cd backend
npm run dev        # development (nodemon auto-reload)
# or
npm start          # production
```

Expected output:
```
Server running on port 5001
MongoDB connected: <host>
```

**Terminal 2 — Frontend**
```bash
cd frontend
PORT=3001 npm start    # or just: npm start
```

App opens at **http://localhost:3001** (or 3000 if available).

> **Note for macOS users:** Port 5000 is occupied by AirPlay Receiver. The backend is pre-configured to use **port 5001**.

---

## API Reference

### Authentication — `/api/auth`

| Method | Endpoint         | Auth     | Description                              |
|--------|------------------|----------|------------------------------------------|
| POST   | `/register`      | Public   | Create account, returns token pair       |
| POST   | `/login`         | Public   | Authenticate, returns token pair         |
| POST   | `/refresh`       | Public   | Exchange refresh token for new pair      |
| POST   | `/logout`        | Required | Invalidate refresh token                 |
| GET    | `/me`            | Required | Get current user profile                 |

**Login response:**
```json
{
  "user": { "id": "...", "name": "John", "email": "john@example.com", "role": "author" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

---

### Posts — `/api/posts`

| Method | Endpoint          | Auth              | Description                                  |
|--------|-------------------|-------------------|----------------------------------------------|
| GET    | `/`               | Public            | Published posts (search, pagination, filter) |
| GET    | `/my`             | Required          | Current user's posts (admin sees all)        |
| GET    | `/:id`            | Public / Required | Single post (drafts need auth)               |
| POST   | `/`               | Author / Admin    | Create post                                  |
| PUT    | `/:id`            | Owner / Admin     | Update post                                  |
| DELETE | `/:id`            | Owner / Admin     | Delete post + all comments                   |
| PATCH  | `/:id/status`     | Owner / Admin     | Toggle published ↔ draft                     |

**Query params for `GET /api/posts`:**

| Param      | Type   | Description                          |
|------------|--------|--------------------------------------|
| `search`   | string | Full-text search on title/content/tags |
| `status`   | string | `published` or `draft`               |
| `tags`     | string | Comma-separated tags                 |
| `page`     | number | Page number (default: 1)             |
| `limit`    | number | Results per page (default: 10, max: 50) |
| `sortBy`   | string | Field to sort by (default: `createdAt`) |
| `sortOrder`| string | `asc` or `desc`                      |

**Paginated response:**
```json
{
  "posts": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 4,
    "totalPosts": 38,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Comments — `/api/posts/:id/comments`

| Method | Endpoint              | Auth          | Description            |
|--------|-----------------------|---------------|------------------------|
| GET    | `/`                   | Public        | Get all post comments  |
| POST   | `/`                   | Required      | Add a comment          |
| DELETE | `/:commentId`         | Owner / Admin | Delete a comment       |

---

### Statistics — `/api/stats`

| Method | Endpoint  | Auth  | Description                         |
|--------|-----------|-------|-------------------------------------|
| GET    | `/posts`  | Admin | Aggregated platform statistics      |

**Stats response:**
```json
{
  "posts": { "total": 42, "published": 30, "draft": 12 },
  "topAuthors": [{ "author": { "name": "...", "email": "..." }, "postCount": 8 }],
  "recentPosts": [{ "_id": "...", "title": "...", "author": {...}, "createdAt": "..." }],
  "totalComments": 156,
  "totalUsers": 24
}
```

---

## Frontend Architecture

### State Management

```
ToastProvider
  └── AuthProvider      (global auth state + login/register/logout)
       └── PostProvider (post list + CRUD + optimistic updates)
            └── Router
                 └── Pages / Components
```

### Custom Hooks

| Hook           | Purpose                                                   |
|----------------|-----------------------------------------------------------|
| `useAuth`      | Access auth state and actions from any component          |
| `usePosts`     | Access post list state and CRUD from any component        |
| `useApi`       | Generic async API call with loading / error / data states |
| `useComments`  | Comment fetch, add (optimistic), delete for a single post |
| `useConfirm`   | Manage ConfirmDialog open state and async callback        |

### Data Flow — Post Create (Optimistic)

```
User submits form
    → PostContext.createPost()
        → Adds temp post to state immediately   (UI updates instantly)
        → Calls postsAPI.create()
            → On success: replaces temp post with real data from server
            → On failure: removes temp post (rollback) + shows error toast
```

### Code Splitting

All pages and heavy components are lazy-loaded with `React.lazy` + `Suspense`:

```js
const Dashboard = lazy(() => import('./pages/Dashboard'));
// Each route loads its JS chunk only when first visited
```

---

## React Patterns Used

| Pattern                | Where used                                              |
|------------------------|---------------------------------------------------------|
| Context API            | `AuthContext`, `PostContext`, `ToastContext`             |
| Custom Hooks           | `useAuth`, `usePosts`, `useApi`, `useComments`, `useConfirm` |
| Higher-Order Component | `withAuth(Component, requiredRole)` in `hoc/withAuth.js` |
| Compound Components    | `CommentsSection` → `CommentForm` + `CommentItem`       |
| Render Guard           | `ProtectedRoute` declarative route protection           |
| Error Boundaries       | Class component wrapping router and individual routes   |
| Code Splitting         | `React.lazy` + `Suspense` on all page-level components  |
| Optimistic Updates     | Post create, comment add/delete in `PostContext` / `useComments` |
| Memoisation            | `React.memo` on all pure UI atoms and list items        |
| Cleanup Effects        | `cancelled` flag in `PostDetail` to prevent state update on unmount |

---

## Security Measures

- Passwords hashed with **bcrypt** (salt rounds: 12)
- JWT access tokens expire in **15 minutes**
- **Refresh token rotation** — each refresh invalidates the old token
- Refresh tokens stored per-user in DB, enabling **revocation**
- Axios interceptor skips redirect for `/auth/login` and `/auth/register` 401s
- CORS restricted to configured `CLIENT_URL`
- All request bodies validated with **Joi** schemas before reaching controllers
- Role-based middleware prevents authors from editing others' posts
- Draft posts hidden from public API (`status: 'published'` filter enforced server-side)

---

## Architectural Decisions

**Why no Redux / Zustand?**
Context API + `useReducer` is sufficient for this app's scale. Adding a third-party state library would add complexity without meaningful benefit.

**Why separate access + refresh tokens?**
Short-lived access tokens (15m) limit exposure if stolen. Long-lived refresh tokens enable seamless re-authentication without re-login, while still supporting revocation.

**Why MongoDB text index instead of Elasticsearch?**
`$text` search on `title`, `content`, `tags` handles the search requirements with zero extra infrastructure. Elasticsearch would be appropriate at a larger scale.

**Why UI atom components (`/ui` directory)?**
Extracting `Avatar`, `FormField`, `PasswordInput`, etc. into reusable atoms eliminates duplication, enforces visual consistency, and makes each atom independently testable.

**Why direct imports instead of barrel exports?**
`import Avatar from '../ui/Avatar'` is used instead of `import { Avatar } from '../ui'` to avoid webpack module resolution ambiguity that can cause components to resolve as `undefined` at runtime.

---

## Potential Improvements

- **Rich text editor** — TipTap or Quill for formatted post content
- **Image uploads** — Cloudinary or S3 for post cover images
- **Real-time features** — Socket.io for live comment notifications
- **Email verification** — confirm email on registration
- **Rate limiting** — express-rate-limit on auth and API endpoints
- **Helmet.js** — security headers for production
- **Test suite** — Jest + Supertest (backend), React Testing Library (frontend)
- **CI/CD pipeline** — GitHub Actions for lint + test on every PR
- **Infinite scroll** — alternative to pagination for the public blog
- **Post categories** — hierarchical taxonomy beyond flat tags
- **Dark mode** — CSS custom property swap with `prefers-color-scheme`

---

## Quick Start Summary

```bash
# 1. Configure backend
cd backend && cp .env.example .env
# Edit .env — set MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET

# 2. Install & start backend
npm install && npm run dev

# 3. In a new terminal — install & start frontend
cd ../frontend && npm install
PORT=3001 npm start

# 4. Open http://localhost:3001
# Register an account, create a post, explore!
```

---

> Built with the MERN stack — MongoDB, Express, React, Node.js
