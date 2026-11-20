# Arquitectura visual: tamaños pequeños y minimalistas

Guía de dimensiones para las interfaces compactas del ERP, la tienda pública y la landing. Solo medidas: padding, margin, gap, alturas, radios, tipografía y scroll fino. La paleta de colores queda fuera y se define aparte con los tokens del tema.

## 0. Dónde vive cada medida

| Archivo | Contenido |
|---|---|
| `src/index.css` | Tokens compartidos `--admin-*` (espacio, tipografía, alturas, radios), utilidades `.scroll-fino` / `.scroll-oculto`, scroll fino global y campos de 16px en móvil |
| `src/App.css` | ERP y tienda pública: panel, tablas, filtros, modales, auth y términos. Alias de los tokens (`--space-*`, `--font-*`, `--control-height`, `--panel-radius`) |
| `src/LandingPage.css` | Landing de marketing con la misma escala |
| `src/App.tsx`, `src/LandingPage.tsx`, `src/TermsPage.tsx` | Utilidades Tailwind alineadas: `text-[10px]`, `gap-2`, `px-4`, `rounded-[14px]`, `h-11` |

Regla: ningún tamaño literal fuera de la escala. Cuando exista un token, usarlo.

## 1. Escala de espacio

| Token | Valor | Uso |
|---|---|---|
| `--admin-esp-1` | 2px | Separaciones internas mínimas |
| `--admin-esp-2` | 4px | Etiqueta → control, ajustes micro |
| `--admin-esp-3` | 6px | Gap entre controles de una fila |
| `--admin-esp-4` | 8px | Padding de controles y bloques chicos |
| `--admin-esp-5` | 10px | Padding de chips y píldoras |
| `--admin-esp-6` | 12px | Padding de página en móvil |
| `--admin-esp-7` | 16px | Padding de página en escritorio |
| `--admin-esp-8` | 24px | Separación entre secciones grandes |

Escala reutilizable: `2 · 4 · 6 · 8 · 10 · 12 · 16 · 24px`.

Reglas:

- Usar `gap` para el ritmo interno y `margin` solo para separar bloques.
- Múltiplos de 2px en componentes densos; de 4/8px en el resto.
- Reiniciar márgenes de títulos y párrafos (`margin: 0`) y dejar que el contenedor decida el espacio.
- No acumular márgenes entre componentes anidados.
- Por encima de 24px no hay espacio en la escala: las secciones grandes se separan como máximo con 24px.

## 2. Tipografía

| Token | Tamaño | Uso |
|---|---|---|
| `--admin-text-2xs` | 10px (`.625rem`) | Etiquetas micro, badges, contadores |
| `--admin-text-xs` | 11px (`.6875rem`) | Metadatos, pills y filtros secundarios |
| `--admin-text-xs-plus` | 11.5px (`.72rem`) | Resultados y textos de apoyo |
| `--admin-text-sm` | 12px (`.75rem`) | Buscadores y selectores compactos en escritorio |
| `--admin-text-md` | 13px (`.8125rem`) | Cuerpo denso |
| `--admin-text-base` | 14px (`.875rem`) | Cuerpo base de controles y formularios |
| `--admin-text-lg` | 16px (`1rem`) | Inputs en móvil y cuerpo de lectura |
| `--admin-text-xl` | 18px (`1.125rem`) | Título de tarjeta |
| `--admin-text-2xl` | 20px (`1.25rem`) | Título de vista |
| `--admin-text-3xl` | 22px (`1.35rem`) | Totales destacados, `h1` y títulos de la landing |

Interlineado: `--admin-leading-title` (`1.2`) para títulos, `--admin-leading-body` (`1.45`) para párrafos, `--admin-leading-reading` (`1.5`) para cuerpo.

- No usar texto visible menor a 10px.
- En móvil, los campos de escritura no bajan de 16px (`.field input`, buscadores y filtros).
- 22px es el techo de la escala: no hay escalones mayores, tampoco en la landing.

## 3. Alturas de control y áreas táctiles

| Token | Valor | Elemento |
|---|---|---|
| `--admin-control-h` | 36px | Control normal: buscador, filtros, botones, ítems de navegación, tabs |
| `--admin-control-h-field` | 32px | Input/select interno de formulario |
| `--admin-control-h-compact` | 30px | Botón sutil y píldoras de navegación |
| `--admin-control-h-chip` | 32px | Chip o píldora de filtro |
| `--admin-control-h-icon` | 38px | Botón de icono |
| `--admin-control-h-icon-mobile` | 42px | Botón de icono en cabecera móvil |
| `--admin-control-h-card` | 32px | Acción dentro de tarjeta o tabla |
| `--admin-control-h-touch` | 44px | Botón principal y acción táctil |
| `--admin-nav-h` | 56px | Barra superior, navegación y pie de términos |

- Mantener la misma altura entre input, select y botón de una misma fila.
- No mezclar variantes normal y compacta en la misma fila.
- El área táctil mínima es 44 × 44px aunque el glifo sea menor; `@media (pointer: coarse)` eleva los botones principales a 44px.

## 4. Radios y bordes

| Token | Valor | Elemento |
|---|---|---|
| `--admin-radius-control` | 6px | Control genérico |
| `--admin-radius-compact` | 10px | Control compacto, avatar, tile de icono |
| `--admin-radius-card` | 14px | Tarjeta, aviso, toast |
| `--admin-radius-panel` | 18px | Panel, modal, menú desplegable, hoja inferior |
| `--admin-radius-hero` | 26px | Tarjeta de login o bloque destacado |
| `--admin-radius-pill` | 999px | Chip, píldora, badge, contador |

- Bordes y separadores: `1px`.
- Anillo de foco: contorno de `2px` con `outline-offset: 2px`.
- No cambiar el tamaño del control al enfocar, deshabilitar o mostrar error.

## 5. Padding y margin por componente

| Componente | Medidas |
|---|---|
| Página (`main` del ERP) | Padding 12px móvil / 16px escritorio; 8px al pie |
| Barra superior | 56px de alto; padding lateral 16px escritorio / 12px móvil / 24px en pantallas anchas |
| Buscador global y de tabla | Alto 36px; padding lateral 8px; gap 6px |
| Filtro de inventario | Alto 32px; padding lateral 8px; gap 6px |
| Fila de filtros y acciones | Gap 6px; margen inferior 10px |
| Lista | Gap 8px (compacta) a 12px (base) |
| Tarjeta de estadística | Padding 10px × 12px; radio 14px |
| Panel | Padding 12px; radio 14px; filas con gap 8px |
| Tabla | Encabezado 32px; fila 44px; padding lateral 10px |
| Acción de fila | 32 × 32px |
| Formulario | Gap 8px; etiqueta → control 4px |
| Acceso y registro | Tarjeta 16px (12px móvil); inputs de 32px con texto 13px (16px en móvil); botón de Google 32px; enviar 36px |
| Aviso de verificación | Padding 10px × 12px; icono 28px; código monoespaciado de 14px |
| Modal | Caja 16px; título con margen inferior 6px; acciones con gap 6px |
| Aviso y toast | Padding 8px × 12px; radio 14px |
| Menú de espacios de trabajo | Padding 6px; radio 18px; opciones de 40px |
| Página de términos | Contenido con padding 24px; radio 18px; cabecera y pie de 56px |
| Llamado final de la landing | Padding 16px; radio 18px; título 20px; botones de 36px |

## 6. Scroll fino

```css
.scroll-fino {
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;              /* Firefox */
}

.scroll-fino::-webkit-scrollbar {
  width: 4px;                         /* vertical */
  height: 4px;                        /* horizontal */
}

.scroll-fino::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-fino::-webkit-scrollbar-thumb {
  border-radius: 999px;
}
```

- Barra visible: 4px; no superar 6px en interfaces compactas.
- Track transparente; el color del thumb lo aporta el tema (`#1DB973`).
- `overscroll-behavior: contain` para no encadenar el scroll con la página.
- Carruseles de chips, categorías y miniaturas: ocultar la barra.

```css
.scroll-oculto {
  overflow-x: auto;
  scrollbar-width: none;
}

.scroll-oculto::-webkit-scrollbar {
  display: none;
}
```

- Listas largas dentro de modales o cortinas: `max-height: 40vh` y scroll fino.
- Contenedores del ERP con scroll fino: `.workspace-menu`, `.product-modal`, `.image-modal` y la zona de contenido (`overflow-y-auto` con `overscroll-y-contain`).

## 7. Breakpoints

Los breakpoints son de layout; la escala de tamaños no cambia con ellos salvo los campos móviles.

| Ancho | Ajuste |
|---|---|
| ≤ 575.98px | Campos de escritura a 16px (evita el zoom de iOS) |
| ≤ 620px | Padding de página 12px; tarjetas y tablas con 8px |
| ≤ 850px | Navegación lateral fija; botón de 38px; cabecera de 52px |
| ≥ 851px | Padding de página 16px |
| ≥ 1500px | Padding lateral de la barra superior a 24px |
| ≤ 390px | Una columna en el formulario y ajustes de cabecera |

- Evitar mínimos de ancho que provoquen scroll horizontal.
- En móvil, las barras de filtros envuelven y los controles ocupan el ancho disponible.
- En escritorio, limitar anchos solo en barras de filtros; no fijar ancho rígido a todos los inputs.

## 8. Iconos con aviso, estado y notificación

La arquitectura de icono es independiente de su color:

- Usar un icono reconocible y consistente de una sola familia (el ERP utiliza Lucide).
- Alinear icono y texto con `inline-flex`, `align-items: center` y `gap: 6–8px`.
- Tamaño usual de icono junto a texto: 16–18px; icono aislado en acción: 18–22px. Mantener el área pulsable del botón (38px) aunque el glifo sea menor.
- Para un contador sobre una campana, hacer el botón `position: relative`; ubicar el contador arriba a la derecha con posición absoluta (`top: 7px; right: 7px`), punto de 6px y borde de 1px.
- No comunicar severidad solo con color: acompañar la marca con icono y/o texto (“Advertencia”, “Error”, “Información”) y, cuando proceda, `aria-live="polite"` o un nombre accesible para el botón.
- Los avisos temporales (toasts) siguen la misma estructura: icono, título, mensaje y cierre opcional, con padding 8px × 12px y radio 14px.
- Reservar el mismo espacio de icono en estados distintos para que reemplazar éxito por error no desplace el texto.

### Ayuda contextual (`.help-hint`)

El bloque usa un botón informativo circular y un panel emergente anclado a su esquina superior derecha.

- `.help-hint` es relativo y no crece ni se encoge en la fila (`flex: 0 0 auto`), para que el panel se posicione respecto a este control.
- `.help-hint__button` mide **38 × 38px**, es circular, usa `inline-flex` centrado y no tiene padding interno. El área de clic corresponde al círculo completo.
- El glifo es `CircleHelp`, de aproximadamente **16px**, con `line-height: 1`. Se oculta a lectores de pantalla porque el botón ya tiene `aria-label`.
- En `:hover` y `aria-expanded="true"` el botón conserva su tamaño y cambia solo su tratamiento visual. En `:active` se reduce brevemente con `transform: scale(.96)`.
- En `:focus-visible` muestra un contorno de **2px** separado **2px** del círculo.
- `.help-hint__panel` se posiciona en absoluto bajo el botón: `top: calc(100% + 8px)`, `right: 0`, con `z-index: 55`. Así no desplaza el contenido alrededor.
- Ancho: `min(300px, calc(100vw - 32px))`. Padding **12px**, borde y radio de **14px**. El contenido no debe forzar el ancho del panel.
- La flecha es el pseudo-elemento `::before`: cuadrado de **10 × 10px**, situado **6px** por encima del panel (`top: -6px`) y a **13px** del borde derecho. Solo se dibujan los bordes superior e izquierdo y se rota **45°**.
- El título (`strong`) va en su propia línea, con margen inferior de **4px** y peso alto. El cuerpo (`p`) no tiene margen exterior y usa `line-height: 1.5`.
- Al abrir, anima **160 ms** desde `opacity: 0` y `translateY(-4px)` hasta su posición normal. Con `prefers-reduced-motion: reduce` se elimina la animación.
- Cuando está cerrado, `[hidden]` aplica `display: none`. El botón expone `aria-expanded` y enlaza el panel con `aria-controls`; el panel usa `role="note"` y puede recibir foco.

## 9. Modales y avisos

- Caja del modal con padding de 16px (12px en móvil); radio de 18px.
- Cabecera con título de 18px, margen inferior de 6px y gap de 8px entre icono y texto.
- Espacio entre acciones: 6–8px. Agrupar botones al final y conservar áreas pulsables cómodas (36px, 44px en táctil).
- Evitar que títulos centrados y botones de cierre compitan: reservar su espacio y mantener el título en una sola línea cuando sea posible.
- Los mensajes de validación deben quedar junto al campo (`gap: 4px`); los avisos globales o toasts se reservan para el resultado de una acción.

## 10. Cómo se aplicó

- `src/index.css` define la escala `--admin-*` como única fuente de tamaños, el scroll de 4px y el mínimo de 16px en campos móviles.
- `src/App.css` dejó de tener dos variantes contradictorias: se eliminaron las declaraciones que una regla posterior con el mismo selector ya anulaba, y queda un solo valor compacto por selector.
- `src/LandingPage.css` usa la misma escala: textos entre 10 y 22px, radios 6–26px, ritmo de 2–24px y nav de 56px.
- La landing comparte una sola superficie (`.landing-surface`): radio de tarjeta 14px, tinte de 140×120px en la esquina, icono de 34px (28px en móvil), índice de 10px y barra de acento de 28×3px que crece a 44px en hover. Los acentos rotan mint → morado → carmesí por posición.
- Las utilidades Tailwind se alinearon (`text-[10px]`, `gap-2`, `px-4`, `rounded-[14px]`, `h-9`), y el contenido del ERP usa 12px en móvil / 16px en escritorio con 8px al pie.
- Los formularios bajaron un escalón: inputs de 32px con texto de 13px, tarjetas de acceso con 16px de padding y CTA de la landing con 16px de padding, radio 18px y botones de 36px.
- Quedan fuera de la escala, por ser geometría y no ritmo: anchos de contenedor (`max-w-[1180px]`), alturas de gráficos y tamaños de ilustraciones.

## 11. Checklist rápido

- [x] Espaciados tomados de la escala (2/4/6/8/10/12/16/24px).
- [x] `gap` para el ritmo interno; `margin` solo exterior.
- [x] Alturas iguales entre input, select y botón de la misma fila.
- [x] Controles compactos de 30–32px solo para filtros secundarios.
- [x] Áreas táctiles de al menos 44px en acciones principales.
- [x] Buscador a 100% en móvil y selectores en la fila siguiente.
- [x] Texto de buscador a 12px en escritorio y 16px en móvil.
- [x] Scroll de 4px con track transparente; sin barras en carruseles.
- [x] Radios consistentes: 6–10px controles, 14px tarjetas, 18px paneles, 26px login.
- [x] Sin textos visibles menores a 10px.
