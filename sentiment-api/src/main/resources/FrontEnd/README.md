<<<<<<< HEAD
# FullStack-BrandPulse






<img width="1440" height="834" alt="githubpic2" src="https://github.com/user-attachments/assets/6b562c47-d38b-4fcb-9542-dc0dd1a14d2d" />







# 🚀 BrandPulse #

**BrandPulse** es una aplicación *full-stack* de última generación diseñada para analizar y visualizar el sentimiento de textos en tiempo real. Combina la potencia de un backend robusto con una interfaz moderna para transformar datos textuales en información accionable.
=======


---

🚀

---

# 🎨 Front End – API de Análisis de Sentimiento

Este proyecto corresponde al **Front End** de una **API de Análisis de Sentimiento**, el código está escrito en **Typescript**, utilizando **React** y **Vite**. Diseñada para procesar y visualizar resultados **positivos 😊, negativos 😠 y neutros 😐** de forma clara e interactiva.

## ▶️ Al ejecutar el proyecto de forma local trae consigo test hardcoded con un algoritmo simple con algunas palabras en inglés y español !

## ✨ Características principales

* 📊 **Visualización de resultados** mediante gráficos dinámicos
* 💬 **Globos interactivos** que resumen comentarios según el ratio y análisis del modelo
* 📱 **Interfaz gráfica responsive**, adaptable a cualquier dispositivo
* 📂 **Soporte para múltiples formatos de entrada**:

  * JSON
  * XML
  * PB
  * AVRO
    *(Configuración en desarrollo desde el Back End)*
* 🔄 **Devuelve los resultados en el mismo formato** que el archivo de entrada

---

## 🌌 Concepto Visual: El "Orbital"

El componente no es solo una gráfica; crea un sistema orbital. En el centro hay una **cara pixelada** (`PixelFace`) que representa el sentimiento general, y alrededor de ella orbitan "nodos" de datos que representan fragmentos específicos de texto (snippets) y entrega globo con el mejor comentario, el peor o uno random neutro.

### 1. Funcionalidades Principales

* **Gestión de Nodos (Data Orbit):** Mediante un `useEffect`, el código toma el resultado del análisis (`result`) y genera una lista de nodos. Algunos son datos reales (el mejor comentario, el peor y uno neutro) y otros son datos simulados ("mock data") para rellenar la órbita y darle dinamismo.
* **Interactividad:** Cada nodo en la órbita es clickable. Al hacer clic en un pequeño cuadrado (voxel), este se vuelve el `activeNode`.
* **Visualizador de Detalles:** Cuando un nodo está activo, aparece un cuadro flotante con un efecto de desenfoque (`backdrop-blur`) que muestra el texto específico de ese fragmento de sentimiento, simulando una terminal de comandos con el prefijo `>`.
* **Tematización Dinámica:** Soporta tres modos visuales a través de la prop `theme`:

  * **NEON:** Estilo ciberpunk con bordes brillantes.
  * **LIGHT:** Estilo claro con sombras sólidas y marcadas (estilo retro/brutalista).
  * **DARK:** Estilo oscuro estándar.

### 2. Detalles Técnicos Interesantes

* **Matemáticas de Posicionamiento:** Usa transformaciones de CSS para colocar los nodos en un círculo:

  ```javascript
  transform: `rotate(${node.angle}deg) translate(140px) rotate(-${node.angle}deg)`
  ```

  Esto rota el elemento, lo aleja del centro 140px y luego deshace la rotación del contenido para que el texto o el cuadrado no queden de cabeza.

* **Animaciones:**

  * Tiene una pista circular que gira infinitamente (`animate-[spin_60s_linear_infinite]`).
  * Los nodos tienen transiciones suaves y efectos de escala al pasar el mouse.
  * El cuadro de texto usa `animate-in` (probablemente de Tailwind CSS Animate) para aparecer con un deslizamiento.

* **Lógica de Colores:**

  * Clasifica todo por colores semánticos:

    * Verde para positivo (#10b981)
    * Rojo para negativo (#f43f5e)
    * Ámbar para neutro (#f59e0b)

---

🌐 **JSON Para copiar y pegar de prueba en la caja de texto de la aplicación en el navegador:**

```json
{
  "comentarios": [
    {
      "id": 1,
      "tipo": "positivo",
      "usuario": "usuario_01",
      "fecha": "2025-12-20",
      "puntaje": 5,
      "texto": "La aplicación es muy intuitiva y funciona sin problemas."
    },
    {
      "id": 2,
      "tipo": "negativo",
      "usuario": "usuario_02",
      "fecha": "2025-12-21",
      "puntaje": 2,
      "texto": "La app es lenta y se cierra en algunas ocasiones."
    },
    {
      "id": 3,
      "tipo": "neutro",
      "usuario": "usuario_03",
      "fecha": "2025-12-22",
      "puntaje": 3,
      "texto": "Cumple con su función básica, pero no ofrece nada especial."
    }
  ]
}
```

---

## ⚠️ Disclaimer / Recomendaciones

🚀 **Se recomienda usar `pnpm` en lugar de `npm`** por su mejor rendimiento y manejo de dependencias.

🔐 Si decides usar `npm`, se recomienda instalar **Socket.dev** para mayor seguridad en la instalación y análisis de dependencias.

---

## 📦 Instalación de PNPM (recomendado)

```bash
npm install -g pnpm@latest-10
```

🌐 Documentación oficial:
👉 [https://pnpm.io/es/](https://pnpm.io/es/)

---

## 🛡️ Instalación de Socket.dev

```bash
pnpm install -g socket
```

🌐 Más información:
👉 [https://socket.dev/](https://socket.dev/)

---

## ▶️ Ejecutar el proyecto de forma local

### 🔧 Prerrequisitos generales

* Node.js
* NVM (Node Version Manager)

---

### 🟢 Usando **npm**

1. Instalar dependencias:

   ```bash
   npm install
   ```
2. Ejecutar la aplicación:

   ```bash
   npm run dev
   ```

---

### 🟣 Usando **pnpm** (recomendado ⭐)

**Prerrequisitos adicionales:**

* pnpm instalado

1. Instalar dependencias:

   ```bash
   pnpm install
   ```
2. Ejecutar la aplicación:

   ```bash
   pnpm run dev
   ```
3. Pnpm y Vite corren la app de forma local direccionando el puerto:

```terminal--->
  localhost...
  network...
```
>>>>>>> branch-frontend

---


<<<<<<< HEAD
## 📋 Sobre el Proyecto

BrandPulse permite a las empresas y desarrolladores medir la opinión de los clientes, monitorear la percepción de marca o analizar grandes volúmenes de texto. Utiliza una arquitectura avanzada que integra:

- ⚙️ **Backend potente** basado en Java.
- 🎨 **Frontend dinámico** con React.
- 📊 **Analítica histórica** para identificar tendencias.

---


## ✨ Características

- ⚡ **Análisis en Tiempo Real:** Clasificación instantánea de sentimientos (positivo, negativo, neutral) con puntuaciones de confianza precisas.
- 📊 **Panel de Analíticas:** Visualización de tendencias mediante gráficos interactivos para entender la distribución del sentimiento a lo largo del tiempo.
- 🌐 **API RESTful:** Una API robusta construida con Spring Boot para procesar solicitudes y servir datos estadísticos.
- 🧠 **Integración con ONNX:** Uso de modelos de Machine Learning preentrenados en formato ONNX para predicciones ultrarrápidas.
- 🗄️ **Registro de Solicitudes:** Seguimiento automático en base de datos para auditoría y análisis de datos históricos.
- 💻 **Interfaz Interactiva:** UI moderna y amigable desarrollada con React y TypeScript.

---


## 🛠️ Tecnologías Utilizadas

### ⚙️ Backend
- **Java** ☕
- **Spring Boot:** Framework para la creación de la API REST.
- **JPA (Hibernate):** Gestión y persistencia de datos.
- **ONNX Runtime:** Motor de ejecución para el modelo de IA.
- **Maven:** Gestión de dependencias y construcción.

### 🎨 Frontend
- **React** ⚛️
- **TypeScript:** Tipado estático para un código más seguro.
- **Vite:** Herramienta de construcción rápida para el frontend.
- **Chart.js:** Biblioteca de visualización para gráficos interactivos.

### 🗄️ Base de Datos
- **PostgreSQL** 🐘

---
=======
>>>>>>> branch-frontend
