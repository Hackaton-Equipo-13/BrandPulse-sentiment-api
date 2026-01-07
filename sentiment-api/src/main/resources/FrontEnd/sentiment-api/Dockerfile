# Dockerfile para Sentiment API (Spring Boot)
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY target/sentiment-api-0.0.1-SNAPSHOT.jar app.jar

# Dependencia para ONNX (Java)
# Si usas onnxruntime, descomenta la siguiente línea y agrega la dependencia en pom.xml
# RUN apt-get update && apt-get install -y libonnxruntime

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
