El ecosistema del proyecto Marketing Hub (excluyendo la carpeta de versiones) está diseñado como una plataforma frontend unificada para el control, auditoría e inteligencia operacional del flujo de admisión comercial de las tres instituciones de Laureate Perú: UPC, UPN y CIBERTEC.

1. Portal de Acceso Principal: Home/
Es el punto de entrada centralizado del proyecto. Consiste en una pantalla estática premium (HTML/CSS/JS vanilla) que presenta las marcas y redirige al usuario a sus respectivos módulos.

Efectos visuales: Animación de máquina de escribir (typewriter) dinámica en el título, fondo animado deslizante y un efecto interactivo de seguimiento de cursor (glow tracker) en 3D sobre las tarjetas.
Diseño Responsivo: Totalmente adaptado para móviles (tarjetas horizontales compactas usando CSS Grid, scroll habilitado y fuentes escaladas).
2. Estructura de Módulos por Institución
Cada institución en el ecosistema está configurada para alojar dos herramientas analíticas principales de auditoría:

Monitoreo-CRM: Monitor de caídas e intermitencias para auditar brechas temporales (gaps superiores a 5 minutos) en el registro de prospectos dentro del CRM.
Monitoreo-Leads: Panel para auditar la procedencia, volumen e integridad de la captura de contactos comerciales.
