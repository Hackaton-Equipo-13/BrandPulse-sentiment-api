<p align="center">
  <pre align="center">
    ____  ____  ___    _   ______  ____  __  ____    _____ ______
   / __ )/ __ \/   |  / | / / __ \/ __ \/ / / / /   / ___// ____/
  / __  / /_/ / /| | /  |/ / / / / /_/ / / / / /    \__ \/ __/   
 / /_/ / _, _/ ___ |/ /|  / /_/ / ____/ /_/ / /___ ___/ / /___   
/_____/_/ |_/_/  |_/_/ |_/_____/_/    \____/_____//____/_____/   
  </pre>
</p>


<p align="center">
  <code>
╭──────────────────────────────────────────────────────────╮
│                       BRANDPULSE                         │
│            Sentimental Analysis Engine v1.0              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│     (•‿•) ✨             (•_•) 🌀             (•︵•) ⛈️    │
│     POSITIVE            NEUTRAL            NEGATIVE      │
│                                                          │
╰──────────────────────────────────────────────────────────╯
  </code>
</p>



<img width="1170" height="704" alt="Screenshot from 2026-01-15 17-41-33" src="https://github.com/user-attachments/assets/a57598a8-46c5-41e7-8ab3-36f651042e98" />


<img width="1170" height="704" alt="Screenshot from 2026-01-15 17-40-57" src="https://github.com/user-attachments/assets/96e333c5-6f58-4634-9053-77a8a1c939a4" />



<img width="1170" height="704" alt="Screenshot from 2026-01-15 17-40-36" src="https://github.com/user-attachments/assets/74c6efe4-e7e5-4f5f-b099-5fcda28dcf5c" />







¡Claro que sí! 🙌
Te dejo una versión **más profesional, clara y atractiva** de tu `README.md`, manteniendo todo lo que ya tienes pero mejorando estructura, lenguaje y presentación. Está pensada para que se vea muy bien en GitHub y sea fácil de entender para otros devs.

Puedes copiarla tal cual o ajustarla a tu gusto 👇

---

````md
# 🚀 API de Análisis de Sentimientos

API REST desarrollada con **Spring Boot** que permite analizar el sentimiento de textos o del contenido de una URL, devolviendo una clasificación clara (**POSITIVE**, **NEGATIVE** o **NEUTRAL**) junto con métricas de confianza y estadísticas históricas.

---

## ✨ Características

- 🔍 Análisis de sentimientos de texto
- 🌐 Análisis de sentimientos desde una URL
- 📊 Historial de solicitudes
- 📈 Estadísticas agregadas de sentimientos
- 📄 Documentación interactiva con Swagger UI
- ⚡ API REST lista para integrarse en otros sistemas

---

## 🛠️ Tecnologías utilizadas

- Java 17+
- Spring Boot
- Spring Web
- Maven
- Swagger / OpenAPI

---

## ▶️ Ejecución de la aplicación

Desde el directorio raíz del proyecto (`sentiment-api`), ejecuta:

```bash
./mvnw spring-boot:run
````

La aplicación se iniciará en:

```
http://localhost:8080
```

---

## 📘 Documentación de la API (Swagger UI)

La API está completamente documentada con **Swagger UI**, lo que permite explorar y probar los endpoints directamente desde el navegador.

👉 Acceso a Swagger UI:
[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## 🔌 Endpoints disponibles

### ➤ POST `/api/sentiment`

Analiza el sentimiento de un texto proporcionado.

**Request Body – `SentimentRequest`**

```json
{
  "text": "¡Este es un gran producto!"
}
```

**Response – `SentimentResponse`**

```json
{
  "sentiment": "POSITIVE",
  "confidence": 0.92,
  "probabilities": {
    "positive": 0.92,
    "neutral": 0.05,
    "negative": 0.03
  }
}
```

---

### ➤ POST `/api/sentiment/url`

Analiza el sentimiento del contenido textual obtenido desde una URL.

**Request Body – `UrlSentimentRequest`**

```json
{
  "url": "https://example.com/shops/"
}
```

**Response**

* `SentimentResponse` (idéntico al endpoint `/api/sentiment`)

---

### ➤ GET `/api/sentiment/history`

Obtiene el historial completo de solicitudes de análisis de sentimientos.

**Response**

```json
[
  {
    "text": "Excelente servicio",
    "sentiment": "POSITIVE",
    "timestamp": "2024-01-10T14:30:00"
  }
]
```

---

### ➤ GET `/api/sentiment/stats`

Devuelve estadísticas agregadas sobre los análisis realizados.

**Response – `SentimentStatsResponse`**

```json
{
  "totalRequests": 120,
  "positivePercentage": 55.0,
  "neutralPercentage": 30.0,
  "negativePercentage": 15.0
}
```

---

## 🧪 Cómo probar la API con Swagger UI

1. Abre [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
2. Selecciona el endpoint que deseas probar
3. Haz clic en **Try it out**
4. Completa el cuerpo de la solicitud (si aplica)
5. Pulsa **Execute**
6. Revisa la respuesta directamente en la interfaz

---

## 📌 Notas adicionales

* Asegúrate de tener **Java JDK 21 ✅ Obligatorio: Eclipse Temurin JDK 21 (LTS).y Maven** correctamente configurados
* Ideal para proyectos de análisis de texto, NLP o dashboards analíticos
* Fácilmente extensible para nuevos modelos o proveedores de análisis

---



































<img width="1440" height="900" alt="Screenshot from 2026-01-14 18-25-04" src="https://github.com/user-attachments/assets/03e0b0d1-7be9-4815-a514-f6614f13f995" />


---

## 🚀 ¿Qué es BrandPulse?

**BrandPulse** es una **aplicación web full-stack de análisis de sentimiento** diseñada para procesar grandes volúmenes de texto y convertir opiniones en **insights accionables en tiempo real**.

Combina:

* Un **frontend interactivo** enfocado en visualización avanzada
* Un **backend robusto** con API REST
* Un **modelo de IA híbrido** exportado a **ONNX** para máxima interoperabilidad

---

## 🧩 Arquitectura General

```
[ React + TypeScript + Vite ]
              ↓
        [ API REST ]
       (Spring Boot)
              ↓
     [ ONNX Runtime ]
              ↓
        [ PostgreSQL ]
```

---

# 🎨 Front End

### Descripción

Frontend desarrollado en **React + TypeScript + Vite**, orientado a la **visualización clara, dinámica y experimental** del sentimiento analizado.

Incluye **tests locales hardcoded** con un algoritmo simple (EN / ES) para desarrollo sin backend.

### Características Clave

* 📊 Gráficos dinámicos con **emojis animados**
* 💬 Globos interactivos con resúmenes de comentarios
* 📱 Diseño **responsive**
* 📂 Soporte de entrada:

  * JSON
  * CSV
  * XLSX *(integrado vía backend)*
* 🔄 Output en el mismo formato de entrada

---


### 🌌 Concepto Visual: *Orbital Emoji System*




<img width="772" height="260" alt="Screenshot from 2026-01-15 19-45-46" src="https://github.com/user-attachments/assets/74bcc1c1-e6e2-4aae-a0c4-b07ece72e1ab" />














Concepto en cada componente "El sistema visual y sus componentes deben ser interactivos y complementarios":

* **PixelFace central** → los 3 emojis de sentimiento son la imagen principal junto a los pixeles y animaciones interactivas
* **Logo Nodos orbitales** → logo emoji animado interactivo orbital con puslo animado
* **Interacción directa** → cada nodo es clickable
* **Panel flotante e interactivo, estilo terminal** (`>`) → Para subir archivos a un click en formato CSV, XLSX, JSON
* **Visualización en tiempo real** → al subir un archivo se hace el análisis en tiempo real mostrando la cantidad de reviews o comentarios analizados
* **Tres tipos de Gráficos de Datos interactivos** → gráfico vertical, horizontal y tipo piechart y un gráfico extra al posicionar el mouse sobre ellos.
* **Historial en tiempo real** → historial de comentarios clasificados por fecha, comentario, clasificación y probabilidad
* **Historial carousel slider** → historial de comentarios clasificados con slider enumerado cuando se acumulan más de 50 comentarios para agregar otra capa interactiva y de limpieza visual.
* **Descarga de Historial en 3 formatos** → Descarga de historial de datos analizados en formato JSON, XLSX y CSV











<img width="1440" height="900" alt="Screenshot from 2026-01-14 18-25-46" src="https://github.com/user-attachments/assets/f652a1bc-5c5f-49c1-b249-2948532e8eab" />













<img width="1440" height="900" alt="Screenshot from 2026-01-14 18-25-53" src="https://github.com/user-attachments/assets/545ee699-8128-4ec6-9eae-bda7d7bc8973" />


  

#### Detalles técnicos destacados

* Posicionamiento orbital con transformaciones CSS
* Animaciones continuas (spin, scale, fade-in)
* Colores semánticos:

  * 🟢 Positivo `#10b981`
  * 🔴 Negativo `#f43f5e`
  * 🟠 Neutro `#f59e0b`
 





<img width="4724" height="1296" alt="triptix" src="https://github.com/user-attachments/assets/79b2f131-730f-4b2e-a757-46e1fb0c907e" />















---

### ▶️ Ejecución Local (Frontend)

**Requisitos**

* Node.js
* NVM
* pnpm (recomendado)

```bash
pnpm install
pnpm run dev
```

---

# ⚙️ Back End

### Descripción

Backend desarrollado en **Java con Spring Boot**, responsable de:

* Exponer la **API REST**
* Orquestar el análisis de sentimiento
* Ejecutar el modelo ONNX
* Persistir resultados

### Responsabilidades

* Recepción de texto o archivos
* Preprocesamiento básico
* Inferencia vía **ONNX Runtime**
* Persistencia en **PostgreSQL**
* Retorno de resultados estructurados

### Stack Backend

* Java ☕
* Spring Boot
* JPA / Hibernate
* ONNX Runtime (Java)
* Maven
* PostgreSQL 🐘

---

# 🧠 Modelo de IA – BrandPulse ONNX

### Descripción General

**BrandPulse Model** es un modelo **NLP híbrido y multilingüe**, diseñado para clasificar sentimientos en:

* Positivo (1)
* Negativo (0)
* Neutro - umbral(0.2)

Idiomas soportados:

* 🇺🇸 Inglés
* 🇪🇸 Español
* 🇵🇹 Portugués

---

### Arquitectura del Modelo

**Híbrida (Reglas + ML):**

1. **Léxico Multilingüe**

   * Palabras positivas, negativas y críticas
   * Las palabras críticas tienen *peso prioritario*

2. **Machine Learning**

   * TF-IDF Vectorizer
   * Logistic Regression
   * Score de confianza

---

### Pipeline de Operación

1. **Carga de datos**

   * CSV / XLSX / input manual
2. **Detección automática de idioma**
3. **Preprocesamiento**

   * Normalización
   * Limpieza
   * Stopwords
4. **Clasificación híbrida**
5. **Reporte visual**
6. **Exportación a ONNX**

---

### Stack del Modelo

* Python 3.12
* Pandas
* scikit-learn
* nltk
* langdetect
* skl2onnx
* matplotlib / seaborn
* ONNX Runtime

---

### 📊 Métricas de Desempeño

* **Accuracy:** 96%
* **F1 Negativo:** 0.96
* **F1 Positivo:** 0.96

---

### 🔗 Integración con Java

El modelo se exporta como `BrandPulse.onnx` y se ejecuta en Spring Boot usando `onnxruntime-java`.

* Entrada esperada: `StringTensor [1,1]`
* Preprocesamiento incluido en el grafo ONNX

---

### ⚠️ Nota del Equipo de Data Science

El modelo implementa **Peso Crítico**:
palabras como *fraude, estafa, scam, robo* anulan cualquier score positivo, priorizando alertas de riesgo y seguridad.

---

## 📌 Estado del Proyecto

🧪 En desarrollo activo ---> Versión Beta 0.1
✔ Arquitectura definida
✔ Modelo validado
✔ Integración ONNX funcional

---



---
