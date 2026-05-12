# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Java 21
- Node.js 20+
- PostgreSQL 15+

### Option 1: Using Docker (Easiest)

```bash
# Clone and navigate
git clone https://github.com/yourusername/suits-in.git
cd suits-in

# Start everything
docker-compose up -d

# Wait for services to start (30-60 seconds)
docker-compose logs -f

# Access the application
open http://localhost:3000
```

**Demo Credentials:**
```
Email: demo@company.com
Password: DemoPassword123!
```

### Option 2: Local Setup

#### 1. Backend Setup (30 seconds)

```bash
cd backend

# Set environment variables
export JWT_SECRET="your-super-secret-key"
export DB_PASSWORD="postgres"

# Run it
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Backend ready at: http://localhost:8080
# API Docs: http://localhost:8080/swagger-ui.html
```

#### 2. Database Setup (20 seconds)

```bash
# Create database
createdb suits_in_dev

# Migrations run automatically on backend startup
```

#### 3. Frontend Setup (20 seconds)

```bash
cd frontend

npm install
npm run dev

# Frontend ready at: http://localhost:3000
```

### Accessing the Application

| Component | URL | Credentials |
|-----------|-----|-------------|
| Frontend | http://localhost:3000 | Use signup or demo@company.com |
| Backend API | http://localhost:8080/api/v1 | Needs JWT token |
| Swagger Docs | http://localhost:8080/swagger-ui.html | Public |
| Database | localhost:5432 | postgres/postgres |

## 📁 Project Structure

```
suits-in/
├── backend/          # Spring Boot API
├── frontend/         # Next.js React app
├── docs/            # Documentation
│   ├── KNOWLEDGE_BASE.md       # Complete documentation
│   ├── DEPLOYMENT.md           # Production deployment
│   └── QUICK_START.md         # This file
└── docker-compose.yml          # Docker setup
```

## 🛠️ Common Commands

### Backend
```bash
cd backend

mvn clean build           # Build project
mvn spring-boot:run       # Run locally
mvn test                  # Run tests
mvn checkstyle:check      # Code quality
```

### Frontend
```bash
cd frontend

npm run dev              # Development server
npm run build            # Production build
npm run start            # Run built app
npm test                 # Run tests
npm run lint             # Linting
```

## 🔑 Key Features to Try

1. **Login/Signup**
   - Go to `/login`
   - Create new account or use demo credentials

2. **Clients Management**
   - Navigate to "Clients" on sidebar
   - Create, view, and manage clients
   - Search and filter functionality

3. **Dashboard**
   - View compliance statistics
   - See pending tasks
   - Monitor revenue

4. **Jobs**
   - Create new jobs
   - Track job status
   - Assign to team members

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port
lsof -i :8080      # Backend
lsof -i :3000      # Frontend
lsof -i :5432      # Database

kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -c "\l"

# Create test connection
psql -U postgres -d suits_in_dev -c "SELECT 1"
```

### Frontend Build Issues
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Backend Build Issues
```bash
mvn clean
mvn dependency:resolve
mvn compile
mvn package
```

## 📚 Next Steps

1. **Read Documentation**
   - [KNOWLEDGE_BASE.md](../docs/KNOWLEDGE_BASE.md) - Architecture & design
   - [DEPLOYMENT.md](../docs/DEPLOYMENT.md) - Production setup

2. **Explore API**
   - Visit http://localhost:8080/swagger-ui.html
   - Try API endpoints with token from login

3. **Understanding the Code**
   - Backend: `backend/src/main/java/com/suits` (modular structure)
   - Frontend: `frontend/app` (Next.js app directory)

4. **Database Schema**
   - See `backend/src/main/resources/db/migration/V1__initial_schema.sql`

## 🆘 Getting Help

- 📖 Check [KNOWLEDGE_BASE.md](../docs/KNOWLEDGE_BASE.md)
- 🐛 Report issues on GitHub
- 💬 Check existing discussions
- 📧 Email: support@suits-in.com

---

**Happy coding! 🚀**
