# Documentación Técnica — Marketing Hub: Home Centralizado

> **Proyecto:** Marketing Hub — Pantalla de Inicio  
> **Ruta:** `Marketing Hub/Home/`  
> **Última actualización:** Julio 2026  
> **Diseño base:** Stitch (Google) — Proyecto *UPC Marketing Analytics Hub*

---

## 1. Descripción General

El **Home Centralizado** es el punto de entrada del ecosistema Marketing Hub. Su función es presentar las tres instituciones de Laureate Perú — **UPC**, **UPN** y **CIBERTEC** — y redirigir al usuario hacia el módulo correspondiente con un clic.

La pantalla está diseñada como una **Single Page** sin backend, completamente estática (HTML + CSS + JS vanilla), con efectos visuales de alta calidad para generar una primera impresión premium.

---

## 2. Estructura de Archivos

```
Marketing Hub/Home/
│
├── index.html                  ← Estructura principal de la pantalla
├── css/
│   └── styles.css              ← Estilos, design tokens, animaciones
├── js/
│   └── main.js                 ← Interacciones y efecto typewriter
├── assets/
│   ├── ico-laureate.ico        ← Favicon para la pestaña del navegador
│   ├── logo-upc.png            ← Logo institucional UPC
│   ├── logo-upn.png            ← Logo institucional UPN
│   ├── logo-cibertec.png       ← Logo institucional CIBERTEC
│   └── trama-upc-upn-cib.png  ← Patrón de fondo animado (trama de logos)
└── Documentacion/
    └── README.md               ← Este archivo
```

---

## 3. Arquitectura de Capas (z-index)

La pantalla usa un sistema de capas apiladas:

```
z-index 10  →  .main-canvas        (contenido principal: header + cards + footer)
z-index  0  →  .atmospheric-glow  (bola de luz roja difusa, centrada, position: fixed)
z-index  0  →  .absolute-layer    (capa del patrón de fondo animado, position: fixed)
```

---

## 4. Componentes Visuales

### 4.1 Fondo Animado — `.animated-logo-bg`

| Propiedad | Valor |
|---|---|
| Imagen | `assets/trama-upc-upn-cib.png` |
| Modo | Mosaico repetido (`background-repeat: repeat`) |
| Tamaño de tile | `900px` |
| Opacidad | `0.03` (3% — muy sutil) |
| Animación | `slide-up` — desplazamiento vertical ↑ infinito |
| Duración | 60 segundos, lineal |

```css
@keyframes slide-up {
    from { background-position: 0 0; }
    to   { background-position: 0 -1000px; }
}
```

### 4.2 Brillo Atmosférico — `.atmospheric-glow`

Esfera de luz roja (`rgba(182, 0, 34, 0.05)`) de `800×800px` centrada en la pantalla, con `blur(120px)`. Evoca la identidad de marca sin ser intrusiva.

### 4.3 Título con Efecto Typewriter

El `<h1 id="main-title">` se renderiza **vacío** en el HTML. JavaScript lo anima al cargar:

**Secuencia de animación:**
1. Aparece el cursor parpadeante `▌` (`.tw-cursor`)
2. Después de **400ms**, empieza a escribir `"Bienvenido a "` (55ms/carácter)
3. Al terminar el prefijo, se crea el `<span class="gradient-brand">` y escribe `"Marketing Hub"`
4. Después de **800ms** de finalizar, el cursor desaparece

**Efecto degradado en "Marketing Hub":**

```css
.gradient-brand {
    background: linear-gradient(90deg, #E3000F 0%, #FFB700 50%, #004165 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

Los tres colores corresponden a las instituciones:

| Color | Hex | Institución |
|---|---|---|
| Rojo | `#E3000F` | UPC |
| Amarillo | `#FFB700` | UPN |
| Azul oscuro | `#004165` | CIBERTEC |

**Tamaño del título:** `55px` / `font-weight: 700` / `letter-spacing: -0.02em`

---

## 5. Design System (Tokens CSS)

Definidos en `:root` dentro de `styles.css`:

```css
/* Paleta institucional */
--cibertec-primary: #004165;
--cibertec-hover:   #00314d;

--upn-primary: #FFB700;
--upn-hover:   #e6a500;
--upn-dark:    #1c1b1b;

--upc-primary: #E3000F;
--upc-hover:   #c6000d;

/* Superficie */
--background-color: #f8f9fb;
--on-background:    #191c1e;
--secondary-color:  #5f5e5e;

/* Tipografía */
--font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

---

## 6. Cards de Instituciones

### 6.1 Estructura HTML de cada card

```html
<button class="brand-btn group [marca]" data-brand="[marca]" aria-label="Acceder a [Marca]">
    <div class="card-glow"></div>       <!-- Efecto glow en hover -->
    <div class="icon-container">
        <img src="assets/logo-[marca].png" alt="[Marca]" class="brand-logo">
    </div>
    <span class="brand-name">[Nombre]</span>
    <p class="brand-description">[Descripción breve]</p>
    <div class="action-btn">Acceder</div>
</button>
```

### 6.2 Propiedades del contenedor de logo `.icon-container`

| Propiedad | Valor |
|---|---|
| Dimensiones | `140 × 80px` |
| Border-radius | `12px` |
| Padding | `10px 14px` |
| Fondo | Color primario de la institución |
| Hover scale | `scale(1.05)` |

### 6.3 Tabla de Instituciones

| Institución | Logo | Fondo del ícono | Color nombre | Botón (Fondo/Texto) | Descripción |
|---|---|---|---|---|---|
| **UPC** | `logo-upc.png` | `#E3000F` rojo | `#E3000F` | Rojo / Blanco | Todo lo que necesitas, en un solo lugar. |
| **UPN** | `logo-upn.png` | `#FFB700` amarillo | `#1c1b1b` | Amarillo / Blanco | Analiza indicadores y métricas |
| **CIBERTEC** | `logo-cibertec.png` | `#004165` azul | `#004165` | Azul / Blanco | Monitorea el seguimiento comercial. |

### 6.4 Efectos de interacción (hover)

| Efecto | Descripción |
|---|---|
| `translateY(-4px)` | La card (`.brand-btn`) sube 4px al hacer hover. |
| `box-shadow` amplificado | Sombra de la card se difumina a `0 25px 50px -12px rgba(0,0,0,0.08)`. |
| `.card-glow` activo | Brillo radial del color institucional desde el punto del cursor. |
| `.icon-container` escala | El contenedor del logo crece a `scale(1.05)`. |
| Botón "Acceder" animado | El botón se oscurece con el color `*-hover`, se eleva con `translateY(-2px)`, escala a `scale(1.02)` y activa un resplandor (glow) difuminado con su respectiva sombra institucional. |

### 6.5 Glow dinámico (seguimiento del cursor)

`main.js` escucha `mousemove` en cada card y posiciona `.card-glow` en las coordenadas exactas del cursor dentro de la card, creando un efecto de iluminación radial que sigue al mouse.

---

## 7. Navegación y Rutas

Al hacer clic en una card, se ejecuta una micro-animación de escala (`scale(0.98)`, `opacity: 0.86`) durante **180ms**, luego se redirige:

| Institución | Ruta destino |
|---|---|
| **UPC** | `../UPC/Monitoreo-Leads/Dashboard.html` |
| **UPN** | `../UPN/Monitoreo-CRM/Dashboard.html` |
| **CIBERTEC** | `../CIBERTEC/Monitoreo-CRM/Dashboard.html` |

> **Nota:** Las rutas apuntan directamente al dashboard unificado correspondiente de cada institución dentro de su respectiva carpeta.

---

## 8. Footer de Confianza

Barra inferior con tres indicadores de credibilidad, renderizados con **Material Symbols Outlined**:

| Ícono | Texto |
|---|---|
| `lock` | Acceso Seguro |
| `bolt` | Real-time Data |
| `cloud_done` | Cloud |

Aparece con `opacity: 0.6` y animación `fadeInUp` con delay de `0.3s`.

---

## 9. Favicon

```html
<link rel="icon" type="image/x-icon" href="assets/ico-laureate.ico">
```

Archivo: `assets/ico-laureate.ico` — Ícono corporativo de Laureate que aparece en la pestaña del navegador.

---

## 10. Tipografía

| Elemento | Fuente | Tamaño | Peso |
|---|---|---|---|
| Título (h1) | Inter | 55px (32px en mobile) | 700 |
| Subtítulo | Inter | 16px (14px en mobile) | 400 |
| Nombre institución | Inter | 18px (16px en mobile) | 700 |
| Descripción card | Inter | 13px (12px en mobile) | 400 |
| Botón Acceder | Inter | 12px | 700 (Negrita) |
| Footer stats | Inter | 12px | 500 |

Cargada vía Google Fonts: `Inter` pesos 400, 500, 600, 700, 800.

---

## 11. Responsive Design

| Breakpoint | Comportamiento |
|---|---|
| `< 768px` | **Optimización móvil completa**: <br>- El `body` permite desplazamiento vertical (`overflow-y: auto`). <br>- Las capas de fondo se fijan (`position: fixed`). <br>- La cuadrícula cambia a tarjetas **horizontales** usando CSS Grid. <br>- El logo se redimensiona a `72x48px` y el botón se alinea a la derecha. <br>- El título reduce su tamaño a `32px` con `min-height: 76px` para evitar saltos. <br>- Las estadísticas del footer se distribuyen fluidamente (`flex-direction: row; flex-wrap: wrap; gap: 16px 24px`). |
| `≥ 768px` | **Diseño de Escritorio**: Grid de cards en **3 columnas**, tarjetas verticales grandes, padding `32px`. |

---

## 12. Dependencias Externas

| Dependencia | Uso | CDN |
|---|---|---|
| Google Fonts — Inter | Tipografía principal | `fonts.googleapis.com` |
| Material Symbols Outlined | Íconos del footer | `fonts.googleapis.com` |

> **Importante:** No se utiliza ningún framework CSS (sin Tailwind, Bootstrap, etc.). El proyecto es 100% **CSS vanilla**.

---

## 13. Animaciones registradas

| Nombre | Descripción | Duración |
|---|---|---|
| `slide-up` | Desplazamiento vertical del fondo en mosaico | 60s infinito |
| `fadeInUp` | Entrada suave de elementos (título, subtitle, cards, footer) | 0.7–0.9s |
| `blink-cursor` | Parpadeo del cursor del efecto typewriter | 0.75s infinito |

---

## 14. Accesibilidad

- El `<h1>` vacío incluye `aria-label="Bienvenido a Marketing Hub"` para lectores de pantalla
- Cada `<button>` tiene `aria-label` descriptivo
- Las imágenes de logos tienen texto `alt` apropiado
- El fondo y el glow usan `aria-hidden="true"` y `pointer-events: none`
- Foco visible estilizado con `box-shadow` rojo al navegar con teclado (`:focus-visible`)
