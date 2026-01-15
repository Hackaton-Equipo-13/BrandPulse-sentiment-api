

---

# API de Análisis de Sentimientos

Esta es una aplicación Spring Boot que proporciona una API para el análisis de sentimientos de texto.

## Ejecución de la aplicación

Para ejecutar la aplicación, puedes usar el siguiente comando de Maven desde el directorio `sentiment-api`:

```bash
./mvnw spring-boot:run
```

La aplicación se iniciará en el puerto 8080.

## Documentación de la API (Swagger UI)

Este proyecto utiliza Swagger para la documentación de la API. Una vez que la aplicación esté en ejecución, puedes acceder a la interfaz de Swagger UI en la siguiente URL:

[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

La interfaz de Swagger UI proporciona una manera amigable de explorar los endpoints de la API, ver los modelos de solicitud y respuesta, y probar los endpoints directamente desde tu navegador.

### Endpoints

Los siguientes endpoints están disponibles:

* **POST /api/sentiment**: Analiza el sentimiento de un texto dado.

  * **Cuerpo de la solicitud**: `SentimentRequest` – Un objeto JSON que contiene el texto a analizar.

    ```json
    {
      "text": "Este es un gran producto!"
    }
    ```
  * **Cuerpo de la respuesta**: `SentimentResponse` – Un objeto JSON que contiene el sentimiento (POSITIVE, NEGATIVE o NEUTRAL), una puntuación de confianza y un desglose de probabilidades.

* **POST /api/sentiment/url**: Analiza el sentimiento del contenido de texto de una URL dada.

  * **Cuerpo de la solicitud**: `UrlSentimentRequest` – Un objeto JSON que contiene la URL a analizar.

    ```json
    {
      "url": "https://example.com/shops/"
    }
    ```
  * **Cuerpo de la respuesta**: `SentimentResponse` – Igual que el endpoint `/api/sentiment`.

* **GET /api/sentiment/history**: Recupera un historial de todas las solicitudes de análisis de sentimientos.

  * **Cuerpo de la respuesta**: Un arreglo JSON de objetos `SentimentLog`.

* **GET /api/sentiment/stats**: Recupera estadísticas sobre las solicitudes de análisis de sentimientos, como el número total de solicitudes y el porcentaje de sentimientos positivos, negativos y neutrales.

  * **Cuerpo de la respuesta**: `SentimentStatsResponse` – Un objeto JSON que contiene las estadísticas.

## Cómo usar la API con Swagger UI

1. Navega a [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html).
2. Verás una lista de los endpoints disponibles.
3. Haz clic en un endpoint para expandirlo y ver los detalles.
4. Haz clic en el botón **"Try it out"** para habilitar el editor del cuerpo de la solicitud.
5. Ingresa el cuerpo de la solicitud (si es necesario) y haz clic en el botón **"Execute"**.
6. La respuesta de la API se mostrará debajo.

---

Si quieres, también puedo ayudarte a hacer una versión más técnica, más sencilla o adaptada para usuarios no desarrolladores.
