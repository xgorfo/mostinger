
# MOSTINGER - RDR2 Community Blog Platform

![Mostinger](https://img.shields.io/badge/Stack-Full--Stack-orange)
![Frontend](https://img.shields.io/badge/Frontend-React-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)

A full-stack blog platform styled after Red Dead Redemption 2 with complete social network functionality.

## Table of Contents
- [Technologies](#technologies)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Architecture](#architecture)
- [Requirements Fulfilled](#requirements-fulfilled)
- [API Documentation](#api-documentation)

## Technologies

### Frontend
- **React 18** - UI library
- **Vite** - build tool
- **React Router v6** - routing
- **Zustand** - state management
- **Tailwind CSS** - styling
- **Axios** - HTTP client
- **Lucide React** - icons
- **React Hot Toast** - notifications

### Backend
- **FastAPI** - web framework
- **SQLAlchemy** - ORM
- **Alembic** - database migrations
- **PostgreSQL 15** - database
- **Redis 7** - caching
- **Pydantic** - data validation
- **Python-Jose** - JWT tokens
- **Passlib + Bcrypt** - password hashing

### DevOps
- **Docker & Docker Compose** - containerization
- **Nginx** - reverse proxy

## Features

### Authentication & Users
- ✅ User registration with email and username validation
- ✅ Login with JWT tokens
- ✅ User profile with edit capabilities
- ✅ Search users by username and email
- ✅ View other users' profiles
- ✅ Display user's posts in profile

### Posts
- ✅ Create posts with title and content
- ✅ View feed of all posts
- ✅ Detailed post view
- ✅ Edit and delete own posts
- ✅ Full-text search by title and content
- ✅ Pagination support
- ✅ Post creation timestamp

### Social Features
- ✅ Like/unlike posts
- ✅ Comment on posts
- ✅ Favorite/unfavorite posts
- ✅ View saved posts (Favorites page)
- ✅ Like and comment counters
- ✅ Author attribution

### UI/UX
- ✅ Western/cowboy themed design (RDR2 style)
- ✅ Dark/Light theme switcher
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Hamburger menu for mobile
- ✅ Loading states and error handling
- ✅ Toast notifications
- ✅ Form validation with user feedback

### Performance
- ✅ Redis caching for frequently accessed data
- ✅ Optimized database queries
- ✅ Efficient pagination
- ✅ Cache invalidation on data changes

## 🚀 Installation & Setup

### Prerequisites
- Docker & Docker Compose
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd mostinger
```

2. **Start the application**
```bash
docker-compose up -d
```

3. **Run database migrations**
```bash
docker exec mostinger_backend alembic upgrade head
```

4. **Access the application**
- Frontend: http://localhost
- Backend API: http://localhost/api
- API Docs: http://localhost/api/docs

### Environment Variables

The project uses the following default configuration:

**Backend (.env)**
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/mostinger
REDIS_URL=redis://redis:6379/0
SECRET_KEY=your-secret-key-change-in-production-use-strong-random-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend**
```env
VITE_API_URL=/api
```

## Architecture

### Project Structure
```
mostinger/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   │   ├── auth.py   # Authentication endpoints
│   │   │   ├── posts.py  # Post CRUD + social features
│   │   │   ├── users.py  # User management
│   │   │   └── deps.py   # Dependencies (auth, db)
│   │   ├── core/         # Core functionality
│   │   │   ├── security.py  # JWT, password hashing
│   │   │   └── cache.py     # Redis caching
│   │   ├── models/       # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   └── post.py
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── config.py     # Configuration
│   │   └── main.py       # FastAPI app
│   ├── alembic/          # Database migrations
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── PostCard.jsx
│   │   │   └── ...
│   │   ├── pages/        # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Users.jsx
│   │   │   └── ...
│   │   ├── store/        # Zustand stores
│   │   │   ├── authStore.js
│   │   │   └── themeStore.js
│   │   ├── utils/        # Utilities
│   │   │   ├── api.js
│   │   │   └── validation.js
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── nginx.conf
```

### Database Schema

**Users Table**
- id, email, username, password_hash
- bio, avatar_url
- is_active, is_admin
- created_at, updated_at

**Posts Table**
- id, user_id, title, content
- excerpt, featured_image, status
- created_at, updated_at, published_at

**Comments Table**
- id, post_id, user_id
- content, parent_comment_id
- is_approved, created_at

**PostLikes Table**
- user_id, post_id, created_at

**Favorites Table**
- user_id, post_id, created_at

## 📊 Requirements Fulfilled

### Frontend Requirements (13 points) ✅

| Requirement | Points | Status |
|------------|--------|--------|
| Registration & Authentication + pages | 2 | ✅ |
| User profile page with edit capability | 1 | ✅ |
| Main page with post feed | 1 | ✅ |
| Post creation page | 1 | ✅ |
| Post search by title and content | 1 | ✅ |
| User search | 1 | ✅ |
| Likes and comments on posts | 1 | ✅ |
| Favorite posts functionality | 1 | ✅ |
| Form validation | 1 | ✅ |
| Server error handling | 1 | ✅ |
| **Additional:** Theme switcher | 1 | ✅ |
| **Additional:** Mobile responsive | 1 | ✅ |

### Backend Requirements (11 points) ✅

| Requirement | Points | Status |
|------------|--------|--------|
| Database storage (PostgreSQL) | 1 | ✅ |
| Migrations tool (Alembic) | 1 | ✅ |
| Containerization (Docker) | 1 | ✅ |
| CRUD operations for all entities | 2 | ✅ |
| Input validation & error handling | 1 | ✅ |
| Authorization & access control (JWT) | 1 | ✅ |
| Pagination & filtering | 1 | ✅ |
| Caching (Redis) | 1 | ✅ |
| Full-text search | 1 | ✅ |
| Role-based access (admin/user) | 1 | ✅ |

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users/{user_id}` - Get user by ID
- `GET /api/users/{user_id}/posts` - Get user's posts
- `GET /api/users/me/favorites` - Get current user's favorited posts
- `GET /api/users/?search={query}` - Search users

### Posts
- `GET /api/posts/` - Get all posts (with pagination & search)
- `POST /api/posts/` - Create new post (auth required)
- `GET /api/posts/{post_id}` - Get post by ID
- `PUT /api/posts/{post_id}` - Update post (auth required)
- `DELETE /api/posts/{post_id}` - Delete post (auth required)

### Social Features
- `POST /api/posts/{post_id}/like` - Like post
- `DELETE /api/posts/{post_id}/like` - Unlike post
- `POST /api/posts/{post_id}/favorite` - Favorite post
- `DELETE /api/posts/{post_id}/favorite` - Unfavorite post
- `GET /api/posts/{post_id}/comments` - Get post comments
- `POST /api/posts/{post_id}/comments` - Add comment

### Query Parameters
- `search` - Search query for posts/users
- `skip` - Pagination offset (default: 0)
- `limit` - Items per page (default: 20, max: 100)

Full interactive API documentation available at: http://localhost/api/docs

## Design Features

### Western/Cowboy Theme
- Amber and orange color scheme inspired by RDR2
- Custom "Mostinger" branding with outlaw/gunslinger terminology
- Saloon, Outlaws, and frontier-themed UI text
- Rustic gradients and borders

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Accessibility
- ARIA labels
- Keyboard navigation
- Color contrast compliance
- Screen reader friendly

## Security Features

- JWT-based authentication
- Bcrypt password hashing
- SQL injection prevention (SQLAlchemy ORM)
- XSS protection (React sanitization)
- CORS configuration
- Environment variable secrets
- Input validation (Pydantic)

## Usage

1. **Register** a new account at `/register`
2. **Login** with your credentials
3. **Create posts** from the "Write Story" page
4. **Search** for posts or users
5. **Like** and **comment** on posts
6. **Save** favorite posts
7. **Edit profile** with bio and information
8. **Switch themes** between light and dark mode

## 👨‍💻 Author

**xgorfo**

Made with ❤️ (and hate) by xgorfo

---

**Note**: This is an educational project created for HSE Web Development course.
