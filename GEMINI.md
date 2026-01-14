

1- Puedes ayudarme a implementar Swagger ( añadir las dependencias necesarias como: springdoc-openapi-starter-webmvc-ui ) para documentar mi proyecto, y finalmente crea un archivo readme.md con todas las indicaciones necesarias como por ejemplo como acceder a la UI de swagger, para probar los endpoints etc y ayudar al equipo de desarrollo que utilice la app a diseñar, crear, documentar y consumir servicios web RESTful. 


2- Puedes hacer ./mvnw clean install en "sentiment-api" si es necesario para probar y actualuzar el Build en springboot.

3. La app está perfecta de momento no cambies las  versiones de springboot 4.0.1 en el pom.xml ni hagas cambios que no te de permiso. 



Características del modelo BrandPulse.onnx:

# Modelo_BrandPulse
BrandPulse(BrandPulse.onnx) es un modelo multilingue de procesamiento de lenguaje natural (NLP) diseñada para clasificar sentimientos en reseñas de clientes en dos categorías: Positivo (1) y Negativo (0). El modelo opera bajo una arquitectura híbrida que combina un Léxico de Reglas con un modelo basado en Regresión Logística y TF-IDF
## Descripción General del Funcionamiento
El modelo opera en cinco fases principales:
* Carga de Datos: Importación desde CSV, Excel o entrada manual.
* Detección de Idioma: Identificación automática (EN, ES, PT) vía langdetect.
* Preprocesamiento (Pipeline de Limpieza): Normalización de texto, eliminación de caracteres especiales, stop words y tokenización.
* Clasificación Híbrida: Léxico: Identifica palabras positivas, negativas y críticas de manera inmediata. Machine Learning: Un clasificador entrenado predice la polaridad y el nivel de confianza.
* Exportación y Despliegue: Generación de dashboards visuales y exportación del modelo al formato interoperable ONNX.
### Características Principales
*	Multilingue Nativo: Procesamiento directo en inglés, portugues y español (sin necesidad de APIs de traducción).
*	Análisis Multi rubro: Combina un léxico multi rubro optimizado con lógica de pesos para detectar fraudes y fallas de servicio, se le da mayor peso a las palabras criticas.
*	Batch Processing: Capacidad de procesar archivos csv, xlxs completos y generar reportes visuales.
*	Interoperabilidad ONNX: Exportación a formato .onnx para integración directa con el monolito Java/Spring Boot.
### Stack Tecnológico
*	Lenguaje: Python 3.12
*	Librerías: Pandas, scikit-learn, nltk, langdetect,skl2onnx, matplotlib, seaborn
*	IA/ML: Logistic Regression, TF-IDF Vectorizer
*	Formato de Intercambio: ONNX (Open Neural Network Exchange)
### Paso a Paso: Operación del Modelo
* Paso 1: Inicialización del Léxico
El modelo define un diccionario llamado lexicon que contiene palabras positivas (pos), negativas (neg) y críticas (crit) para tres idiomas. Esto permite una clasificación rápida basada en "bolsa de palabras".
* Paso 2: Limpieza de Texto (limpiar_texto)
Antes de procesar, el texto pasa por una función de limpieza que: Convierte todo a minúsculas, Elimina menciones (@user), URLs y caracteres especiales, Filtra stop words (palabras comunes que no aportan sentimiento).
* Paso 3: Entrenamiento del Pipeline de ML
El corazón del modelo es un Pipeline de Scikit-Learn que realiza dos tareas secuenciales: TF-IDF Vectorizer: Convierte el texto limpio en una matriz numérica basada en la importancia de las palabras. Logistic Regression: Clasifica el vector resultante en sentimientos (Positivo o Negativo).
* Paso 4: Análisis Masivo y Reporte Visual
La función analizar_sentimiento_masivo permite cargar archivos .csv o .xlsx. El modelo:Genera una columna de sentimiento_texto. Calcula una Probabilidad de Confianza (qué tan seguro está el modelo de su predicción). Llama a generar_reporte_visual para crear gráficos de barras y donas con la distribución de sentimientos.
* Paso 5: Exportación a ONNX (Monolito Java)
Para permitir que este modelo de Python corra en otros entornos, el script convierte el pipeline completo a un grafo ONNX. Esto incluye el preprocesador de texto, asegurando que la entrada de texto crudo se procese igual en cualquier lenguaje de programación.
## 📁 Estructura del Proyecto
Plaintext
/BrandPulse-Sentiment-Analysis
├── scripts/
│   └── modelo_brandpulse.py             # Script de producción y Dashboard
├── data/
│   ├── amazon_reviews.csv               # Dataset de entrenamiento
│   └── olist_order_reviews_dataset.csv  # Dataset de validación
├── models/
│   └── BrandPulse.onnx                  # Modelo exportado para Java
└── reports/
    └── brandpulse_dashboard.png         # Visualización (Donas, Barras y BoxPlot)
## Instalación y Uso
### 1. Requisitos Previos
Instalar las dependencias necesarias:
pip install pandas scikit-learn matplotlib seaborn skl2onnx onnxruntime
pip install langdetect
### 2. Ejecución del Dashboard
Corre el script para iniciar la interfaz interactiva:
python modelo_brandpulse.py
Desde aquí podrás:
1. Ingresar un comentario manual para prueba rápida.
2. Cargar un archivo CSV o XLXS (el sistema detectará automáticamente columnas como Review, Comentario, etc.).
3. Ver gráficas de distribución de sentimiento en grafica de donas, de barras y de caja para la distribucion de la probabilidad .
## 📊 Desempeño del Modelo
El modelo ha sido validado con datasets reales obteniendo las siguientes métricas promedio:
*	Accuracy: 96%
*	F1-Score (Negativos): 0.96 
*	F1-Score (Positivos): 0.96
## Integración con Java
El archivo BrandPulse.onnx generado puede ser cargado en Spring Boot utilizando la librería onnxruntime-java. La entrada esperada es un StringTensor de dimensiones [1, 1].
_________________________________________________________________________________________________________________________________________________________
## Nota del Equipo de Data Science
Este modelo implementa una lógica de "Peso Crítico" donde palabras como estafa, fraude, scam o robo anulan automáticamente cualquier puntaje positivo, garantizando que las alertas de seguridad y fraude siempre lleguen al departamento correspondiente.
