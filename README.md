---

![brandpulse_neon0](https://github.com/user-attachments/assets/b5d118fa-07e1-4eec-a3dd-4b0ff98224eb)




























---

## 🚀 ¿Qué es BrandPulse?

**BrandPulse** es una **aplicación web full-stack de análisis de sentimiento** diseñada para procesar grandes volúmenes de texto y convertir opiniones en **insights accionables en tiempo real**.

Combina:

* Un **frontend interactivo** visualización de análisis de sentimiento en tiempo real con animaciones, emojis y gráficos
* Un **backend robusto** con API REST monolítica 
* Un **modelo de IA híbrido** exportado a **ONNX** para máxima interoperabilidad




<img width="1440" height="900" alt="Screenshot from 2026-01-14 18-25-31" src="https://github.com/user-attachments/assets/2f9e6ca0-bce8-49c2-b56e-1385990d589a" />


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

Incluye **tests Junit para análisis sentimiento postivo, negativo y neutro** .

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






![brandpulse-SentiDisplay](https://github.com/user-attachments/assets/1c528d0f-770a-4aa2-a273-56551e78602e)













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













#### Temas visuales

* **NEON** (cyberpunk/ con transición de colores Neon)
* **LIGHT** (retro / brutalista)
* **DARK** (estándar)

#### Detalles técnicos destacados

* Posicionamiento orbital con transformaciones CSS
* Animaciones continuas (spin, scale, fade-in)
* Colores semánticos:

  * 🟢 Positivo `#10b981`
  * 🔴 Negativo `#f43f5e`
  * 🟠 Neutro `#f59e0b`







<img width="4724" height="1296" alt="triptix" src="https://github.com/user-attachments/assets/4c796371-e870-4634-bcc7-8577fb7661a2" />
















---

## ▶️ Ejecución Local (Frontend)

### 📋 Requisitos previos

Asegúrate de tener instaladas las siguientes herramientas:

* 📌 **Node.js (v24.x)**
* 📌 **NVM** (Linux) o **Chocolatey** (Windows)
* 📌 **pnpm** (para el proceso de build)

---

## 🛠️ Instalación de Node.js

### 🐧 Linux (usando NVM)

```bash
# Descarga e instala NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Carga NVM sin reiniciar la terminal
. "$HOME/.nvm/nvm.sh"

# Instala Node.js
nvm install 24

# Verifica la versión de Node.js
node -v   # v24.13.0

# Verifica la versión de npm
npm -v    # 11.6.2
```

---

### 🪟 Windows (usando Chocolatey)

```powershell
# Instala Chocolatey
powershell -c "irm https://community.chocolatey.org/install.ps1 | iex"

# Instala Node.js
choco install nodejs --version="24.13.0"

# Verifica la versión de Node.js
node -v   # v24.13.0

# Verifica la versión de npm
npm -v    # 11.6.2
```

---

## 📦 Instalación de PNPM (Global)

```bash
# Instala pnpm de forma global
npm install -g pnpm

# Verifica la instalación
pnpm -v
```

---

## 🚀 Build y Ejecución del Proyecto

Una vez instalados todos los requisitos, sigue estos pasos:

1. ✅ Abre el proyecto en tu IDE preferido.

2. ✅ Navega al directorio del backend:

   ```bash
   cd FullStack-BrandPulse-main/sentiment-api
   ```

3. ✅ Ejecuta el build completo del proyecto:

   ```bash
   ./mvnw clean install
   ```

   Este proceso:

   * Descarga dependencias
   * Ejecuta tests (JUnit)
   * Genera el archivo `.jar`

4. ✅ Verifica que el build finalice con el mensaje **`BUILD SUCCESS`**.

---

## ▶️ Ejecución

### 🔧 Modo Desarrollo

Ejecuta la aplicación directamente desde el IDE:

```
src/main/java/com/hackathon/sentiment/SentimentApiApplication.java
```

Haz clic en **Run**.

---

### 📦 Modo Producción

Ejecuta el archivo `.jar` generado:

```bash
java -jar target/sentiment-api-0.0.1-SNAPSHOT.jar
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
