# Suits In - AI-First Compliance & Operations Platform

An enterprise-grade, AI-powered compliance and operations platform designed for CA/CS firms, corporate secretaries, and compliance professionals.

## Quick Start

### Prerequisites

- **Java 21** (OpenJDK or Oracle JDK)
- **Node.js 20+** and npm/yarn
- **PostgreSQL 15+**
- **Maven 3.9+**

### Backend Setup

```bash
cd backend

# Install dependencies
mvn clean install

# Configure environment
export DB_PASSWORD=your_password
export JWT_SECRET=your-super-secret-jwt-key-change-in-production
export OPENAI_API_KEY=sk-your-openai-key

# Run development server
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

Backend runs on: `http://localhost:8080`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Run development server
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Database Setup

```bash
# Create database
createdb suits_in_dev

# Migrations run automatically on Spring Boot startup
# (Flyway is configured in application-dev.yml)
```

## Project Structure

```
suits-in/
├── backend/                 # Spring Boot Java application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/suits/
│   │   │   │   ├── common/       # Shared configs, exceptions, DTOs
│   │   │   │   ├── auth/         # Authentication & authorization
│   │   │   │   ├── clients/      # Client management
│   │   │   │   ├── jobs/         # Job tracking
│   │   │   │   ├── billing/      # Invoice & billing
│   │   │   │   ├── ai/           # AI chat & integrations
│   │   │   │   ├── dashboard/    # Analytics dashboard
│   │   │   │   └── ...
│   │   │   └── resources/        # Configuration & migrations
│   │   └── test/
│   └── pom.xml
│
├── frontend/                # Next.js React application
│   ├── app/                 # Next.js app directory
│   │   ├── (auth)/         # Auth routes (login, signup)
│   │   └── (dashboard)/    # Main app routes
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utilities & API client
│   ├── store/              # Zustand stores (state management)
│   ├── types/              # TypeScript types
│   └── styles/             # Global styles & Tailwind
│
├── docs/
│   └── KNOWLEDGE_BASE.md    # Complete project documentation
│
└── README.md               # This file
```

## Technology Stack

### Backend
- **Spring Boot 3.2** - Framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - ORM
- **PostgreSQL** - Database
- **JWT** - Token-based authentication
- **OpenAI API** - AI integration
- **Flyway** - Database migrations

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ShadCN/UI** - Component library
- **Zustand** - State management
- **React Query** - Data fetching & caching
- **Axios** - HTTP client

## Key Features

### ✨ Dashboard
- Pending compliance tracker
- Revenue summary
- Job status analytics
- Due dates calendar
- AI-generated alerts

### 👥 Client Management
- Complete client master database
- Document tracking
- Director management
- Compliance status
- Billing history

### 📋 Job Register
- Job creation and workflow
- 7+ job types (MGT-7, AOC-4, DIR-3 KYC, etc.)
- Priority and due date tracking
- AI-generated checklists
- Document management

### 💰 Billing System
- Invoice generation with GST
- Payment tracking
- Overdue management
- PDF export
- Payment reminders

### 🤖 AI Assistant
- WebSocket-based chat interface
- Context-aware responses
- Document summarization
- Resolution drafting
- Compliance guidance

### 📊 Compliance Tracking
- Regulatory compliance calendar
- Task assignment
- Notification system
- Audit logging
- Timeline tracking

## API Documentation

API documentation is available via Swagger UI at:

```
http://localhost:8080/swagger-ui.html
```

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

### Key Endpoints

```
POST   /auth/login              # User login
POST   /auth/signup             # User registration
GET    /clients                 # List clients
POST   /clients                 # Create client
GET    /jobs                    # List jobs
POST   /jobs                    # Create job
GET    /invoices                # List invoices
POST   /ai/chat                # AI chat (REST)
WS     /ws/chat/{token}        # AI chat (WebSocket)
```

## Configuration

### Backend Configuration

**Development** (application-dev.yml):
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/suits_in_dev
    username: postgres
    password: postgres
```

**Production** (application-prod.yml):
- Use environment variables for sensitive data
- Configure SSL/TLS
- Set up connection pooling
- Enable caching

### Frontend Configuration

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NEXT_PUBLIC_APP_ENV=development
```

## Database Schema

Core entities:
- **Users** - User accounts with roles
- **Clients** - Client master data
- **Entities** - Company/LLP/Partnership records
- **Directors** - Director information & KYC
- **Jobs** - Task tracking and workflow
- **Invoices** - Billing records
- **AuditLogs** - Compliance audit trail

See [KNOWLEDGE_BASE.md](docs/KNOWLEDGE_BASE.md) for complete schema documentation.

## Security Features

✅ JWT-based authentication
✅ Role-Based Access Control (RBAC)
✅ Password hashing (BCrypt)
✅ CORS protection
✅ SQL injection prevention
✅ Audit logging
✅ Secure session management
✅ Rate limiting ready

## Development Guidelines

### Code Style

**Backend (Java)**:
- Follow Google Java Style Guide
- Use Lombok to reduce boilerplate
- Follow clean architecture patterns

**Frontend (TypeScript/React)**:
- Use functional components with hooks
- Follow React best practices
- Implement proper TypeScript typing

### Git Workflow

```bash
# Feature branch
git checkout -b feature/module-name

# Commit with meaningful messages
git commit -m "[MODULE] Brief description"

# Push to GitHub
git push origin feature/module-name
```

### Testing

**Backend**:
```bash
mvn test                          # Run all tests
mvn verify                        # Build and test
```

**Frontend**:
```bash
npm test                          # Run tests
npm run test:watch               # Watch mode
```

## Deployment

### Docker

**Build**:
```bash
# Backend
docker build -t suits-in-api:1.0 ./backend

# Frontend
docker build -t suits-in-ui:1.0 ./frontend
```

**Run**:
```bash
docker-compose up -d
```

### Production Checklist

- [ ] Database backed up & replicated
- [ ] SSL certificates configured
- [ ] Environment variables set
- [ ] Monitoring & logging enabled
- [ ] Rate limiting configured
- [ ] Backup strategy in place
- [ ] Load balancer configured
- [ ] CI/CD pipeline tested

## Troubleshooting

### Backend Issues

**Port already in use**:
```bash
lsof -i :8080
kill -9 <PID>
```

**Database connection failed**:
```bash
psql -U postgres -d suits_in_dev
```

### Frontend Issues

**Port 3000 already in use**:
```bash
npm run dev -- -p 3001
```

**Build issues**:
```bash
npm install --legacy-peer-deps
npm cache clean --force
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## Performance Metrics

### Target Metrics
- **API Response Time**: <500ms (p95)
- **Frontend Load Time**: <2s (FCP)
- **Database Query Time**: <100ms (p95)
- **Server Availability**: 99.9%

## Support & Documentation

- [KNOWLEDGE_BASE.md](docs/KNOWLEDGE_BASE.md) - Complete architecture & design
- [API Documentation](http://localhost:8080/swagger-ui.html) - Interactive API docs
- [GitHub Issues](https://github.com/yourusername/suits-in/issues) - Bug reports

## License

Copyright © 2026 Suits In. All rights reserved.

## Contact

For inquiries and support:
- Email: support@suits-in.com
- Website: https://suits-in.com

---

**Built with ❤️ for Compliance Professionals**
