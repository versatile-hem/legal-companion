#!/bin/bash

# Suits In - Setup Commands Reference
# Copy and run these commands to set up the project

echo "==============================================="
echo "Suits In - Enterprise Platform Setup"
echo "==============================================="
echo ""

# =================
# PREREQUISITES
# =================
echo "📋 Prerequisites Check:"
echo "- Java 21: $(java -version 2>&1 | grep -oP '(?<=version ")[^"]*')"
echo "- Node.js: $(node -v)"
echo "- npm: $(npm -v)"
echo "- PostgreSQL: $(psql --version 2>/dev/null || echo 'Not Found')"
echo ""

# =================
# DATABASE SETUP
# =================
echo "🗄️  Database Setup:"
echo "  createdb suits_in_dev"
echo "  psql -U postgres -d suits_in_dev -c 'CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";'"
echo ""

# =================
# BACKEND SETUP & RUN
# =================
echo "⚙️  Backend Setup & Run:"
echo "  cd backend"
echo "  cp .env.example .env"
echo "  export JWT_SECRET=\"your-secret-key\""
echo "  mvn clean install"
echo "  mvn spring-boot:run"
echo ""
echo "  Or with profile:"
echo "  mvn spring-boot:run -Dspring-boot.run.arguments=\"--spring.profiles.active=dev\""
echo ""

# =================
# FRONTEND SETUP & RUN
# =================
echo "🎨 Frontend Setup & Run:"
echo "  cd frontend"
echo "  cp .env.example .env.local"
echo "  npm install"
echo "  npm run dev"
echo ""

# =================
# DOCKER SETUP
# =================
echo "🐳 Docker Setup (All-in-One):"
echo "  docker-compose up -d"
echo "  docker-compose down  # To stop"
echo ""

# =================
# ACCESS POINTS
# =================
echo "🌐 Access Points:"
echo "  Frontend:     http://localhost:3000"
echo "  Backend API:  http://localhost:8080/api/v1"
echo "  Swagger Docs: http://localhost:8080/swagger-ui.html"
echo "  Database:     localhost:5432 (postgres/postgres)"
echo ""

# =================
# USEFUL COMMANDS
# =================
echo "🔧 Useful Commands:"
echo ""
echo "Backend:"
echo "  mvn test                    # Run tests"
echo "  mvn clean verify            # Build & test"
echo "  mvn compile                 # Just compile"
echo ""
echo "Frontend:"
echo "  npm test                    # Run tests"
echo "  npm run build               # Production build"
echo "  npm run lint                # Run linter"
echo ""
echo "Docker:"
echo "  docker-compose logs -f backend   # View backend logs"
echo "  docker-compose logs -f frontend  # View frontend logs"
echo "  docker-compose ps                # List running containers"
echo ""

# =================
# BUILD & DEPLOY
# =================
echo "📦 Build for Production:"
echo "  Backend:  mvn clean package -DskipTests"
echo "  Frontend: npm run build && npm run start"
echo ""
echo "🚀 Deploy with Docker:"
echo "  docker build -t suits-in-api:1.0 ./backend"
echo "  docker build -t suits-in-ui:1.0 ./frontend"
echo ""

# =================
# DATABASE COMMANDS
# =================
echo "💾 Database Management:"
echo "  # Connect to database"
echo "  psql -U postgres -d suits_in_dev"
echo ""
echo "  # Common queries"
echo "  \\dt                         # List tables"
echo "  \\di                         # List indexes"
echo "  SELECT * FROM users;        # Query users"
echo "  VACUUM ANALYZE;             # Optimize database"
echo ""

# =================
# TROUBLESHOOTING
# =================
echo "🆘 Troubleshooting:"
echo ""
echo "Port Already in Use:"
echo "  lsof -i :8080              # Find process on port 8080"
echo "  kill -9 <PID>              # Kill process"
echo ""
echo "Clear Node Modules:"
echo "  rm -rf node_modules"
echo "  rm package-lock.json"
echo "  npm install"
echo ""
echo "Clear Maven Cache:"
echo "  rm -rf ~/.m2/repository"
echo "  mvn clean install"
echo ""
echo "Reset Database:"
echo "  dropdb suits_in_dev"
echo "  createdb suits_in_dev"
echo ""

# =================
# DOCUMENTATION
# =================
echo "📚 Documentation:"
echo "  1. Quick Start:      docs/QUICK_START.md"
echo "  2. Architecture:     docs/KNOWLEDGE_BASE.md"
echo "  3. Deployment:       docs/DEPLOYMENT.md"
echo "  4. README:          README.md"
echo ""

echo "==============================================="
echo "✅ Setup Complete! Start your development now."
echo "==============================================="
