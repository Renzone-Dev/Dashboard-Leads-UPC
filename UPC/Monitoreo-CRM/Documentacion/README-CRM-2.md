# **Monitor de Caídas e Intermitencias CRM - UPC**







El proyecto \*\*Monitor de Caídas e Intermitencias CRM - UPC\*\* está diseñado para analizar la consistencia y continuidad del flujo de leads recibidos en el CRM mediante la carga de un archivo (CSV o Excel). A continuación, te detallo cuáles son las columnas utilizadas y la lógica operativa del sistema.



\---



\### 1. Columnas Utilizadas



Para realizar los análisis y cálculos, el sistema intenta mapear automáticamente (o mediante asignación manual en la UI) las columnas del archivo cargado a los siguientes campos del sistema:



\*   \*\*Para el cálculo de marcas de tiempo y detección de caídas (Críticos):\*\*

&#x20;   \*   \*\*Fecha\*\* (`Fecha` / `fecha\\\_creacion` / `fecha\\\_registro` / etc.): Columna clave para obtener el día en el que entró el lead.

&#x20;   \*   \*\*Hora\*\* (`Hora` / `hora`): Columna clave con la hora exacta (por ejemplo, `14:35:10` o `02:35 PM`).

&#x20;   \*   \*Nota: Ambos campos se combinan mediante el motor de parseo en un objeto de tiempo global (`\\\_timestamp`) que se ordena cronológicamente.\*

\*   \*\*Para auditoría de calidad de datos y unicidad:\*\*

&#x20;   \*   \*\*Código de Persona\*\* (`Código de Persona` / `cod\\\_persona` / etc.): Identificador del cliente. Se usa junto a la marca de tiempo para auditar duplicados exactos y detectar registros nulos o sin información crítica.

&#x20;   \*   \*\*ID Chattigo\*\* (`ID Chattigo` / `chattigo\\\_conversation\\\_id` / etc.): ID de conversación alternativo usado para validar transacciones.

\*   \*\*Para clasificación y diagnóstico inteligente:\*\*

&#x20;   \*   \*\*Canal\*\* (`Canal` / `canal`): Canal de entrada (por ejemplo, \*WhatsApp\*, \*Web\*, etc.). Se usa para categorizar qué vía está sufriendo interrupciones.

&#x20;   \*   \*\*Unidad de Negocio\*\* (`Unidad de Negocio`), \*\*Campaña\*\* (`Campaña`) y \*\*Segmento\*\* (`Segmento`): Se usan como dimensiones de agrupación y filtros reactivos que recalculan las métricas en tiempo real.

\*   \*\*Otros campos informativos:\*\*

&#x20;   \*   `Estado`, `Periodo`, `Dirección`, `Cód de Campaña` y `Fuente Origen`.



\---



\### 2. Lógica de Negocio y Fórmulas de Cálculo



Toda la lógica de procesamiento está detallada en \[logic\_and\_formulas.txt](file:///c:/Users/yry/Downloads/Antigravity/Monitoreo-Caidas-CRM/Documentacion/logic\_and\_formulas.txt). Los cálculos principales que realiza el archivo \[main.js](file:///c:/Users/yry/Downloads/Antigravity/Monitoreo-Caidas-CRM/js/main.js) son:



\#### A. Detección de Incidentes (Gaps)

Una vez ordenados cronológicamente los leads, calcula el intervalo transcurrido entre un lead y el siguiente:

$$\\text{Gap Minutos} = \\frac{\\text{Timestamp Lead Actual} - \\text{Timestamp Lead Anterior}}{60,000}$$

Si el intervalo es \*\*mayor a 5 minutos\*\*, se registra un incidente de caída operativa y se clasifica por severidad:

\*   \*\*Baja:\*\* Entre 5 y 10 minutos.

\*   \*\*Media:\*\* Mayor a 10 y hasta 20 minutos.

\*   \*\*Alta:\*\* Mayor a 20 y hasta 40 minutos.

\*   \*\*Crítica:\*\* Mayor a 40 minutos.



\#### B. Disponibilidad Comercial (Uptime %)

Para evitar falsos positivos por la inactividad nocturna habitual, el cálculo de disponibilidad se limita al \*\*Horario Comercial Hábil\*\*:

\*   \*Lunes a Viernes:\* 9:00 AM a 9:00 PM (12 horas hábiles al día).

\*   \*Sábados:\* 9:00 AM a 7:00 PM (10 horas hábiles).

\*   \*Domingos:\* No se computan horas hábiles.



La fórmula de Uptime es:

$$\\text{Disponibilidad \\%} = \\left(1 - \\frac{\\text{Minutos Caídos en Horario Comercial}}{\\text{Minutos Totales Hábiles en el Periodo}}\\right) \\times 100$$



\#### C. Leads Perdidos Estimados

Calcula el volumen aproximado de leads no capturados durante las interrupciones basándose en la velocidad de ingreso cuando la plataforma opera con normalidad (periodos estables con intervalos $\\le 5$ minutos):

1\.  \*\*Tasa de entrada estable:\*\* $\\text{Tasa Leads/Minuto} = \\frac{\\text{Leads Procesados}}{\\text{Tiempo Activo}}$ (donde Tiempo Activo es el Tiempo Total menos el Tiempo Caído).

2\.  \*\*Estimación:\*\* $\\text{Leads Perdidos} = \\text{Tasa Leads/Minuto} \\times \\text{Duración de la Caída}$



\#### D. Score de Salud Global (Health Score)

Es una calificación de 0 a 100 calculada mediante 4 componentes ponderados:

1\.  \*\*Score de Disponibilidad\*\* (Máximo 40 pts): Proporcional al Uptime %.

2\.  \*\*Control de Incidentes Críticos\*\* (Máximo 30 pts): Penaliza restando 10 pts por cada incidente Crítico ($>40$ min).

3\.  \*\*Tiempo Caído Acumulado\*\* (Máximo 20 pts): Penaliza según el volumen total de minutos de inactividad.

4\.  \*\*Frecuencia entre Leads\*\* (Máximo 10 pts): Penaliza si la frecuencia promedio en periodo estable supera los 5 minutos.



\#### E. Diagnóstico de Causas Probables (Heurísticas)

Clasifica de manera automática los riesgos operacionales en \*\*Bajo\*\*, \*\*Medio\*\* o \*\*Alto\*\* para cada uno de estos componentes:

\*   \*\*Saturación de Webhook:\*\* Evalúa caídas críticas en horas de alta demanda.

\*   \*\*WhatsApp API:\*\* Se activa si WhatsApp es el canal con mayor porcentaje de incidentes ($>40\\%$).

\*   \*\*Servidores / Base de Datos CRM:\*\* Riesgo alto si la disponibilidad general es menor al $90\\%$ o hay más de 3 incidentes críticos.

\*   \*\*Integración con Landings:\*\* Evalúa si los incidentes se concentran en formularios web.

\*   \*\*Calidad del Dato:\*\* Evalúa el porcentaje de registros corruptos, duplicados o incompletos. Si la calidad del dato cae por debajo de $95\\%$, se marca como riesgo de segmentación.

