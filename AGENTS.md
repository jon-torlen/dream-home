# AGENTS.md — Guía operativa del proyecto

## Propósito

Reproducir, con máxima fidelidad visual y funcional, la landing page de bienes raíces
**"Find Your Dream Home"** a partir del diseño de Figma de referencia:

- Archivo: https://www.figma.com/design/czA6N7vy553Ij0wNsXOcfe/Find-Your-Dream-Home-Website-UI-Template--Community-
- Nodo principal (frame de la landing): `1-2` (el nodo `0-1` es la página completa con otros frames)
- Referencia visual local: `C:\Users\jdt_l\AppData\Local\Temp\opencode\capturas-qa\node1-1.png`
  (render del frame a 640 × 2236 px; el frame original mide ~1440 × 5031 px)

El resultado es un sitio estático servible con cualquier servidor HTTP local.

## Regla estricta de stack

- **HTML5 semántico**, **CSS3 moderno** (custom properties, grid, flexbox, media queries) y
  **JavaScript vanilla (ES Modules)**.
- **PROHIBIDO**: React, Vue, Svelte, Next, Astro, Angular, Tailwind, Bootstrap, jQuery,
  bundlers o librerías de UI. No se instalan dependencias npm.
- Única dependencia externa permitida: la fuente web de Google Fonts (Montserrat), cargada
  por `@import`/`<link>`; si falla, se usa `system-ui` como fallback.
- Los iconos y fotografías son assets locales en `assets/` (extraídos del propio archivo Figma).

## Estructura de carpetas y convenciones

```
dream-home/
├── AGENTS.md              # esta guía
├── MEMORY.md              # memoria técnica / bitácora
├── QA.md                  # protocolo y motor de órdenes de corrección
├── index.html             # único documento HTML
├── css/
│   └── styles.css         # estilos globales, componentes y responsive
├── js/
│   └── main.js            # módulo ES: menú, buscador, carrusel, formulario
└── assets/                # imágenes extraídas de Figma (nombres en kebab-case)
```

- Nombres de archivos y clases: `kebab-case`. Comentarios de sección en CSS con `/* ==== */`.
- Los tokens de diseño viven **solo** en `:root` de `css/styles.css` y se documentan en `MEMORY.md`.
- Los assets se referencian con rutas relativas (`assets/...`), nunca rutas absolutas ni URLs
  de Figma (los URLs firmados caducan).

## Flujo de trabajo obligatorio

1. **Inspección Figma** → extraer estructura, tokens, tipografías y assets (ya realizado; ver `MEMORY.md`).
2. **Implementación** → HTML semántico + CSS + JS vanilla, registrando decisiones en `MEMORY.md`.
3. **Auditoría** → ejecutar el checklist de `QA.md` comparando contra el render de Figma
   (sección por sección, desktop/tablet/mobile).
4. **Corrección** → toda discrepancia detectada se registra en `QA.md` con ubicación,
   severidad y **orden de corrección accionable**; se aplica antes de cerrar.
5. **Registro** → actualizar `MEMORY.md` (estado por sección y rondas de QA) y `QA.md`
   (resultado final) hasta que no queden diferencias relevantes.

**Regla de no aprobación:** si `QA.md` contiene cualquier orden de corrección pendiente,
la tarea NO está terminada. El ciclo revisión → corrección se repite hasta aprobar.

## Ejecutar y previsualizar en local

No requiere build. Desde esta carpeta:

```powershell
# Opción A (Python disponible):
python -m http.server 8000
# Opción B (Node disponible):
npx serve . -l 8000
```

Abrir `http://localhost:8000`. Para probar el módulo JS hace falta servidor HTTP
(no `file://`, porque ES Modules bloquean orígenes `file:`).

Verificación con navegador: usar Playwright MCP para navegar a `http://localhost:8000`,
tomar capturas (`browser_take_screenshot`) a 1440 px, 768 px y 390 px de ancho y comparar
con el render de Figma guardado en `MEMORY.md`.
