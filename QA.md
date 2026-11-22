# QA.md — Protocolo de verificación y motor de órdenes de corrección

## Objeto de comparación

- **Referencia**: render del frame `1-2` de Figma (640 × 2236 px) y sus crops ampliados
  2.25× (escala 1:1 del frame de 1440 px), guardados en
  `C:\Users\jdt_l\AppData\Local\Temp\opencode\capturas-qa\`.
- **Implementación**: `http://localhost:8000` servido desde la raíz del proyecto.

## Procedimiento ejecutado

1. Servidor Node estático en `http://localhost:8000`.
2. Playwright MCP: viewport **1440 × 900**, captura `fullPage`, medición de bounding boxes
   con `browser_evaluate` y comparación contra el render de Figma.
3. Repetición a **768 × 1024** y **390 × 844**, comprobando overflow horizontal y menú móvil.
4. Pruebas funcionales: filtrado del buscador, carrusel, formulario y menú.
5. Registro de hallazgos y aplicaciones de corrección; verificación final.

## Checklist sección por sección — resultado

| Sección | Resultado | Evidencia |
|---|---|---|
| Global (colores, tipografía, ancho, sombras) | ✅ | Tokens `#FEF7F2` / `#DDC7BB` / `#2B1B12` muestreados del render; Montserrat; container 1240 px |
| Header | ✅ | Logo, 4 enlaces, iconos, CTA; alto 96 px |
| Hero | ✅ | H1 en y=258 (ref 258), párrafo y CTA en y=606 (ref 605), casa 970 px posicionada |
| Search bar | ✅ | y=822, 1070 × 160 (ref idéntico); 3 campos + CTA; filtra residencias |
| We Help You | ✅ | Imagen 595 × 450 en y=1137 (ref 1137); texto + 3 stats |
| Why Choose Us | ✅ | H2 en y=1719 (ref 1722); tarjetas en y=1932 (ref 1932) |
| Popular Residences | ✅ | H2 en y=2304 (ref 2297); 3 tarjetas 376 × 512 con foto, datos y precio |
| Testimonios | ✅ | Fondo crema desde y=3085 (ref 3090); 3 tarjetas 420 px + flechas funcionales |
| FAQ / CTA | ✅ | Fondo blanco desde y=3884 (ref 3880); perks, email y submit validado |
| Footer | ✅ | Beige desde y=4378 (ref 4355); 5 columnas, 670 px de alto |
| Responsive 768 / 390 | ✅ | Sin overflow horizontal; grids 2/1 columnas; menú hamburguesa accesible |
| Estados interactivos | ✅ | Hover en botones/tarjetas/flechas; focus visible; `aria-expanded` |

**Altura total final**: 5048 px vs 5031 px del diseño (diferencia 0.3 %).

## Regla de no aprobación

Toda discrepancia detectada se registró con orden de corrección. Ninguna orden quedó
pendiente: el ciclo revisión → corrección → verificación se completó en **dos rondas**.

## Órdenes de corrección

| # | Ronda | Ubicación | Severidad | Diferencia observada vs. Figma | Orden de corrección | Estado |
|---|---|---|---|---|---|---|
| 1 | 1 | Todas las fotos | Alta | Imágenes ausentes en la captura `fullPage` | Quitar `loading="lazy"` de todas las imágenes | RESUELTA |
| 2 | 1 | Assets | Alta | Previews de 270–402 px, pixelados a tamaño real | Descargar las variantes de alta resolución (hasta 4096 px) del `image/batch` de Figma y reemplazarlas | RESUELTA |
| 3 | 1 | Hero | Alta | Casa demasiado pequeña y desplazada | Posicionar `.hero-visual` en absoluto (970 px, arriba a la derecha) para igualar la composición | RESUELTA |
| 4 | 1 | Header/Footer | Media | Marca de logo con forma incorrecta | Redibujar el SVG del marco de puerta ("Dwello") | RESUELTA |
| 5 | 1 | Search bar | Media | Iconos de Type y Price Range eran pin y sobre | Sustituir por iconos SVG de casa y moneda; fondo de campo `#FBF5F1` | RESUELTA |
| 6 | 1 | Secciones | Alta | Desfase vertical de hasta 230 px (Why/Residences) | Ajustar paddings por sección (help 235/60, why 72/30, residences 47/168, testimonios 67/75) | RESUELTA |
| 7 | 1 | Botones | Media | CTA del hero y de tarjetas más pequeños que el diseño | Hero 175 × 60; `.btn-tiny` padding 12/28 | RESUELTA |
| 8 | 1 | Textos | Baja | Cuerpo demasiado claro frente al diseño | `--muted` 0.72 → 0.82 y texto de "We Help" en `--dark` | RESUELTA |
| 9 | 2 | Documento | Media | 3 px de overflow horizontal por la casa del hero | `.hero-visual { right: 0 }` | RESUELTA |
| 10 | 2 | FAQ/Footer | Baja | FAQ 27 px y footer 23 px por debajo de la referencia | Reducir `padding-bottom` de testimonios de 150 a 75 px | RESUELTA |
| 11 | 3 | Footer | — | Petición del usuario (no discrepancia con Figma): mostrar crédito con foto y enlace al sitio | Añadir `assets/jt.jpg` y `.footer-credit` con avatar, texto «Creado por Jonathan Toro» y enlace a `https://jon-torlen.github.io/` | RESUELTA (verificado a 1440 px) |

## Verificación funcional final

- Buscador: al filtrar "palo" → 1 tarjeta visible, estado "1 home found" ✅
- Carrusel: al pulsar next → Sarah → Michael, Emily, Sarah ✅
- Newsletter: email válido → "Thanks! We'll be in touch soon." y campo limpio ✅
- Menú móvil: `aria-expanded` false → true y `display: flex` ✅
- Overflow horizontal: `scrollWidth === clientWidth` en 1440, 768 y 390 ✅
- Consola: sin errores (favicon data URI) ✅

## Resultado final

**APROBADO.** No quedan órdenes de corrección pendientes. El resultado reproduce la
estructura, la paleta, la tipografía, los espaciados y las interacciones del frame de
Figma con una diferencia de altura del 0,3 % y sin discrepancias relevantes.
