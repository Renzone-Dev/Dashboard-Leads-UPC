# Monitor de Caídas e Intermitencias CRM - UPC 🚨

El **Monitor de Caídas e Intermitencias CRM** es una aplicación web del tipo Single Page Application (SPA) diseñada para la **Módulo de Analítica y Auditoría Operacional de la UPC**. Su propósito principal es analizar cronológicamente la ingesta de prospectos (leads) captados por el CRM y detectar de forma automática brechas temporales inusuales (gaps) que sugieran caídas de servicio, retrasos en sincronización o problemas operacionales de middleware.

---

## 📌 Tabla de Contenidos
- [Propósito del Proyecto](#-propósito-del-proyecto)
- [Arquitectura y Stack Tecnológico](#-arquitectura-y-stack-tecnológico)
- [Características Principales](#-características-principales)
- [Reglas de Negocio y Métricas](#-reglas-de-negocio-y-métricas)
- [Mapeo de Columnas (Fuzzy Matching)](#-mapeo-de-columnas-fuzzy-matching)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instrucciones de Uso](#-instrucciones-de-uso)

---

## 🎯 Propósito del Proyecto

En el ámbito comercial y de captación, el tiempo de respuesta inicial ante un lead es crítico. Si un prospecto que ingresa de forma digital (por ejemplo, a través de campañas de WhatsApp o redes sociales) no se registra inmediatamente en el CRM debido a fallas técnicas, la probabilidad de conversión decae drásticamente.

Este monitor ayuda a los equipos de **Sistemas/TI** y **Negocio/Comercial** de la UPC a realizar auditorías continuas mediante la carga de exportaciones del CRM (Excel o CSV). El sistema analiza la secuencia de marcas de tiempo de los leads y reporta:
1. **Intermitencias detectadas:** Periodos de inactividad superiores a 5 minutos.
2. **Impacto comercial:** Leads estimados que no se recibieron durante las caídas de servicio.
3. **Continuidad Operativa:** Índice porcentual de disponibilidad técnica del sistema.
4. **Patrones temporales:** Horas y días de la semana con mayor concentración de fallas para optimizar mantenimientos y dimensionamiento de servidores.

---

## 💻 Arquitectura y Stack Tecnológico

El proyecto está diseñado bajo un paradigma de **Arquitectura Frontend Zero-Server** (totalmente autoejecutable en cliente), lo que garantiza privacidad total (los datos del CRM no se envían a ningún servidor externo).

*   **HTML5 & CSS3:** Estructuración semántica moderna con tipografía estilizada (`Inter` de Google Fonts).
*   **Tailwind CSS (v3 via CDN):** Sistema de diseño responsivo de primer nivel. Cuenta con una paleta cromática institucionalizada a partir de los colores de la UPC (Rojo `#D50000` y Oscuros).
*   **Chart.js (v4 via CDN):** Visualizaciones interactivas de alto rendimiento (Gráficos de Severidad, Concentración Horaria e Historial Diario).
*   **PapaParse (v5 via CDN):** Parser ultrarrápido y robusto de archivos CSV con detección de codificación de caracteres.
*   **SheetJS / XLSX (v0.18 via CDN):** Motor de análisis para archivos binarios de Excel (.xlsx y .xls) compatible con celdas de fecha nativas.
*   **html2pdf.js via CDN:** Generador de reportes en PDF en el cliente, optimizado para diseño A4 vertical.

---

## 🚀 Características Principales

### 1. Zona de Arrastre Inteligente (Drag & Drop)
Una interfaz amigable que acepta archivos arrastrados o seleccionados directamente desde el explorador. Soporta de forma robusta los formatos comunes de exportación del CRM.

### 2. Mapeo Automático y Calidad de Datos
El monitor incluye un diccionario inteligente de sinónimos de cabeceras en español (fuzzy/keyword matching). Sin importar si la columna original se llama `Fecha de creación` o `fecha_registro`, el sistema la vincula automáticamente. Adicionalmente, cuenta con un **Panel de Auditoría de Calidad** que detecta:
*   Registros Duplicados (Leads con idéntico identificador y timestamp).
*   Marcas de tiempo inválidas o corruptas.
*   Valores nulos en campos requeridos.

### 3. Dashboard KPI en Tiempo Real
Presenta métricas clave calculadas al vuelo sobre los datos importados:
*   **Leads Totales:** Cantidad global de registros sanos.
*   **Intermitencias CRM:** Cantidad total de brechas superiores a 5 minutos.
*   **Máxima Brecha:** El periodo consecutivo más largo sin leads, detallando la fecha y horas exactas.
*   **Frecuencia Promedio:** Intervalo habitual entre registros de leads en periodos activos.
*   **Continuidad Operativa (%):** Métrica de Uptime porcentual con semáforo visual inteligente (Verde/Ámbar/Rojo).
*   **Leads No Recibidos (Est.):** Estimación basada en la tasa de llegada promedio durante periodos de operatividad normal.
*   **Tiempo Promedio de Reparación (MTTR):** Duración media de los cortes detectados.

### 4. Paneles de Resumen Ejecutivo Dinámico
El sistema redacta automáticamente conclusiones analíticas diferenciadas para dos públicos objetivos:
*   **💼 Vista de Negocio:** Centrado en el impacto comercial, la pérdida potencial de conversión y el cumplimiento de los acuerdos de nivel de servicio (SLAs).
*   **💻 Vista de TI / Sistemas:** Enfocado en cuellos de botella del servidor, picos horarios de falla, fallos por hora del webhook y logs de duplicados.

### 5. Tabla de Incidentes Interactiva y Ordenable
Visualiza el listado detallado de todas las fallas técnicas registradas.
*   **Buscador integrado:** Filtra rápidamente incidentes ingresando códigos de leads anteriores o siguientes.
*   **Filtro por Severidad:** Visualización rápida de incidentes según su magnitud.
*   **Ordenamiento bidireccional en todas las columnas:** Permite ordenar de mayor a menor y viceversa haciendo clic en las cabeceras (ej. ordenar por *Duración* para ver los fallos más extensos primero).
*   **Paginación:** Segmentación de 10 registros por página para navegación fluida.

### 6. Exportación a PDF de Grado Profesional
Genera un informe completo listo para ser impreso o enviado por correo. Se activa un CSS exclusivo de impresión (`export-pdf-mode`) que limpia la pantalla de controles innecesarios (buscadores, botones, etc.), ajusta las dimensiones de las tarjetas de forma precisa y escala la resolución visual a formato A4 vertical sin cortes de contenido molestos.

---

## 📐 Reglas de Negocio y Métricas

El análisis temporal y la categorización se rigen estrictamente bajo las políticas operacionales vigentes:

### Clasificación de Severidad de Incidentes
Se calcula la diferencia en minutos entre el ingreso de un lead y el inmediatamente posterior. Toda diferencia superior a **5 minutos** activa una alerta:
*   **Baja:** De 5 a 10 minutos. Retrasos leves en la cola o microcortes de sincronización.
*   **Media:** De 10 a 20 minutos. Retrasos moderados.
*   **Alta:** De 20 a 40 minutos. Problemas considerables de latencia o concurrencia.
*   **Crítica:** Superior a 40 minutos. Caída del servidor IIS/Apache o pérdida de vinculación del webhook API.

### Fórmulas Clave
1.  **Continuidad Operativa (%):**
    $$\text{Continuidad} = \left( 1 - \frac{\text{Suma de la duración de todas las fallas en min}}{\text{Duración total del periodo en min}} \right) \times 100$$
2.  **Estimación de Leads Perdidos:**
    Se calcula la frecuencia promedio de leads por minuto (tasa de ingesta en periodos activos) y se multiplica por la duración total de inactividad técnica del CRM:
    $$\text{Tasa de Ingesta} = \frac{\text{Leads Totales}}{\text{Periodo Total en min} - \text{Duración Total de Fallas en min}}$$
    $$\text{Leads Perdidos Est.} = \text{Tasa de Ingesta} \times \text{Duración Total de Fallas en min}$$

---

## 📋 Mapeo de Columnas (Fuzzy Matching)

Para facilitar la flexibilidad en la exportación, el cargador mapea dinámicamente campos originales basándose en la siguiente tabla de equivalencias:

| Propiedad Interna | Nombre Mapeado Final | Expresiones del CRM Soportadas |
| :--- | :--- | :--- |
| `campana` | **Campaña** | Campaña de referencia, campana, campaña |
| `codigoPersona` | **Código de Persona** | Cod persona, Código de Persona, Cod. persona (contacto) (contacto) |
| `estado` | **Estado** | Sub estado, Estado |
| `fecha` | **Fecha** | Fecha de creación, fecha de creacion, fecha |
| `hora` | **Hora** | Hora |
| `periodo` | **Periodo** | Periodo (campaña de referencia) (campaña), periodo |
| `fuenteOrigen` | **Fuente Origen** | Fuente de origen (referente a) (contacto), fuente origen |
| `unidadNegocio` | **Unidad de Negocio** | Unidad de negocio (campaña de referencia), unidad de negocio |
| `direccion` | **Dirección** | Dirección, direccion |
| `canal` | **Canal** | Template Data HSM, canal |
| `segmento` | **Segmento** | Segmento |
| `codCampana` | **Cód de Campaña** | Código de campaña (campaña de referencia), cod de campaña |
| `idChattigo` | **ID Chattigo** | Chattigo conversation id, id chattigo |

---

## 📂 Estructura del Proyecto

El repositorio está estructurado de manera simple y limpia para facilitar su distribución y despliegue rápido:

```bash
Detección-Caídas-CRM/
│
├── crm.html        # Estructura de marcado, layouts responsivos y lógica de la aplicación
├── styles.css      # Sistema de diseño, colores institucionales y estilos de impresión PDF
└── README.md       # Esta guía técnica detallada de documentación
```

---

## 🛠️ Instrucciones de Uso

La portabilidad del sistema permite desplegarlo de forma inmediata sin necesidad de servidores Apache, Node.js ni bases de datos.

1.  **Descargar / Clonar** los archivos en tu máquina local.
2.  Hacer doble clic en el archivo [crm.html](file:///c:/Users/yry/Downloads/Antigravity/Detecci%C3%B3n-Ca%C3%ADdas-CRM/crm.html) para abrirlo en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox o Safari).
3.  Arrastrar el archivo Excel (`.xlsx`, `.xls`) o CSV del CRM a la **zona punteada superior**, o hacer clic para buscar el archivo localmente.
4.  El sistema cargará y mapeará los datos en menos de un segundo, mostrando los paneles de calidad, los KPIs generales, los gráficos visuales analíticos y la tabla de registros.
5.  Para ordenar los incidentes por cualquier columna (por ejemplo, buscar las mayores caídas), haz **clic sobre la cabecera correspondiente** de la tabla (como *Duración (Minutos)*). Haz un segundo clic para invertir el orden.
6.  Si deseas archivar o compartir los hallazgos, presiona el botón **📥 Exportar PDF** para guardar automáticamente un reporte ejecutivo en formato A4 listo para presentación.

---
*Módulo de Analítica y Auditoría Operacional &bull; UPC 2026*
