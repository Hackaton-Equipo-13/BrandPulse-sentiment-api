# Sentiment API - Backend

## Descripción
API REST para análisis de sentimiento usando un modelo de Data Science exportado en formato ONNX. Recibe textos, predice el sentimiento y guarda las predicciones en base de datos.

## Ejecución local

1. Clona el repositorio y coloca el archivo `sentiment_pipeline.onnx` en la carpeta `model/`.
2. Compila el proyecto:
   ```bash
   mvn clean package
   ```
3. Ejecuta la aplicación:
   ```bash
   java -jar target/sentiment-api-0.0.1-SNAPSHOT.jar
   ```

## Ejemplo de petición

POST `/sentiment`
```json
{
  "text": "El servicio fue excelente y rápido."
}
```
Respuesta:
```json
{
  "prevision": "Positivo",
  "probabilidad": 0.87,
  "mensaje": "Predicción ONNX ejecutada"
}
```

## Configuración
La ruta del modelo ONNX se configura en `src/main/resources/application.yaml`:
```yaml
onnx:
  model:
    path: model/sentiment_pipeline.onnx
```

## Persistencia
Las predicciones se guardan en la base de datos H2 por defecto. Puedes cambiar a PostgreSQL editando `application.yaml`.

## Docker
Para desplegar en Oracle OCI o local:
```bash
# Construir imagen
mvn clean package
# Crear imagen Docker
docker build -t sentiment-api .
# Ejecutar contenedor
docker run -p 8080:8080 sentiment-api
```

## Dependencias principales
- Spring Boot
- ONNX Runtime
- JPA/H2

## Pruebas
Incluye pruebas unitarias y de integración en `src/test/java`.

## Contacto
Equipo Backend Hackathon
