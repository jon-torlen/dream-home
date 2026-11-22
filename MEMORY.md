# MEMORY.md — Memoria técnica y bitácora

## 1. Referencia y método de extracción

- Figma: `czA6N7vy553Ij0wNsXOcfe`, frame principal `node-id=1-2` (~1440 × 5031 px).
- No había MCP de Figma disponible. Se usó:
  1. Playwright MCP sobre la URL de Figma para localizar los frames.
  2. `https://www.figma.com/api/oembed?url=...` para obtener el thumbnail del frame `1-2`
     (`api-cdn.figma.com/resize/images/...`, 640 × 2236 px).
  3. Inspección de peticiones de red de Figma para descargar los **assets originales**
     desde `blobs.figma.com/blobs/us/download/figma-alpha/img/...` (22 imágenes).
  4. Muestreo de píxeles con System.Drawing para obtener los colores exactos.
- Los crops ampliados (escala 2.25× ⇒ equivalente a 1:1 con el frame de 1440 px) se
  guardaron en `C:\Users\jdt_l\AppData\Local\Temp\opencode\capturas-qa\crops\`.

## 2. Design tokens extraídos

### Colores (muestreo directo del render)
| Token | Hex | Uso |
|---|---|---|
| `--cream` | `#FEF7F2` | Fondo hero y sección de testimonios |
| `--beige` | `#DDC7BB` | Search bar, tarjetas, footer |
| `--dark` | `#2B1B12` | Botones, titulares y texto principal |
| `--white` | `#FFFFFF` | Fondo de secciones de contenido |

Texto secundario: `--dark` con opacidad ~0.75. No hay otros colores de acento en el frame
principal (los colores morados pertenecen a otro frame distinto del archivo).

### Tipografía
- La petición de red de Figma cargó `Montserrat_wght__2` (variable) ⇒ **Montserrat** es la
  fuente del frame principal. `Poppins-Medium_6` pertenece a los frames secundarios.
- Fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`.
- Escala estimada (frame 1440 px):
  - H1 hero: 72 px / 800-900 / line-height 1.05
  - H2 de sección: 36 px / 800 / centrado
  - Cuerpo: 16 px / 400-500 / line-height 1.6
  - Etiquetas de card: 16-17 px / 700; texto pequeño 13-14 px
  - Números de estadística: 40 px / 800

### Espaciado y geometría (px del frame 1440)
- Contenido: ancho máx. ~1240 px, márgenes laterales ~100 px.
- Header: alto ~96 px. H1 empieza ~250 px.
- Search bar: y≈822-982, ancho ≈1070, alto 160, radio 16; 3 inputs blancos 250×60 radio 8
  + botón oscuro 155×65.
- Hero image: x≈500-1400, y≈180-800 (PNG recortado, sin fondo).
- "We Help": imagen 595×450 radio 16; texto a la derecha; 3 stats en fila.
- "Why Choose Us": 4 tarjetas 275×295, radio 16, padding 24; icono en cuadrado blanco 54×54.
- "Our Popular Residences": 3 tarjetas 382×515, radio 16; imagen 350 px + info 165 px.
- Testimonios: 3 tarjetas 382×420, radio 16; imagen 165 px; avatar 44 px; flechas 44 px.
- FAQ: input 505×55 radio 8 + botón 150×55.
- Footer: alto ~676 px, 5 columnas.
- Límites verticales: hero/cream 0-900 · blanco 900-3090 · cream 3090-3880 ·
  blanco 3880-4360 · footer/beige 4360-5031.

### Radios y sombras
- Botones y tarjetas: radio 8-16 px.
- Sombras: suaves (`0 8px 24px rgba(43,27,18,.08)`) visibles bajo search bar y tarjetas.

## 3. Decisiones técnicas

| Decisión | Razón |
|---|---|
| Montserrat vía Google Fonts | Coincide con la fuente detectada en la red de Figma; sin dependencias npm. |
| Assets locales copiados desde Figma | URLs firmados de Figma caducan; se garantiza funcionamiento offline. |
| `hero-house.png` con transparencia | Permite el solapamiento sobre el fondo crema exactamente como en el diseño. |
| Carrusel de testimonios con JS vanilla | El frame incluye flechas prev/next; se implementa comportamiento real. |
| Buscador con filtrado real | Los campos Location/Type/Price Range filtran las tarjetas de residencias. |
| Menú móvil con `<button>` y `aria-expanded` | Accesibilidad y responsive sin frameworks. |
| Un único `main.js` como módulo ES | Cumple el stack exigido; fácil de auditar. |

## 4. Problemas encontrados y soluciones

- **Sin MCP de Figma**: resuelto con oEmbed + inspección de red de Playwright.
- **Login modal de Figma al pulsar atajos**: se evitará interactuar con el editor; se usa el
  render ya descargado como referencia.
- **Assets descargados con extensión `.png` pero contenido JPEG**: se detectó la firma de
  bytes y se renombraron (`help-house.jpg`, avatares y fotos de testimonios).
- **Thumbnail a 640 px**: ampliado 2.25× para trabajar a escala 1:1 del frame (1440 px).

## 5. Estado final por sección

| Sección | Estado | Notas |
|---|---|---|
| Header / nav | ✅ | Logo SVG, 4 enlaces, iconos y CTA; menú móvil con `aria-expanded` |
| Hero | ✅ | H1 y párrafo en las coordenadas del diseño; casa recortada 970 px en alta resolución |
| Search bar | ✅ | 3 campos + CTA; filtrado por ciudad/tipo/precio; iconos casa y moneda |
| We Help You | ✅ | Imagen 595 × 450 + texto + 3 estadísticas |
| Why Choose Us | ✅ | 4 tarjetas con iconos extraídos de Figma |
| Popular Residences | ✅ | 3 tarjetas con fotos de alta resolución y filtrado |
| Testimonios | ✅ | 3 tarjetas + carrusel rotativo funcional |
| FAQ / CTA | ✅ | Perks con icono verificado, email y validación |
| Footer | ✅ | 5 columnas, iconos de redes SVG |
| Responsive | ✅ | Verificado a 1440 / 768 / 390 sin overflow horizontal |

### Rondas de QA
- Ronda 0 — Extracción de Figma, tokens y assets completados.
- Ronda 1 — Implementación y auditoría: 8 órdenes de corrección (ver `QA.md`), todas resueltas.
- Ronda 2 — Verificación final: 2 órdenes menores resueltas; **APROBADO**.
- Altura final 5048 px vs 5031 px del frame (0,3 % de diferencia).

## 6. Decisiones técnicas añadidas durante QA

| Decisión | Razón |
|---|---|
| Quitar `loading="lazy"` | Las capturas `fullPage` de Playwright no cargaban imágenes fuera del viewport; el diseño debe verse completo de inmediato. |
| Usar las variantes de alta resolución del `image/batch` | Figma sirve previews de 270–402 px al canvas; el mismo endpoint devuelve originales de hasta 4096 px para la exportación. |
| Simular el carrusel rotando 3 testimonios | El frame solo contiene 3 testimonios; las flechas giran el conjunto sin inventar contenido nuevo. |
| `<link rel="icon" href="data:,">` | Evita el 404 de `/favicon.ico` en la consola sin añadir un asset innecesario. |

## 7. Crédito del autor (petición del usuario, añadido tras QA)

No forma parte del diseño de Figma: se añadió a petición expresa del usuario en el pie de página.
- `assets/jt.jpg`: retrato cuadrado (1024 × 1024) copiado desde
  `C:\Users\jdt_l\OneDrive\Documentos\PORTAFOLIO\jt.jpg` (asset local, sin URL externa).
- `.footer-credit`: barra bajo las 5 columnas con borde superior, avatar circular de 40 px y
  el texto «Creado por **Jonathan Toro**», enlazado a `https://jon-torlen.github.io/`
  (`target="_blank"`, `rel="noopener noreferrer"`).
- Responsive: margen superior reducido a 48 px por debajo de 640 px.
- Verificado con Playwright a 1440 px: avatar, texto y enlace visibles correctamente.
