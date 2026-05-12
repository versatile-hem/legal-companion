FROM eclipse-temurin:23-jdk-alpine

WORKDIR /app

# Copy Maven wrapper
COPY mvnw .
COPY .mvn .mvn

# Copy pom.xml and source
COPY pom.xml .
COPY src src

# Make mvnw executable
RUN chmod +x mvnw

# Expose port
EXPOSE 8080

# Health check - wait for app to be ready
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/v1/health || exit 1

# Run Spring Boot dev server
CMD ["./mvnw", "spring-boot:run", "-DskipTests", "-Dspring-boot.run.arguments=\"--server.port=8080\""]
