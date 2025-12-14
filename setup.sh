#!/bin/bash

# Mostinger 2.0 - Quick Setup Script
# Создает все необходимые файлы и структуру проекта

echo "🚀 Creating Mostinger 2.0 project structure..."

# Создание структуры папок
echo "📁 Creating directories..."
mkdir -p backend/app/{api,core,models,schemas,tests}
mkdir -p backend/alembic/versions
mkdir -p frontend/{public,src/{components,pages,store,utils,test},e2e}

# ==================== BACKEND FILES ====================

# backend/__init__.py files
echo "📝 Creating __init__.py files..."
touch backend/app/__init__.py

cat > backend/app/models/__init__.py << 'EOF'
from .user import User
from .post import Post, Comment, Favorite, PostLike

__all__ = ['User', 'Post', 'Comment', 'Favorite', 'PostLike']
EOF

cat > backend/app/api/__init__.py << 'EOF'
from . import auth, users, posts

__all__ = ['auth', 'users', 'posts']
EOF

cat > backend/app/schemas/__init__.py << 'EOF'
from .user import UserCreate, UserUpdate, UserResponse, UserProfile
from .post import PostCreate, PostUpdate, PostResponse, PostList, CommentCreate, CommentResponse
from .auth import Token, TokenData, LoginRequest

__all__ = [
    'UserCreate', 'UserUpdate', 'UserResponse', 'UserProfile',
    'PostCreate', 'PostUpdate', 'PostResponse', 'PostList',
    'CommentCreate', 'CommentResponse',
    'Token', 'TokenData', 'LoginRequest'
]
EOF

cat > backend/app/core/__init__.py << 'EOF'
from .security import verify_password, get_password_hash, create_access_token, decode_access_token
from .cache import get_cache, set_cache, delete_cache

__all__ = [
    'verify_password', 'get_password_hash', 'create_access_token', 'decode_access_token',
    'get_cache', 'set_cache', 'delete_cache'
]
EOF

touch backend/app/tests/__init__.py

# create_admin.py
cat > backend/create_admin.py << 'EOF'
import sys
sys.path.insert(0, '.')

from app.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def create_admin():
    db = SessionLocal()
    
    # Check if admin exists
    existing = db.query(User).filter(User.username == "admin").first()
    if existing:
        print("Admin user already exists!")
        return
    
    admin = User(
        email="admin@mostinger.com",
        username="admin",
        password_hash=get_password_hash("admin123"),
        is_admin=True,
        is_active=True,
        bio="System Administrator"
    )
    
    db.add(admin)
    db.commit()
    db.refresh(admin)
    
    print(f"✅ Admin user created successfully!")
    print(f"   Email: {admin.email}")
    print(f"   Username: {admin.username}")
    print(f"   Password: admin123")
    print(f"   ID: {admin.id}")
    
    db.close()

if __name__ == "__main__":
    create_admin()
EOF

# pytest.ini
cat > backend/pytest.ini << 'EOF'
[pytest]
testpaths = app/tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = 
    -v
    --strict-markers
    --cov=app
    --cov-report=term-missing
    --cov-report=html
EOF

# backend/.dockerignore
cat > backend/.dockerignore << 'EOF'
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv/
.pytest_cache/
.coverage
htmlcov/
*.log
.env
.vscode/
.idea/
EOF

# backend/.env
cat > backend/.env << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@db:5432/mostinger
REDIS_URL=redis://redis:6379/0
SECRET_KEY=super-secret-key-change-this-in-production-12345678
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8000","http://localhost"]
DEBUG=false
APP_NAME=Mostinger
APP_VERSION=2.0.0
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
CACHE_TTL=300
EOF

# ==================== FRONTEND FILES ====================

# frontend/.dockerignore
cat > frontend/.dockerignore << 'EOF'
node_modules
.npm
.vscode
.idea
dist
.env.local
.env.production
*.log
EOF

# frontend/.env
cat > frontend/.env << 'EOF'
VITE_API_URL=http://localhost:8000/api
EOF

# ==================== ROOT FILES ====================

# .gitignore
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/
.pytest_cache/
.coverage
htmlcov/
*.log

# Node
node_modules/
.npm
dist/
build/

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Env files
.env
.env.local
.env.production

# Database
*.db
*.sqlite

# Docker
.dockerignore

# Test
coverage/
.nyc_output/
playwright-report/
test-results/
EOF

# README.md
cat > README.md << 'EOF'
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
EOF

# GitHub Actions CI/CD
mkdir -p .github/workflows
cat > .github/workflows/ci.yml << 'EOF'
name: CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        cd backend
        pytest --cov --cov-report=xml
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379/0
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./backend/coverage.xml

  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Run tests
      run: |
        cd frontend
        npm test
    
    - name: Build
      run: |
        cd frontend
        npm run build
EOF

echo ""
echo "✅ All additional files created successfully!"
echo ""
echo "�� Created structure:"
echo "   ├── backend/"
echo "   │   ├── app/ (with all __init__.py)"
echo "   │   ├── create_admin.py"
echo "   │   ├── pytest.ini"
echo "   │   ├── .dockerignore"
echo "   │   └── .env"
echo "   ├── frontend/"
echo "   │   ├── .dockerignore"
echo "   │   └── .env"
echo "   ├── .github/workflows/ci.yml"
echo "   ├── .gitignore"
echo "   └── README.md"
echo ""
echo "🎯 Next steps:"
echo "   1. Copy main code files from other artifacts"
echo "   2. Run: docker-compose up --build"
echo "   3. Open: http://localhost:3000"
echo ""
echo "📚 See DEPLOYMENT.md for full instructions"
