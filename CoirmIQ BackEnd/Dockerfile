# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime (Using the much smaller Alpine JRE image)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security hardening
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/target/ticket-0.0.1-SNAPSHOT.jar app.jar

# Set ownership of the app jar to the non-root user
RUN chown appuser:appgroup app.jar

USER appuser

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]