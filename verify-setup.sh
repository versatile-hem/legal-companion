#!/bin/bash

# Suits In - Assignments Module Verification Script
# Checks that all code files exist and basic setup is correct

echo "🔍 Assignments Module Verification"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CHECKS_PASSED=0
CHECKS_FAILED=0

check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} $1"
    ((CHECKS_FAILED++))
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} $1"
    ((CHECKS_FAILED++))
  fi
}

check_command() {
  if command -v "$1" &> /dev/null; then
    local version=$("$1" --version 2>&1 | head -n 1)
    echo -e "${GREEN}✓${NC} $1: $version"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} $1 (not installed)"
    ((CHECKS_FAILED++))
  fi
}

# 1. Check Java
echo "📦 Java Setup"
echo "-----------"
check_command "java"
if [ -z "$JAVA_HOME" ]; then
  echo -e "${YELLOW}⚠${NC}  JAVA_HOME not set (backend may fail)"
  ((CHECKS_FAILED++))
fi
echo ""

# 2. Check Maven
echo "🏗️  Build Tools"
echo "------------"
check_command "mvn"
echo ""

# 3. Check Node.js & npm
echo "📝 Frontend Tools"
echo "---------------"
check_command "node"
check_command "npm"
echo ""

# 4. Check Python
echo "🐍 Python Setup"
echo "--------------"
check_command "python3"
check_command "pip3"
echo ""

# 5. Check Database
echo "🗄️  Database"
echo "----------"
check_command "psql"
if command -v psql &> /dev/null; then
  if psql -h localhost -U postgres -l &> /dev/null; then
    echo -e "${GREEN}✓${NC} PostgreSQL connection successful"
    ((CHECKS_PASSED++))
  else
    echo -e "${YELLOW}⚠${NC}  PostgreSQL not accessible (may need to start)"
    ((CHECKS_FAILED++))
  fi
fi
echo ""

# 6. Check Backend Files
echo "📚 Backend Files"
echo "---------------"
check_dir "backend/src/main/java/com/suits/assignments"
check_file "backend/src/main/java/com/suits/assignments/entity/Assignment.java"
check_file "backend/src/main/java/com/suits/assignments/entity/AssignmentTemplate.java"
check_file "backend/src/main/java/com/suits/assignments/entity/AssignmentTask.java"
check_file "backend/src/main/java/com/suits/assignments/repository/AssignmentRepository.java"
check_file "backend/src/main/java/com/suits/assignments/service/AssignmentService.java"
check_file "backend/src/main/java/com/suits/assignments/service/AIService.java"
check_file "backend/src/main/java/com/suits/assignments/controller/AssignmentController.java"
check_file "backend/src/main/resources/db/migration/V3__add_assignments_module.sql"
echo ""

# 7. Check Frontend Files
echo "🎨 Frontend Files"
echo "---------------"
check_dir "frontend/app/(dashboard)/assignments"
check_file "frontend/app/(dashboard)/assignments/page.tsx"
check_file "frontend/app/(dashboard)/assignments/create/page.tsx"
check_file "frontend/app/(dashboard)/assignments/\[id\]/page.tsx"
check_file "frontend/package.json"
check_file "frontend/next.config.js"
echo ""

# 8. Check AI Service Files
echo "🤖 AI Service Files"
echo "------------------"
check_dir "ai-service"
check_file "ai-service/main.py"
check_file "ai-service/requirements.txt"
echo ""

# 9. Check Configuration Files
echo "⚙️  Configuration"
echo "---------------"
check_file "backend/src/main/resources/application.yml"
check_file "frontend/.env.local"
check_file "docker-compose.yml"
echo ""

# 10. Check Documentation
echo "📖 Documentation"
echo "---------------"
check_file "IMPLEMENTATION_GUIDE.md"
check_file "INTEGRATION_CHECKLIST.md"
echo ""

# Summary
echo "=================================="
echo "Summary"
echo "=================================="
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}Failed: $CHECKS_FAILED${NC}"

if [ $CHECKS_FAILED -gt 0 ]; then
  echo ""
  echo -e "${YELLOW}⚠️  Some checks failed. Review the IMPLEMENTATION_GUIDE.md for setup instructions.${NC}"
  exit 1
else
  echo ""
  echo -e "${GREEN}✅ All checks passed! You're ready to proceed.${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Start PostgreSQL"
  echo "  2. cd backend && mvn clean spring-boot:run"
  echo "  3. cd frontend && npm run dev"
  echo "  4. cd ai-service && python -m uvicorn main:app --reload"
  exit 0
fi
