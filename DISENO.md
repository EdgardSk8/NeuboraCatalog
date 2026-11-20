# Diseño — sistema visual de referencia

Guía única e independiente de marca y contenido. Reúne las medidas de la interfaz, las superficies (tarjetas y paneles), los botones y sus animaciones para replicarlos en cualquier web.

---

## 1. Principios

- **Miniatura y orden:** interfaz compacta, con una escala cerrada de tamaños y sin valores sueltos.
- **Ritmo con `gap`:** el espacio interno de un componente se resuelve con `gap`; `margin` se usa solo para separar bloques.
- **Superficies silenciosas:** blanco con degradado vertical muy suave y un tinte de acento en la esquina superior derecha.
- **Acento por posición:** las tarjetas alternan tres acentos (verde, magenta y rojo) con `:nth-child`.
- **Movimiento corto:** elevación máxima de 2 px, transiciones de 0.16–0.5 s y una sola animación continua reservada para elementos decorativos.
- **Accesibilidad primero:** foco visible, áreas táctiles de 44 px y respeto total a `prefers-reduced-motion`.

---

## 2. Escala de espacio

| Token | Valor | Uso |
|---|---|---|
| `--ui-space-1` | 2px | Separaciones internas mínimas |
| `--ui-space-2` | 4px | Etiqueta → control, ajustes micro |
| `--ui-space-3` | 6px | Gap entre controles de una fila |
| `--ui-space-4` | 8px | Padding de controles y bloques chicos |
| `--ui-space-5` | 10px | Padding de chips y píldoras |
| `--ui-space-6` | 12px | Padding de página en móvil |
| `--ui-space-7` | 16px | Padding de página en escritorio |
| `--ui-space-8` | 24px | Separación entre secciones grandes |

Escala reutilizable: **2 · 4 · 6 · 8 · 10 · 12 · 16 · 24 px**.

Reglas:

- Múltiplos de 2 px en componentes densos; de 4 u 8 px en el resto.
- Reinicia márgenes de títulos y párrafos (`margin: 0`) y deja que el contenedor decida el espacio.
- No acumules márgenes entre componentes anidados.
- 24 px es el techo de la escala: las secciones grandes no se separan con más.
- Quedan fuera de la escala la geometría y no el ritmo: anchos máximos de contenedor, alturas de gráficos y tamaños de ilustraciones.

---

## 3. Tipografía

| Token | Tamaño | Uso |
|---|---|---|
| `--ui-text-2xs` | 10px | Etiquetas micro, badges, contadores |
| `--ui-text-xs` | 11px | Metadatos, píldoras y filtros secundarios |
| `--ui-text-xs-plus` | 11.5px | Resultados y textos de apoyo |
| `--ui-text-sm` | 12px | Buscadores y selectores compactos |
| `--ui-text-md` | 13px | Cuerpo denso |
| `--ui-text-base` | 14px | Cuerpo base de controles y formularios |
| `--ui-text-lg` | 16px | Inputs en móvil y cuerpo de lectura |
| `--ui-text-xl` | 18px | Título de tarjeta |
| `--ui-text-2xl` | 20px | Título de vista |
| `--ui-text-3xl` | 22px | Totales destacados y `h1` |

Interlineado: `1.2` para títulos, `1.45` para párrafos y `1.5` para cuerpo de lectura.

Reglas:

- No uses texto visible menor a 10 px.
- En móvil, los campos de escritura no bajan de **16 px** (evita el zoom automático de iOS).
- 22 px es el techo de la escala; no hay escalones mayores.

---

## 4. Alturas de control y área táctil

| Token | Valor | Elemento |
|---|---|---|
| `--ui-control` | 36px | Control normal: buscador, filtros, botones, ítems de navegación, tabs |
| `--ui-control-field` | 32px | Input/select interno de formulario |
| `--ui-control-compact` | 30px | Botón sutil y píldoras de navegación |
| `--ui-control-chip` | 32px | Chip o píldora de filtro |
| `--ui-control-icon` | 38px | Botón de icono |
| `--ui-control-icon-mobile` | 42px | Botón de icono en cabecera móvil |
| `--ui-control-card` | 32px | Acción dentro de tarjeta o tabla |
| `--ui-control-touch` | 44px | Botón principal y acción táctil |
| `--ui-nav` | 56px | Barra superior y pie |

Reglas:

- Mantén la misma altura entre input, select y botón de una misma fila.
- No mezcles variantes normal y compacta en la misma fila.
- El área táctil mínima es 44 × 44 px aunque el glifo sea menor; `@media (pointer: coarse)` eleva las acciones principales a 44 px.
- No cambies el tamaño del control al enfocar, deshabilitar o mostrar error.

---

## 5. Radios y bordes

| Token | Valor | Elemento |
|---|---|---|
| `--ui-radius-control` | 6px | Control genérico |
| `--ui-radius-compact` | 10px | Control compacto, avatar, tile de icono |
| `--ui-radius-card` | 14px | Tarjeta, aviso, toast |
| `--ui-radius-panel` | 18px | Panel, modal, menú desplegable, hoja inferior |
| `--ui-radius-hero` | 26px | Tarjeta de acceso o bloque destacado |
| `--ui-radius-pill` | 999px | Chip, píldora, badge, contador |
| `--ui-radius-btn` | 11px | Botón base |
| `--ui-radius-btn-lg` | 14px | Botón grande |

- Bordes y separadores: siempre `1px`.
- Anillo de foco: contorno de `2px` con `outline-offset: 2px`.

---

## 6. Ritmo por componente

| Elemento | Medidas |
|---|---|
| Página | Padding 12 px móvil / 16 px escritorio; 8 px al pie |
| Barra superior | 56 px de alto; padding lateral 12 px móvil / 16 px escritorio / 24 px en pantallas anchas |
| Buscador | Alto 36 px; padding lateral 8 px; `gap` 6 px |
| Filtro secundario | Alto 32 px; padding lateral 8 px; `gap` 6 px |
| Fila de filtros y acciones | `gap` 6 px; margen inferior 10 px |
| Lista | `gap` 8 px (compacta) a 12 px (base) |
| Tarjeta | Padding 16 px; radio 14 px; icono 34 px (28 px en móvil) |
| Panel | Padding 12 px; radio 14 px; filas con `gap` 8 px |
| Tabla | Encabezado 32 px; fila 44 px; padding lateral 10 px |
| Acción de fila | 32 × 32 px |
| Formulario | `gap` 8 px; etiqueta → control 4 px |
| Acceso y registro | Tarjeta 16 px (12 px móvil); input 32 px con texto 13 px (16 px en móvil); botón 36 px |
| Modal | Caja 16 px (12 px móvil); radio 18 px; título 18 px con margen inferior 6 px |
| Aviso y toast | Padding 8 × 12 px; radio 14 px |
| Menú desplegable | Padding 6 px; radio 18 px; opciones de 40 px |
| CTA final | Padding 16 px (24 px vertical en móvil); radio 18 px; título 20 px; botones 36 px |

---

## 7. Scroll fino

```css
.ui-scroll {
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;              /* Firefox */
}

.ui-scroll::-webkit-scrollbar {
  width: 4px;                         /* vertical */
  height: 4px;                        /* horizontal */
}

.ui-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.ui-scroll::-webkit-scrollbar-thumb {
  border-radius: var(--ui-radius-pill);
}

/* Carruseles de chips, categorías y miniaturas */
.ui-scroll-hidden {
  overflow-x: auto;
  scrollbar-width: none;
}

.ui-scroll-hidden::-webkit-scrollbar {
  display: none;
}
```

- Barra visible de 4 px; no superes 6 px en interfaces compactas.
- Track transparente; el color del thumb lo aporta el tema.
- `overscroll-behavior: contain` evita encadenar el scroll con la página.
- Listas largas dentro de modales: `max-height: 40vh` con scroll fino.

---

## 8. Breakpoints

| Ancho | Ajuste |
|---|---|
| ≤ 390px | Una columna en formularios y ajustes de cabecera |
| ≤ 575.98px | Campos de escritura a 16 px (evita el zoom de iOS) |
| ≤ 620px | Padding de página 12 px; tarjetas y tablas con 8 px |
| ≤ 850px | Navegación lateral fija; botón de 38 px; cabecera de 52 px |
| ≥ 851px | Padding de página 16 px |
| ≥ 1500px | Padding lateral de la barra superior a 24 px |

- Evita mínimos de ancho que provoquen scroll horizontal.
- En móvil, las barras de filtros envuelven y los controles ocupan el ancho disponible.
- En escritorio, limita anchos solo en barras de filtros; no fijes ancho rígido a todos los inputs.

---

## 9. Iconos y avisos

- Usa una sola familia de iconos, reconocible y consistente.
- Alinea icono y texto con `inline-flex`, `align-items: center` y `gap: 6–8px`.
- Icono junto a texto: 16–18 px. Icono aislado en acción: 18–22 px. Mantén el área pulsable del botón (38 px) aunque el glifo sea menor.
- Contador sobre una campana: botón `position: relative`; punto de 6 px en `top: 7px; right: 7px`, con borde de 1 px.
- No comuniques severidad solo con color: acompaña con icono y texto (“Advertencia”, “Error”, “Información”) y, cuando proceda, `aria-live="polite"`.
- Reserva el mismo espacio de icono en todos los estados para que cambiar éxito por error no desplace el texto.

### Popover de ayuda contextual

- Botón circular de **38 × 38 px**, `inline-flex` centrado, sin padding interno; glifo de ~16 px.
- En `:hover` y `aria-expanded="true"` conserva el tamaño y cambia solo el tratamiento visual; en `:active` se reduce con `transform: scale(.96)`.
- En `:focus-visible`, contorno de 2 px separado 2 px del círculo.
- Panel en absoluto bajo el botón: `top: calc(100% + 8px); right: 0; z-index: 55`, ancho `min(300px, calc(100vw - 32px))`, padding 12 px, borde y radio de 14 px.
- Flecha con `::before`: cuadrado de 10 × 10 px, a 6 px por encima del panel y 13 px del borde derecho; solo bordes superior e izquierdo, rotado 45°.
- Apertura de **160 ms** desde `opacity: 0` y `translateY(-4px)`. Con `prefers-reduced-motion: reduce` se elimina.
- Cerrado: `[hidden]` con `display: none`. El botón expone `aria-expanded` y `aria-controls`; el panel usa `role="note"`.

---

## 10. Modales y avisos

- Caja con padding 16 px (12 px en móvil) y radio 18 px.
- Cabecera con título de 18 px, margen inferior 6 px y `gap` de 8 px entre icono y texto.
- Acciones con `gap` de 6–8 px, agrupadas al final; áreas pulsables de 36 px (44 px en táctil).
- Reserva espacio para el botón de cierre y mantén el título en una línea cuando sea posible.
- Validaciones junto al campo (`gap: 4px`); avisos globales o toasts solo para el resultado de una acción.

---

## 11. Tokens completos

Copia este bloque en `:root` y cambia solo los valores para adaptar el sistema a otra web.

```css
:root {
  /* Espacio */
  --ui-space-1: 2px;
  --ui-space-2: 4px;
  --ui-space-3: 6px;
  --ui-space-4: 8px;
  --ui-space-5: 10px;
  --ui-space-6: 12px;
  --ui-space-7: 16px;
  --ui-space-8: 24px;

  /* Tipografía */
  --ui-text-2xs: 10px;
  --ui-text-xs: 11px;
  --ui-text-xs-plus: 11.5px;
  --ui-text-sm: 12px;
  --ui-text-md: 13px;
  --ui-text-base: 14px;
  --ui-text-lg: 16px;
  --ui-text-xl: 18px;
  --ui-text-2xl: 20px;
  --ui-text-3xl: 22px;
  --ui-leading-title: 1.2;
  --ui-leading-body: 1.45;
  --ui-leading-reading: 1.5;

  /* Alturas */
  --ui-control: 36px;
  --ui-control-field: 32px;
  --ui-control-compact: 30px;
  --ui-control-chip: 32px;
  --ui-control-icon: 38px;
  --ui-control-icon-mobile: 42px;
  --ui-control-card: 32px;
  --ui-control-touch: 44px;
  --ui-nav: 56px;

  /* Radios */
  --ui-radius-control: 6px;
  --ui-radius-compact: 10px;
  --ui-radius-card: 14px;
  --ui-radius-panel: 18px;
  --ui-radius-hero: 26px;
  --ui-radius-pill: 999px;
  --ui-radius-btn: 11px;
  --ui-radius-btn-lg: 14px;

  /* Superficie */
  --ui-bg: #f6fdfa;
  --ui-surface: #ffffff;
  --ui-surface-2: #fcfefd;
  --ui-ink: #293a33;
  --ui-heading: #24352c;
  --ui-muted: #7c8b82;
  --ui-border: #e0eee7;
  --ui-border-soft: #eef6f3;

  /* Marca */
  --ui-primary: #1db973;
  --ui-primary-hover: #179158;
  --ui-primary-deep: #106a40;
  --ui-primary-soft: #ecfaf3;
  --ui-on-primary: #0b2318;

  /* Acentos de superficie */
  --ui-accent-2: #b91db1;
  --ui-accent-2-soft: #f7e9f7;
  --ui-accent-2-edge: #f1d3f0;
  --ui-accent-3: #b9251d;
  --ui-accent-3-soft: #f9ebea;
  --ui-accent-3-edge: #edd0ce;

  /* Sombras */
  --ui-shadow-xs: 0 1px 2px #26392d08;
  --ui-shadow-card: 0 18px 50px -28px #26392d3d;
  --ui-shadow-btn: 0 10px 24px -14px #106a4066;
  --ui-shadow-btn-hover: 0 16px 30px -16px #106a4080;

  /* Movimiento */
  --ui-fast: 0.16s;
  --ui-base: 0.2s;
  --ui-slow: 0.4s;
  --ui-stagger: 60ms;
  --ui-ease: ease;
}
```

### 11.1 Color

| Token | Valor | Uso |
|---|---|---|
| `--ui-bg` | `#f6fdfa` | Fondo de página |
| `--ui-surface` | `#ffffff` | Superficie de tarjeta |
| `--ui-surface-2` | `#fcfefd` | Final del degradado de superficie |
| `--ui-ink` | `#293a33` | Texto general |
| `--ui-heading` | `#24352c` | Títulos |
| `--ui-muted` | `#7c8b82` | Texto secundario |
| `--ui-border` | `#e0eee7` | Bordes generales |
| `--ui-border-soft` | `#eef6f3` | Separadores internos |
| `--ui-primary` | `#1db973` | Marca / acción principal |
| `--ui-primary-hover` | `#179158` | Hover de la acción principal |
| `--ui-primary-deep` | `#106a40` | Texto/icono sobre fondos suaves |
| `--ui-primary-soft` | `#ecfaf3` | Tinte suave de acento |
| `--ui-on-primary` | `#0b2318` | Texto sobre el color de marca |
| `--ui-accent-2` | `#b91db1` | Acento secundario (magenta) |
| `--ui-accent-2-soft` | `#f7e9f7` | Tinte magenta |
| `--ui-accent-2-edge` | `#f1d3f0` | Borde magenta |
| `--ui-accent-3` | `#b9251d` | Acento terciario (rojo) |
| `--ui-accent-3-soft` | `#f9ebea` | Tinte rojo |
| `--ui-accent-3-edge` | `#edd0ce` | Borde rojo |

> Las sombras usan un verde casi negro (`#26392d`) en lugar de gris puro: se integran mejor con fondos verdosos. Si tu tema es neutro, sustituye ese tono por `#1f2937` o similar.

### 11.2 Sombras

| Token | Valor | Uso |
|---|---|---|
| `--ui-shadow-xs` | `0 1px 2px #26392d08` | Reposo de tarjeta |
| `--ui-shadow-card` | `0 18px 50px -28px #26392d3d` | Hover de tarjeta |
| `--ui-shadow-btn` | `0 10px 24px -14px #106a4066` | Botón principal |
| `--ui-shadow-btn-hover` | `0 16px 30px -16px #106a4080` | Hover del botón principal |

### 11.3 Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--ui-fast` | `0.16s` | Botones y enlaces |
| `--ui-base` | `0.2s` | Tarjetas, iconos, barra de acento |
| `--ui-slow` | `0.4s` | Perspectiva 3D |
| `--ui-stagger` | `60ms` | Retardo por elemento en la aparición |

---

## 12. Contenedor base (superficie)

### 12.1 Anatomía

```
┌────────────────────────────────────────┐
│  contenido                    [01]  ←  índice opcional
│  ┌────┐
│  │icon│  ← 34 × 34, borde del acento
│  └────┘
│  Título
│  Texto secundario
│  ▬▬▬  ← barra de acento (28 × 3)
└────────────────────────────────────────┘
   borde 1 px · radio 14 px · tinte en la esquina superior derecha
```

### 12.2 CSS

```css
.ui-surface {
  /* Estos tres valores definen la identidad visual de cada tarjeta */
  --surface-accent: var(--ui-primary-hover);
  --surface-tint: var(--ui-primary-soft);
  --surface-edge: #d8f3e6;

  position: relative;
  border: 1px solid var(--surface-edge);
  border-radius: var(--ui-radius-card);
  background:
    radial-gradient(140px 120px at 100% 0%, var(--surface-tint) 0%, transparent 72%),
    linear-gradient(180deg, var(--ui-surface) 0%, var(--ui-surface-2) 100%);
  box-shadow: var(--ui-shadow-xs);
  transition:
    transform var(--ui-base) var(--ui-ease),
    box-shadow var(--ui-base) var(--ui-ease),
    border-color var(--ui-base) var(--ui-ease);
}

.ui-surface:hover {
  transform: translateY(-2px);
  border-color: var(--surface-accent);
  box-shadow: var(--ui-shadow-card);
}
```

### 12.3 Acentos automáticos

Las tarjetas alternan acento sin clases extra: la primera usa verde, la segunda magenta, la tercera rojo, y el ciclo se repite.

```css
.ui-surface:nth-child(3n + 2) {
  --surface-accent: var(--ui-accent-2);
  --surface-tint: var(--ui-accent-2-soft);
  --surface-edge: var(--ui-accent-2-edge);
}

.ui-surface:nth-child(3n + 3) {
  --surface-accent: var(--ui-accent-3);
  --surface-tint: var(--ui-accent-3-soft);
  --surface-edge: var(--ui-accent-3-edge);
}
```

### 12.4 Piezas internas

```css
.ui-card {
  display: flex;
  flex-direction: column;
  padding: var(--ui-space-7);
}

.ui-card h3 {
  margin: 0 0 var(--ui-space-3);
  color: #33453a;
  font-size: var(--ui-text-base);
  font-weight: 700;
  letter-spacing: -0.2px;
}

.ui-card p {
  margin: 0 0 var(--ui-space-6);
  color: var(--ui-muted);
  font-size: var(--ui-text-sm);
  line-height: 1.5;
}

/* Índice monoespaciado, opcional */
.ui-card-index {
  position: absolute;
  top: var(--ui-space-7);
  right: var(--ui-space-7);
  color: var(--surface-accent);
  font-family: ui-monospace, Consolas, monospace;
  font-size: var(--ui-text-2xs);
  font-weight: 700;
  letter-spacing: 0.06em;
  opacity: 0.55;
}

/* Icono en caja */
.ui-card-icon {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  margin-bottom: var(--ui-space-5);
  border: 1px solid var(--surface-edge);
  border-radius: var(--ui-radius-compact);
  background: var(--ui-surface);
  color: var(--surface-accent);
}

/* Barra de acento que crece en hover */
.ui-card-accent {
  width: 28px;
  height: 3px;
  margin-top: auto;
  border-radius: var(--ui-radius-pill);
  background: var(--surface-accent);
  opacity: 0.35;
  transition:
    width var(--ui-base) var(--ui-ease),
    opacity var(--ui-base) var(--ui-ease);
}

.ui-surface:hover .ui-card-accent {
  width: 44px;
  opacity: 1;
}
```

### 12.5 Estados

| Estado | Cambio |
|---|---|
| Reposo | Borde del acento al 100 % de su tinte, sombra `xs` |
| Hover | `translateY(-2px)`, borde con el color de acento, sombra amplia |
| Foco (si es interactiva) | `outline: 2px solid var(--ui-primary); outline-offset: 2px` |
| Activo | Sin cambio adicional: la tarjeta no se escala |

> Solo las tarjetas clicables deben reaccionar. Los contenedores de solo lectura (CTA, listas) no se elevan.

---

## 13. Variantes de contenedor

### 13.1 Tarjeta destacada

Mismo contenedor con borde de marca, tinte pleno y sombra verde. Úsala una sola vez por grupo.

```css
.ui-surface--featured {
  --surface-tint: var(--ui-primary-soft);
  --surface-edge: var(--ui-primary);
  border-color: var(--ui-primary);
  box-shadow: 0 22px 50px -34px #17915880;
}

/* Etiqueta opcional sobre el borde superior */
.ui-badge {
  position: absolute;
  top: -11px;
  left: 18px;
  padding: 4px 10px;
  border-radius: var(--ui-radius-pill);
  background: var(--ui-primary);
  color: var(--ui-on-primary);
  font-size: var(--ui-text-2xs);
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

### 13.2 Panel CTA

Contenedor de cierre: fondo verde muy claro, borde definido, radio grande y texto centrado. **No** lleva hover.

```css
.ui-panel-cta {
  position: relative;
  overflow: hidden;
  padding: var(--ui-space-7);
  border: 1px solid #c4e3d5;
  border-radius: var(--ui-radius-panel);
  background: #ebf8f2;
  text-align: center;
  box-shadow: 0 18px 44px -36px #13352533;
}

@media (max-width: 640px) {
  .ui-panel-cta {
    padding: 24px 16px;
  }
}
```

### 13.3 Panel flotante (glass)

Widget pequeño sobre una ilustración: fondo blanco translúcido, desenfoque y flotación continua.

```css
/* El contenedor padre debe ser position: relative */
.ui-float {
  position: absolute;
  display: flex;
  align-items: center;
  gap: var(--ui-space-4);
  padding: 8px 12px;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-btn);
  background: #fffffff2;
  box-shadow: 0 18px 34px -24px #26392d80;
  backdrop-filter: blur(6px);
  animation: ui-drift 7s ease-in-out infinite;
}

/* Segundo widget: misma animación, sentido inverso y más lenta */
.ui-float--reverse {
  animation: ui-drift 8.5s ease-in-out infinite reverse;
}

@keyframes ui-drift {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}

/* Variante corta para flechas o indicadores de scroll */
@keyframes ui-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

@media (prefers-reduced-motion: reduce) {
  .ui-float,
  .ui-float--reverse {
    animation: none;
  }
}
```

### 13.4 Panel con perspectiva

Contenedor de vista previa que descansa inclinado y se endereza al pasar el cursor.

```css
.ui-perspective {
  position: relative;
  overflow: hidden;
  border: 1px solid #deeee7;
  border-radius: var(--ui-radius-card);
  background: var(--ui-surface);
  box-shadow: 0 40px 80px -46px #26392d80, 0 2px 8px #26392d0f;
  transform: perspective(1400px) rotateY(-2.5deg) rotateX(1.5deg);
  transition: transform var(--ui-slow) var(--ui-ease);
}

.ui-perspective:hover {
  transform: perspective(1400px) rotateY(0deg) rotateX(0deg);
}

@media (prefers-reduced-motion: reduce) {
  .ui-perspective {
    transform: none;
  }
}
```

### 13.5 Contenedor de lista / acordeón

Variante estática: radio de tarjeta, mismo degradado y separadores internos.

```css
.ui-list {
  max-width: 720px;
  margin-inline: auto;
  overflow: hidden;
  border: 1px solid #d8f3e6;
  border-radius: var(--ui-radius-card);
  background:
    radial-gradient(140px 120px at 100% 0%, var(--ui-primary-soft) 0%, transparent 72%),
    linear-gradient(180deg, #ffffff 0%, #fcfefd 100%);
  box-shadow: var(--ui-shadow-xs);
}

.ui-list-item + .ui-list-item {
  border-top: 1px solid var(--ui-border-soft);
}

/* Respuesta que aparece al abrir */
.ui-list-answer {
  animation: ui-fade-in 0.22s var(--ui-ease);
}

@keyframes ui-fade-in {
  from { opacity: 0; transform: translateY(-3px); }
  to   { opacity: 1; transform: translateY(0); }
}

.ui-list-chevron {
  transition: transform var(--ui-base) var(--ui-ease);
}

.ui-list-item.is-open .ui-list-chevron {
  transform: rotate(180deg);
}
```

---

## 14. Botones

### 14.1 Base y tamaños

```css
.ui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ui-space-4);
  min-height: var(--ui-control);
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: var(--ui-radius-btn);
  font-size: var(--ui-text-md);
  font-weight: 700;
  letter-spacing: -0.1px;
  line-height: 1;
  white-space: nowrap;
  transition:
    transform var(--ui-fast) var(--ui-ease),
    background-color var(--ui-fast) var(--ui-ease),
    border-color var(--ui-fast) var(--ui-ease),
    box-shadow var(--ui-fast) var(--ui-ease),
    color var(--ui-fast) var(--ui-ease);
}

.ui-btn--lg {
  min-height: var(--ui-control-touch);
  padding: 0 24px;
  border-radius: var(--ui-radius-btn-lg);
  font-size: var(--ui-text-base);
}
```

| Tamaño | Alto | Padding | Radio | Fuente |
|---|---|---|---|---|
| Base | 36 px | 0 16 px | 11 px | 13 px / 700 |
| Grande | 44 px | 0 24 px | 14 px | 14 px / 700 |
| Móvil | 36 px / 44 px | 0 12 px / 0 16 px | 9 px / 10 px | 11.5 px / 12 px |

### 14.2 Variantes

```css
/* Acción principal */
.ui-btn--primary {
  background: var(--ui-primary);
  border-color: #18985c;
  color: var(--ui-on-primary);
  box-shadow: var(--ui-shadow-btn);
}

.ui-btn--primary:hover {
  background: var(--ui-primary-hover);
  border-color: #158350;
  transform: translateY(-1px);
  box-shadow: var(--ui-shadow-btn-hover);
}

/* Acción secundaria */
.ui-btn--outline {
  background: var(--ui-surface);
  border-color: var(--ui-border);
  color: #4d6157;
  box-shadow: 0 4px 14px -10px #26392d4d;
}

.ui-btn--outline:hover {
  border-color: #cceadc;
  background: var(--ui-surface-2);
  transform: translateY(-1px);
}

/* Acción terciaria */
.ui-btn--ghost {
  background: transparent;
  color: #55685d;
}

.ui-btn--ghost:hover {
  color: var(--ui-primary-deep);
  background: #eefbf5;
}

/* Sobre fondos de color */
.ui-btn--light {
  background: #ffffff;
  border-color: #ffffff;
  color: #2c4d3b;
  box-shadow: 0 14px 30px -18px #0f1d16cc;
}

.ui-btn--light:hover {
  background: #f5fdf9;
  transform: translateY(-1px);
}

.ui-btn--ghost-light {
  background: #ffffff14;
  border-color: #ffffff38;
  color: #eef6f0;
}

.ui-btn--ghost-light:hover {
  background: #ffffff22;
  border-color: #ffffff5c;
}
```

### 14.3 Estados

```css
.ui-btn:active {
  transform: translateY(0) scale(0.99);
  box-shadow: none;
}

.ui-btn:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 2px;
}

.ui-btn:disabled,
.ui-btn[aria-disabled="true"] {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

| Estado | Cambio |
|---|---|
| Reposo | Color pleno + sombra corta |
| Hover | −1 px, color más oscuro o fondo apenas tintado, sombra más amplia |
| Activo | `translateY(0) scale(0.99)`, sin sombra |
| Foco | Anillo de 2 px con el color de marca y 2 px de separación |
| Deshabilitado | Opacidad 55 %, sin elevación, cursor bloqueado |

### 14.4 Micro-animación de icono

Solo en botones donde el icono aporte significado (carrito, descarga, flecha). No la apliques a todos.

```css
.ui-btn--icon-motion svg {
  transition: transform var(--ui-base) var(--ui-ease);
}

.ui-btn--icon-motion:hover svg {
  transform: rotate(-8deg) scale(1.06);
}
```

---

## 15. Animaciones

### 15.1 Aparición al entrar en viewport (reveal)

**Regla clave:** animar `opacity` y `translate`, nunca `transform`. Así `transform` queda libre para el hover de las tarjetas.

HTML:

```html
<main data-reveal-root>
  <article class="ui-surface ui-card" data-reveal style="--i: 0">…</article>
  <article class="ui-surface ui-card" data-reveal style="--i: 1">…</article>
  <article class="ui-surface ui-card" data-reveal style="--i: 2">…</article>
</main>
```

CSS:

```css
[data-reveal-root][data-reveal-ready] [data-reveal] {
  transition:
    opacity 0.5s var(--ui-ease) calc(var(--i, 0) * var(--ui-stagger)),
    translate 0.5s var(--ui-ease) calc(var(--i, 0) * var(--ui-stagger)),
    transform var(--ui-base) var(--ui-ease),
    box-shadow var(--ui-base) var(--ui-ease),
    border-color var(--ui-base) var(--ui-ease);
}

[data-reveal-root][data-reveal-ready] [data-reveal]:not(.is-visible) {
  opacity: 0;
  translate: 0 10px;
}

/* Las filas de una tabla solo cambian opacidad: desplazarlas recortaría el scroll */
[data-reveal-root][data-reveal-ready] tr[data-reveal]:not(.is-visible) {
  translate: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal-root][data-reveal-ready] [data-reveal] {
    opacity: 1;
    translate: none;
    transition: none;
  }
}
```

JavaScript:

```js
const root = document.querySelector('[data-reveal-root]')

if (
  root &&
  'IntersectionObserver' in window &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const targets = root.querySelectorAll('[data-reveal]')

  // Una sola pasada: al entrar en pantalla se deja de observar.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  )

  // El estado oculto solo existe cuando el JS ya está listo:
  // sin JS el contenido se ve desde el principio.
  root.dataset.revealReady = 'true'
  targets.forEach((target) => observer.observe(target))
}
```

**Por qué funciona bien:** el estado oculto depende de `data-reveal-ready`, que solo escribe el JS. Si falla la hidratación, el usuario ve todo el contenido igualmente. El `--i` produce el escalonado de 60 ms.

### 15.2 Elevación en hover

| Elemento | Movimiento | Duración |
|---|---|---|
| Tarjeta | `translateY(-2px)` + sombra amplia + borde acento | `0.2s ease` |
| Tarjeta de producto | `translateY(-3px)` + sombra | `0.25s ease` |
| Botón | `translateY(-1px)` | `0.16s ease` |
| Botón activo | `translateY(0) scale(0.99)` | `0.16s ease` |

### 15.3 Barra de acento

| Propiedad | Reposo | Hover | Duración |
|---|---|---|---|
| Ancho | 28 px | 44 px | `0.2s ease` |
| Opacidad | 0.35 | 1 | `0.2s ease` |

### 15.4 Flotación decorativa

| Animación | Recorrido | Duración | Ciclo |
|---|---|---|---|
| `ui-drift` | `translateY(0 → −7px → 0)` | 7 s / 8.5 s | `ease-in-out`, infinito |
| `ui-bob` | `translateY(0 → 4px → 0)` | 2.6 s | `ease-in-out`, infinito |

Reserva estas animaciones para elementos secundarios (widgets, flechas de scroll), nunca para tarjetas de contenido ni botones.

### 15.5 Tabla resumen de movimiento

| Interacción | Propiedades | Duración | Retardo |
|---|---|---|---|
| Hover de botón | transform, color, sombra | 160 ms | — |
| Hover de tarjeta | transform, sombra, borde | 200 ms | — |
| Barra de acento | width, opacity | 200 ms | — |
| Icono de botón | transform | 200 ms | — |
| Reveal | opacity, translate | 500 ms | 60 ms × índice |
| Perspectiva 3D | transform | 400 ms | — |
| Acordeón | opacity, transform | 220 ms | — |
| Popover | opacity, transform | 160 ms | — |
| Flotación | transform | 2.6–8.5 s | — |

---

## 16. Accesibilidad

- **Foco visible:** `outline: 2px solid var(--ui-primary); outline-offset: 2px` en `button`, `a`, `input` y `select`.
- **Movimiento reducido:** desactiva reveal, flotación, perspectiva y popovers con `@media (prefers-reduced-motion: reduce)`. El contenido debe quedar visible sin animación.
- **Área táctil:** 44 px mínimo en acciones principales y navegación móvil.
- **Contraste:** texto sobre el color de marca en tono muy oscuro (`#0b2318`) para superar AA; el texto secundario no se usa por debajo de 12 px.
- **Sin dependencia del hover:** ninguna acción debe existir solo en `:hover`; en pantallas táctiles no existe.
- **Sin JS:** el contenido debe verse completo porque el estado oculto requiere `data-reveal-ready`.
- **Errores y avisos:** nunca solo con color; acompaña con icono, texto y `aria-live` cuando corresponda.

---

## 17. Cómo aplicarlo a otra web

1. Copia el bloque `:root` de la sección 11.
2. Ajusta el tema:
   - Marca: `--ui-primary`, `--ui-primary-hover`, `--ui-primary-deep`, `--ui-primary-soft`, `--ui-on-primary`.
   - Fondo: `--ui-bg`, `--ui-surface` y `--ui-surface-2`.
   - Acentos rotativos: `--ui-accent-2*` y `--ui-accent-3*` (opcionales).
3. Pega las clases `.ui-surface`, `.ui-card*`, `.ui-list*`, `.ui-panel-cta`, `.ui-float`, `.ui-perspective`, `.ui-btn*`, `.ui-scroll*`.
4. Añade el observer de la sección 15.1 al contenedor raíz.
5. Recorre el checklist completo de la sección 18.

### Ejemplo mínimo

```html
<section data-reveal-root>
  <article class="ui-surface ui-card" data-reveal style="--i: 0">
    <span class="ui-card-index">01</span>
    <span class="ui-card-icon" aria-hidden="true"><!-- icono --></span>
    <h3>Organiza tu trabajo</h3>
    <p>Una descripción breve, de dos líneas como máximo.</p>
    <span class="ui-card-accent" aria-hidden="true"></span>
  </article>

  <div class="ui-actions">
    <button class="ui-btn ui-btn--primary ui-btn--lg">Acción principal</button>
    <button class="ui-btn ui-btn--outline ui-btn--lg">Acción secundaria</button>
  </div>
</section>
```

```css
.ui-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ui-space-4);
  margin-top: var(--ui-space-7);
}
```

---

## 18. Checklist

**Medidas**

- [ ] Los espaciados salen de la escala 2 / 4 / 6 / 8 / 10 / 12 / 16 / 24 px.
- [ ] `gap` para el ritmo interno; `margin` solo exterior.
- [ ] Input, select y botón de una fila comparten altura.
- [ ] Controles de 30–32 px solo para filtros secundarios.
- [ ] Texto visible nunca menor a 10 px.
- [ ] Campos de escritura a 16 px en móvil.
- [ ] Scroll de 4 px con track transparente; sin barras en carruseles.
- [ ] Radios consistentes: 6–10 px controles, 14 px tarjetas, 18 px paneles, 26 px acceso.
- [ ] Bordes de 1 px; anillo de foco de 2 px con 2 px de separación.
- [ ] El control no cambia de tamaño al enfocar, deshabilitar o mostrar error.

**Componentes**

- [ ] Las tarjetas se elevan como máximo 2 px y los botones 1 px.
- [ ] Las tarjetas de solo lectura no tienen hover.
- [ ] La barra de acento crece de 28 a 44 px y sube a opacidad 1.
- [ ] Los acentos rotan en ciclos de tres.
- [ ] La tarjeta destacada aparece una sola vez por grupo.
- [ ] Los botones usan la misma altura base y el mismo radio.

**Movimiento**

- [ ] Solo se animan `transform`, `opacity`, `translate`, sombras y colores.
- [ ] El reveal usa `translate` y deja libre `transform`.
- [ ] El estado oculto del reveal depende de `data-reveal-ready`.
- [ ] `prefers-reduced-motion` desactiva reveal, flotación, perspectiva y popovers.
- [ ] Las animaciones continuas quedan solo en elementos decorativos.

**Accesibilidad**

- [ ] Todos los controles tienen `:focus-visible`.
- [ ] Las acciones táctiles miden al menos 44 px.
- [ ] Ningún estado o error se comunica solo con color.
- [ ] El contenido se ve completo sin JS.
