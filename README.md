
# Mostinger 

A modern, Dockerized blog platform built with FastAPI, featuring a beautiful responsive UI.

## Features 

- **RESTful API** with FastAPI
- **Modern UI** with responsive design
- **Dockerized** for easy deployment
- **CRUD Operations** for users and posts
- **Data Validation** with Pydantic
- **File-based Storage** with JSON
- **Auto-generated API Documentation**

## Quick Start 

### With Docker (Recommended)

```bash
# Clone the repository
git clone git@github.com:xgorfo/mostinger.git
cd mostinger

# Build and run with Docker
docker-compose up --build

Web Interface: http://localhost:8000
API Documentation: http://localhost:8000/api
Health Check: http://localhost:8000/health
API Endpoints 

Users

POST /api/users/ - Create user
GET /api/users/ - List all users
GET /api/users/{id} - Get user by ID
PUT /api/users/{id} - Update user
DELETE /api/users/{id} - Delete user
Posts

POST /api/posts/ - Create post
GET /api/posts/ - List all posts
GET /api/posts/{id} - Get post by ID
PUT /api/posts/{id} - Update post
DELETE /api/posts/{id} - Delete post
GET /api/users/{id}/posts - Get user's posts
Project Structure 

text
mostinger/
├── app.py                 # Main application
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker compose setup
├── README.md             # This file
├── templates/            # HTML templates
│   ├── base.html
│   ├── main.html
│   ├── post.html
│   ├── create.html
│   ├── edit.html
│   └── error.html
└── assets/
    └── css/
        └── style.css     # Styling
Technologies Used 

Backend: FastAPI, Python
Frontend: HTML5, CSS3, Jinja2
Containerization: Docker, Docker Compose
Data Validation: Pydantic
Server: Uvicorn
Development 
```

This project was developed as a blog platform demonstration with:

Full CRUD functionality
Responsive web design
REST API best practices
Containerized deployment


## Made with hate by xgorfo <3
