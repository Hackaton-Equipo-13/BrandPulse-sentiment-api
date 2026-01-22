# STAGE 1: Build aMplication with Maven
# Use a Maven image that includes JDK 21 and is based on a glibc OS (like Debian/Ubuntu) for native compatibility.
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper scripts
# These are used to execute the maven commands
COPY mvnw .
COPY .mvn .mvn

# Copy the project's pom.xml to leverage Docker's layer caching
# This downloads dependencies only when pom.xml changes.
COPY pom.xml .
RUN ./mvnw dependency:go-offline

# Copy the entire source code
COPY src ./src

# Build the application using the Maven wrapper.
# This command cleans, builds the frontend (with pnpm), packages everything into a .jar.
# We skip tests to speed up the build process in the container.
RUN ./mvnw clean package -DskipTests

# STAGE 2: Create the final, lightweight image
# Use a Java Runtime Environment (JRE) which is smaller than a full JDK.
# The 'jammy' tag (based on Ubuntu 22.04) ensures good compatibility for native libraries like ONNX Runtime.
FROM eclipse-temurin:21-jre-jammy

# Set the working directory
WORKDIR /app

# Define an argument for the JAR file path. This makes it easier to locate the file.
ARG JAR_FILE=/app/target/sentiment-api-0.0.1-SNAPSHOT.jar

# Copy the executable .jar file from the 'builder' stage to the final image
COPY --from=builder ${JAR_FILE} application.jar

# Expose the port the application will run on
EXPOSE 8080

# The command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "application.jar"]