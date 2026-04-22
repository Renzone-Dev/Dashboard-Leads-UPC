# Documentación Técnica y de Mejoras: Dashboard Traffic UPC

Este documento resume la funcionalidad principal, correcciones y mejoras de diseño que se han implementado en el proyecto **Dashboard Analítico de Leads (Monitor de Captación de Tráfico - CRM)**.

## Visión General: ¿Para qué sirve este Dashboard?

El **Dashboard Traffic UPC** es una herramienta analítica web autónoma (HTML, CSS, JS) diseñada para visualizar y analizar el rendimiento diario de la captación de leads en el CRM institucional. Su objetivo principal es permitir a los líderes y analistas de marketing tomar decisiones estratégicas basadas en datos en tiempo real.

**Principales Casos de Uso:**
- **Monitoreo de Volumen:** Controlar cuántos leads totales ingresan y qué porcentaje corresponde a tráfico orgánico/directo (*Inbound*) versus esfuerzos de contacto saliente (*Outbound*).
- **Análisis de Rendimiento por Canal y Campaña:** Identificar qué campañas de marketing o canales (WhatsApp, Email, etc.) están generando el mayor volumen de registros.
- **Identificación de Patrones (Estacionalidad semanal):** Conocer qué días de la semana atraen más tráfico cruzado con la dirección (Inbound/Outbound) a través de un mapa de calor/tabla dinámica, permitiendo optimizar el presupuesto publicitario.
- **Insights Automatizados:** Generar frases descriptivas dinámicas que resumen el comportamiento de la data filtrada al instante.

## 1. Actualizaciones Recientes

> [!NOTE]
> **Mejora Visual: Gráfico de Torta (Pie) para Top Campañas**
> Se cambió la representación visual del bloque "Top Campañas" de un gráfico de barras horizontales a un gráfico de torta (Pie Chart), permitiendo una mejor visualización de la proporción que cada campaña representa respecto al top 5 total. Además, se le aplicó la paleta de colores institucional.

> [!NOTE]
> **Nuevo Gráfico de Análisis por Canal**
> Se integró un nuevo bloque gráfico llamado **"Comparativa por Canal"** que acompaña a la sección de "Top Campañas". Este gráfico de barras horizontales permite visualizar y comparar rápidamente el volumen de captación de leads distribuido por los distintos canales de comunicación (ej. WhatsApp, Email, SMS, Facebook). Esta gráfica complementa el análisis de campañas aportando visibilidad directa sobre las herramientas de contacto más efectivas.

## 2. Correcciones Estructurales y de Datos

> [!IMPORTANT]
> Se solucionaron errores críticos que impedían la carga y lectura correcta de las bases de datos exportadas desde Excel.

- **Manejo Dinámico de Codificación (Encoding):**
  - Se reemplazó el lector tradicional de texto por `FileReader.readAsArrayBuffer()`.
  - Se implementó un sistema inteligente con `TextDecoder` que intenta leer el archivo primero en `UTF-8`. Si detecta caracteres corruptos, hace un *fallback* automático a `windows-1252` (ANSI).
  
- **Normalización Robusta de Columnas (PapaParse):**
  - Para evitar que variaciones en los nombres de las columnas rompan el dashboard, se añadió un proceso de limpieza. 
  - Se eliminan espacios extra, se quitan tildes usando `.normalize("NFD")` y se pasa todo a minúsculas antes de mapear.

## 3. Nuevas Funcionalidades (Filtros Avanzados)

Se ampliaron las capacidades de filtrado interactivo. Ahora el usuario puede segmentar la data cruzando hasta 6 variables en tiempo real:

- Campaña
- Canal
- Segmento
- **Fecha** 
- **Semana** 
- **Dirección** 

> [!NOTE]
> **Filtros en Cascada (Dinámicos)**
> Los filtros ahora son inteligentes y dependientes. Al seleccionar un valor en cualquiera de los filtros (por ejemplo, una Campaña específica), las opciones de los demás filtros (Canal, Segmento, Fecha, etc.) se actualizan automáticamente para mostrar **solo los datos que están disponibles** bajo esa selección. Esto evita que el usuario vea opciones vacías o sin resultados, mejorando la experiencia de exploración de datos.

Todos los gráficos, tarjetas (KPIs) y la tabla cruzada responden inmediatamente a la combinación de estos 6 selectores.

## 4. Rediseño UX/UI Minimalista

> [!TIP]
> El dashboard pasó de un diseño tosco con bordes pesados a una interfaz plana, moderna y profesional, alineada con tendencias corporativas de UI.

- **Tarjetas y Contenedores (Cards):**
  - Se añadieron bordes sutiles grises, bordes redondeados suaves y sombras ligeras.
- **Tipografía:**
  - Se implementó la fuente **Inter** de Google Fonts para garantizar limpieza y legibilidad.
- **Gráficos (Chart.js):**
  - Se eliminó el "ruido visual" quitando las líneas de cuadrícula (grid) de los fondos.
  - Se afinó la paleta de colores para usar el rojo de la marca (UPC) y grises sofisticados.

## 5. Lógica de Cálculo y Fórmulas del Dashboard

- **Total de Leads (KPI):** Conteo de valores únicos de la columna `Cod Persona` para evitar data duplicada.
- **Porcentajes de Inbound / Outbound:** Clasificación estricta mediante limpieza de strings.
- **Día de mayor rendimiento (Mejor Día):** Moda estadística por iteración cruzada.
- **Tabla Dinámica (Pivot Table):** Intersección de Dirección vs Día de la semana contando entidades únicas.

---
**Estado Actual:** Proyecto estabilizado, tolerante a errores de exportación, interactivo y con una presentación ejecutiva óptima, integrando analítica completa de campañas y canales.
