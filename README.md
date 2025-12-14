# Mostinger 2.0 - Modern Blog Platform

![Mostinger](https://img.shields.io/badge/version-2.0.0-blue)
![Python](https://img.shields.io/badge/python-3.11-green)
![React](https://img.shields.io/badge/react-18.2-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)
![License](https://img.shields.io/badge/license-MIT-blue)

A modern, full-stack blog platform built with FastAPI, React, PostgreSQL, and Redis.

## ✨ Features

### Backend
- 🔐 JWT Authentication
- 📝 Full CRUD operations
- 🔍 Full-text search
- 💾 Redis caching
- 📊 PostgreSQL database
- 🔄 Alembic migrations
- 🧪 60%+ test coverage
- 🐳 Docker containerization
- 👥 Role-based access control

### Frontend
- ⚛️ React 18
- 🎨 Tailwind CSS
- 🌓 Dark/Light theme
- 📱 Fully responsive
- 💖 Likes & Comments
- ⭐ Favorites system
- 🔐 Protected routes
- 📱 PWA support
- 🧪 E2E tests

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/xgorfo/mostinger.git
cd mostinger
```

2. Start with Docker:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/docs
- Nginx: http://localhost

## 🧪 Testing

### Backend
```bash
cd backend
pytest --cov
```

### Frontend
```bash
cd frontend
npm test
npm run test:e2e
```

## 📊 Project Structure

```
mostinger/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── docker-compose.yml
└── nginx.conf
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License

## 👨‍💻 Author

**xgorfo**

Made with ❤️ (and hate) by xgorfo

---

**Note**: This is an educational project created for HSE Web Development course.
