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




<img width="1440" height="900" alt="Screenshot from 2026-01-14 18-25-31" src="https://github.com/user-attachments/assets/2f9e6ca0-bce8-49c2-b56e-1385990d589a" />

---

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

### ▶️ Ejecución Local (Frontend)

**Requisitos**

* 📌Node.js
* 📌NVM (Linux) o Chocolatey (Windows)
* 📌pnpm (Para el Build)

**Instrucción de instalación (requisitos para Build)** 

✅Descarga node.js en Linux:

```Linux bash
# Descarga e instalal nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Descarga e instala Node.js:
nvm install 24

# Verifica the Node.js version:
node -v # Should print "v24.13.0".

# Verifica npm version:
npm -v # Should print "11.6.2".



✅Descarga node.js en Windows:

```
```Windows bash

# Descarga e instala Chocolatey:
powershell -c "irm https://community.chocolatey.org/install.ps1|iex"

# Descarga e instala Node.js:
choco install nodejs --version="24.13.0"

# Verifica the Node.js version:
node -v # Should print "v24.13.0".

# Verifica npm version:
npm -v # Should print "11.6.2".


```


✅Instalar PNPM de forma global - bash
```

# Ejecuta el siguiente comando para instalar pnpm de forma global:
npm install -g pnpm


# Verifica la instalación escribiendo:
pnpm -v



```

**Una vez instalado lo anterior sigue estos pasos para el Build**

1- Abre el proyecto en tu IDE ✅
2- haz "cd sentiment-api/ " (FullStack-BrandPulse-main/sentiment-api) ✅
3- (dentro de sentiment-api/)haz ./mvnw clean install (para el Build completo del proyecto: dependencias, test Junit y el.jar) ✅
5- Una vez teniendo el maven Springboot "BUILD SUCCESS" en consola ve al 6to o 7mo paso ✅
6- Para desarrollo haz RUN en "SentimentApiApllication.java": FullStack-BrandPulse-main/sentiment-api/src/main/java/com/hackathon/sentiment/SentimentApiApplication.java ✅
7- O Para Producción: Ejecuta el .jar (SNAPSHOT.jar) en FullStack-BrandPulse-main/sentiment-api/target/sentiment-api-0.0.1-SNAPSHOT.jar ✅


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
