# HANDOFF — Noubora Catalog

> Documento de traspaso técnico. Está escrito para que otra persona u otra IA
> pueda continuar el proyecto **sin preguntar nada**: explica qué es, en qué
> estado está, qué recursos de Cloudflare usa y qué decisiones ya están tomadas.
>
> Última actualización: 20 de noviembre de 2026.

---

## 1. Contexto: qué es y de quién es

| Dato | Valor |
| --- | --- |
| Producto | **Noubora Catalog** |
| Empresa dueña | **TellezSoftware** (proyecto independiente de desarrollo de software) |
| Qué hace | Inventario, existencias y catálogo público para pequeños negocios |
| Mercado inicial | Nicaragua |
| Moneda | Cada negocio elige; NIO (córdoba) es la sugerida; se admite USD |
| Idiomas | Español e inglés |
| Modelo | SaaS multiempresa (varios negocios por cuenta, datos aislados por tenant) |

**Separación de marcas (decisión tomada):**

- **TellezSoftware** es el contenedor corporativo. Su sitio es estático, **no
  tiene inicio de sesión** y solo presenta los productos. Vive fuera de este
  repositorio, en la carpeta `site/` del repositorio matriz.
- **Noubora Catalog** es este producto: este repositorio. Tiene registro, login,
  inventario, catálogo y precios.
- En la interfaz, el producto se llama Noubora Catalog y el pie de página dice
  `© 2026 TellezSoftware`. El correo de contacto es `neuboracatalog@gmail.com`.

---

## 2. Estado real del proyecto

### Implementado y funcionando

- Registro e inicio de sesión con correo y contraseña.
- Verificación de correo con código de 6 dígitos: hasta confirmarlo, la cuenta
  solo puede ver el panel y el API rechaza cualquier escritura (403
  `email_not_verified`).
- Inicio de sesión con Google (OAuth 2.0 con `state` de un solo uso y PKCE S256).
- Sesiones en cookie `__Host-tellez-session` (HttpOnly, `Secure`, SameSite).
- Multiempresa: `tenants`, `tenant_memberships`, roles y aislamiento por tenant
  verificado en cada endpoint.
- Productos: alta, edición, archivado reversible, restauración y paginación por
  cursor.
- Perfiles de negocio: ropa/calzado, ferretería, productos sólidos e inventario
  personal.
- Movimientos de inventario con motivo y fecha (auditables).
- Imágenes: conversión a WebP en el navegador, máximo **5 por producto** y
  **150 KiB** por archivo, guardadas en R2 privado.
- Catálogo público por negocio en `/catalogo/{slug}`, que solo muestra productos
  con existencia.
- Interfaz bilingüe ES/EN.
- Términos y condiciones versionados (`CURRENT_TERMS_VERSION` en `shared/terms.ts`).

### Pendiente (no anunciar como existente)

- Recuperación y cambio de contraseña (falta definir el flujo).
- Protección antiabuso del registro (Turnstile, límites de intentos).
- Pedidos, delivery, repartidores y liquidaciones (Fase 5 del plan).
- Pasarela de pago y cobro de suscripciones.
- Reportes, exportación CSV y API pública.
- Multi-sucursal y multi-almacén.
- Variantes reales con existencia propia: hoy `products.variant` es un campo de
  texto descriptivo, no un sistema de SKUs.
- Página de precios con cobro activo: la estructura existe, el cobro no.

---

## 3. Stack y arquitectura

- **Frontend:** React 19 + TypeScript + Vite 8. Una sola página con enrutado por
  `window.location.pathname`.
- **Backend:** Cloudflare Pages Functions sobre el runtime de Workers. Todo el
  código de autorización y validación vive en el servidor.
- **Base de datos:** Cloudflare D1 con migraciones SQL versionadas.
- **Archivos:** Cloudflare R2 privado; las imágenes se sirven mediante endpoints
  que verifican pertenencia al tenant o visibilidad del catálogo.
- **Estilo:** monolito modular. No hay microservicios ni colas y no hacen falta.

### Estructura del repositorio

| Ruta | Contenido |
| --- | --- |
| `src/` | Interfaz: `App.tsx` (panel), `LandingPage.tsx`, `TermsPage.tsx` |
| `functions/api/` | Endpoints de Pages Functions |
| `functions/_lib/` | `auth.ts`, `google.ts`, `http.ts`, `product-images.ts` |
| `shared/` | Reglas y tipos compartidos: perfiles de negocio, categorías, términos |
| `migrations/` | `0001` a `0008`, migraciones SQL |
| `scripts/` | `provision-cloudflare.mjs` (infra) y `test-local-api.mjs` |
| `tests/` | Pruebas con `node:test` + `--experimental-strip-types` |
| `public/` | Logo, iconos, manifiesto PWA y service worker |

### Rutas del frontend

| Ruta | Qué muestra |
| --- | --- |
| `/` | Panel si hay sesión; landing del producto si no |
| `/bienvenida` | Landing aunque haya sesión (útil para revisarla) |
| `/ingresar` | Inicio de sesión y registro |
| `/terminos` | Términos y condiciones (`?lang=en` para inglés) |
| `/catalogo/{slug}` | Catálogo público del negocio |

---

## 4. Recursos de Cloudflare (producción)

| Recurso | Nombre | Identificador |
| --- | --- | --- |
| Proyecto Pages | `tellezsoftware` | — |
| Dominio de producción | `tellezsoftware.pages.dev` | — |
| D1 producción | `tellezsoftware` | `b5146cf5-5045-4bfb-b9e2-3a0e73213947` |
| D1 preview | `tellezsoftware-preview` | `dad5eac4-f082-48e6-9830-4471a50db273` |
| R2 producción | `tellezsoftware-files-production` | — |
| R2 preview | `tellezsoftware-files-preview` | — |

**Bindings en `wrangler.jsonc`:** `DB` (D1) y `FILES` (R2), con un bloque `env.preview`
que apunta a los recursos de preview.

**Secretos del proyecto (no van en el repositorio):**

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Enlaces al panel de Cloudflare

- Panel general: <https://dash.cloudflare.com>
- Workers & Pages: <https://dash.cloudflare.com/?to=/:account/workers-and-pages>
- Proyecto Pages: <https://dash.cloudflare.com/?to=/:account/pages/view/tellezsoftware>
- Bases D1: <https://dash.cloudflare.com/?to=/:account/d1>
- D1 producción: <https://dash.cloudflare.com/?to=/:account/d1/databases/b5146cf5-5045-4bfb-b9e2-3a0e73213947>
- D1 preview: <https://dash.cloudflare.com/?to=/:account/d1/databases/dad5eac4-f082-48e6-9830-4471a50db273>
- Buckets R2: <https://dash.cloudflare.com/?to=/:account/r2>

> Los enlaces con `:account` resuelven a la cuenta con la que hayas iniciado
> sesión. No se guardó ningún ID de cuenta ni credencial en este repositorio.

---

## 5. Cómo levantar el proyecto en local

Requiere **Node.js 20.19+ o 22.12+**.

```powershell
npm install
npm run dev          # interfaz con datos demo en http://localhost:5173
npm run dev:stack    # app real con D1 y R2 simulados en http://localhost:8788
npm run dev:stack:lan  # además expuesta a la red local
```

`dev:stack` aplica las migraciones locales (`wrangler d1 migrations apply
tellezsoftware --local`) y luego compila y sirve. Los datos locales viven en
`.wrangler/` y **no** se sincronizan con Cloudflare.

También existe `iniciar-servidor.bat`: menú con opción 1 (solo local) y 2 (local
+ red). Detecta la IP de la máquina y muestra las dos URLs.

### Verificación antes de dar algo por terminado

```powershell
npm run build   # tsc + vite build
npm run lint    # oxlint
npm test        # node:test, 8 pruebas
```

---

## 6. Cómo desplegar

```powershell
# Primera vez
npx wrangler login
npx wrangler pages project create tellezsoftware --production-branch main

# Desplegar (la rama main va a producción)
npm run build
npx wrangler pages deploy dist --project-name tellezsoftware --branch main

# Rama de preview
npx wrangler pages deploy dist --project-name tellezsoftware --branch preview
```

### Migraciones en remoto

```powershell
npx wrangler d1 migrations apply tellezsoftware --remote
npx wrangler d1 migrations apply tellezsoftware --remote --env preview
```

### Secretos en producción

```powershell
npx wrangler pages secret put GOOGLE_CLIENT_ID --project-name tellezsoftware
npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name tellezsoftware
```

También se puede conectar el repositorio de GitHub desde el panel de Pages con:
comando de compilación `npm run build`, directorio de salida `dist`.

---

## 7. Google OAuth (paso a paso)

- Proyecto de Google Cloud: **`My First Project`** (`gentle-shell-463320-v5`).
- Cliente OAuth de tipo **Web application**.
- Consola de credenciales:
  <https://console.cloud.google.com/apis/credentials?project=gentle-shell-463320-v5>

**Redirect URIs registradas:**

- `https://tellezsoftware.pages.dev/api/auth/google/callback`
- `http://localhost:8788/api/auth/google/callback`

**Orígenes JS autorizados:** `https://tellezsoftware.pages.dev`

**Cómo funciona:** `GET /api/auth/google/start` genera `state` de un solo uso y
PKCE (S256) en una cookie HttpOnly de 10 minutos; el callback valida `state`,
canjea el código, exige `email_verified` y guarda el `sub` de Google en
`oauth_accounts`. **El correo nunca se usa como identificador.** Si el correo ya
existe con contraseña, no se fusionan cuentas: se pide iniciar sesión con el
método original.

**Modo de la app:** sigue en *Testing* (máximo 100 usuarios de prueba). Para
abrirla al público hay que publicarla en *Google Auth Platform → Público* y antes
cargar la política de privacidad en *Información de la marca*.

**Para añadir un dominio nuevo** (por ejemplo `noubora.com`): añadir la redirect
URI nueva y el origen JS, guardar, y dejar la anterior un par de semanas hasta
confirmar que nadie la usa.

---

## 8. Base de datos

| Migración | Qué agrega |
| --- | --- |
| `0001_initial_schema.sql` | `tenants`, `users`, `tenant_memberships`, `sessions`, `login_attempts`, `products`, `stock_movements` |
| `0002_product_images.sql` | `product_images` |
| `0003_product_archive.sql` | Archivado reversible de productos |
| `0004_terms_acceptance.sql` | Aceptación versionada de términos |
| `0005_business_type.sql` | Tipo de negocio por espacio de trabajo |
| `0006_workspace_setup.sql` | Estado de configuración inicial |
| `0007_phone_trial_plan.sql` | Teléfono y plan de prueba |
| `0008_google_oauth.sql` | `oauth_accounts` (vínculo con Google por `sub`) |
| `0009_email_verification.sql` | `email_verification_codes` (código de confirmación hasheado, vencimiento e intentos) |

Reglas para quien continúe:

- Toda tabla nueva necesita migración con número consecutivo.
- Las migraciones deben ser compatibles hacia atrás: nunca borres columnas en la
  misma entrega que deja de usarlas.
- Prueba siempre primero con `--local`.

---

## 9. API disponible

| Ruta | Método |
| --- | --- |
| `/api/auth/register` | POST |
| `/api/auth/login` | POST |
| `/api/auth/logout` | POST |
| `/api/auth/me` | GET |
| `/api/auth/verification/send` | POST |
| `/api/auth/verification/confirm` | POST |
| `/api/auth/google/start` | POST |
| `/api/auth/google/callback` | GET |
| `/api/products` | GET, POST |
| `/api/products/{id}` | PATCH |
| `/api/products/{id}/images` | GET, POST |
| `/api/products/{id}/images/{imageId}` | GET, DELETE |
| `/api/inventory/adjust` | POST |
| `/api/inventory/movements` | GET |
| `/api/catalog/{slug}` | GET |
| `/api/catalog/{slug}/images/{imageId}` | GET |
| `/api/workspaces` | GET |
| `/api/workspaces/setup` | PATCH |
| `/api/workspaces/switch` | POST |
| `/api/workspaces/settings` | PATCH |
| `/api/workspaces/initialize-types` | POST |

Todas las rutas privadas verifican sesión **y** pertenencia al tenant en el
servidor. Nunca confíes en el `tenant_id` que venga del cliente.

Las rutas de escritura (productos, imágenes, inventario y espacios de trabajo)
además exigen `users.email_verified = 1`: si el correo no está confirmado
responden `403` con `code: "email_not_verified"`.

### Verificación de correo

- Al registrarse con correo y contraseña la cuenta nace con
  `email_verified = 0` y se guarda un código de **6 dígitos** en
  `email_verification_codes` (solo el hash SHA-256 con el `user_id` como sal).
- El código se envía con Cloudflare Email Sending (`env.EMAIL`), vence en
  **10 minutos**, admite **5 intentos** y se puede reenviar cada **60 segundos**
  (máximo 5 envíos por hora).
- Hasta confirmarlo la cuenta solo ve el panel: no hay acceso a configuración,
  productos, inventario ni ajustes, y el servidor rechaza cualquier escritura.
- Las cuentas creadas con Google ya vienen verificadas por Google.
- Migración `0009`: las cuentas anteriores a la regla quedan marcadas como
  verificadas para no bloquear a los usuarios existentes.

Configuración de envío:

1. Habilitar el dominio en Email Sending: `npx wrangler email sending enable noubora.com`.
2. El binding `send_email` (`EMAIL`) ya está en `wrangler.jsonc` y `wrangler.local.jsonc`.
3. Definir `MAIL_FROM` (por defecto `no-reply@noubora.com`) y `MAIL_FROM_NAME`.
   En Pages: *Settings → Variables and Secrets*.
4. En local, `wrangler pages dev` **simula** el envío: el código aparece en la
   consola (`send_email binding called with...`) y el correo se guarda en
   `.wrangler/tmp/email/...`.

---

## 10. Decisiones de negocio ya aprobadas

### Planes y precios (aprobados el 19/11/2026)

| Plan | USD/mes | C$/mes | Anual USD | Productos | Usuarios | Negocios |
| --- | --- | --- | --- | --- | --- | --- |
| Emprende | $0 | C$0 | — | 100 | 1 | 1 |
| Básico | $5 | C$180 | $45 | 300 | 2 | 1 |
| Negocio | $12 | C$450 | $100 | 1,500 | 5 | 1 |
| Pro | $25 | C$925 | $200 | 5,000 | 10 | 3 |
| Empresa | $49+ | C$1,800+ | $588+ | 20,000+ | ilimitados | ilimitados |

- **Se cobra por negocio, no por usuario.**
- Descuento anual: 25 % en Básico, 31 % en Negocio, 33 % en Pro; Empresa sin
  descuento.
- El detalle completo y su justificación están en [PRICING.md](./PRICING.md).

### Delivery y comisiones

- La plataforma cobra **20 % de la tarifa de delivery**; el 80 % es del
  repartidor. **No** se cobra comisión sobre el valor de los productos.
- Aún no está implementado. Cuando se implemente, debe quedar registrado y ser
  auditable por pedido.

### Reglas de marca

- Producto: **Noubora Catalog**. Empresa: **TellezSoftware**.
- El nombre del producto no se traduce (en inglés también es "Noubora Catalog").
- El sitio corporativo no tiene login; los precios viven en el producto.
- **Paleta propia de Noubora** (la anterior `#00C885` / `#8500C8` / `#C80043`
  pertenecía a TellezSoftware):

| Rol | Hex | Token |
| --- | --- | --- |
| Verde principal | `#1DB973` | `--brand` |
| Magenta | `#B91DB1` | `--accent-magenta` |
| Rojo | `#B9251D` | `--accent-red` |

- Los neutros (tinta, grises, bordes) y los ámbar de aviso no cambian.
- Los colores de Google (`#4285F4`, `#EA4335`, `#FBBC05`, `#34A853`) se
  mantienen tal cual.

---

## 11. Reglas de seguridad para quien continúe

1. **Nunca** subas `.dev.vars`, `login.txt`, claves ni tokens al repositorio.
   `.dev.vars` está en `.gitignore`.
2. **No renombres** el proyecto de Pages, la base D1 ni los buckets R2. Son
   nombres internos; cambiarlos rompe despliegues y puede perder datos.
3. **No crees una D1 nueva** para "mover" la app: los usuarios viven ahí. Si
   algún día se cambia de proyecto, hay que **vincular la misma D1 y el mismo
   R2**.
4. Autoriza siempre en el servidor. La interfaz no es un control de seguridad.
5. Las contraseñas usan PBKDF2-SHA256 con **100.000 iteraciones** porque el
   runtime de Workers rechaza valores mayores (`NotSupportedError`).
6. Las imágenes se validan por firma y dimensiones antes de guardarse; el tope es
   5 por producto y 150 KiB, en WebP.

---

## 12. Migrar a un dominio propio (`noubora.com`)

El dominio **no requiere un proyecto nuevo**. Pasos:

1. Comprar el dominio (Cloudflare Registrar lo vende a precio de costo).
2. En Pages → proyecto `tellezsoftware` → *Custom domains* → añadir
   `noubora.com` y `www.noubora.com`. Cloudflare crea el DNS y el certificado.
3. Google Cloud → Credentials → cliente OAuth → añadir:
   - Redirect URI: `https://noubora.com/api/auth/google/callback`
   - Origen JS: `https://noubora.com`
   Dejar las anteriores activas al menos una semana.
4. Actualizar en `index.html`: `og:url`, `og:image`, `twitter:image`.
5. Actualizar los enlaces del sitio corporativo (`site/index.html` y
   `site/en/index.html`) que hoy apuntan a `https://tellezsoftware.pages.dev`.
6. Avisar a los vendedores: los enlaces de catálogo cambian de dominio. Opcional:
   dejar el proyecto viejo sirviendo un 301.
7. Recordar: **las sesiones abiertas se cierran una vez** porque la cookie cambia
   de dominio. Los usuarios y los datos no se pierden.

---

## 13. Próximos pasos sugeridos, en orden

1. Recuperación y cambio de contraseña (la verificación de correo ya usa
   Cloudflare Email Sending).
2. Protección antiabuso del registro y del login (Turnstile + límites).
3. Implementar planes y límites en D1 según `PRICING.md`.
4. Pasarela de cobro o activación manual con comprobante.
5. Pedidos, delivery y liquidación (Fase 5).
6. Reportes y exportación CSV.

### Decisiones de negocio pendientes

- **Antiabuso:** definir límites de intentos, Turnstile y/o verificación antes de abrir el registro.
- **Delivery:** quién fija la tarifa, si el repartidor es usuario o empresa externa, frecuencia de liquidación y manejo de cancelaciones, devoluciones y pedidos parciales.
- **Pedidos:** retiro en tienda desde el primer hito y compra como invitado o con cuenta obligatoria.
- **Pagos:** comprobante/referencia para efectivo, billeteras y transferencias; procesador de tarjeta disponible en Nicaragua.
- **Operación:** zona horaria, formato de fecha, impuestos, numeración y documentos fiscales de Nicaragua.
- **Productos y tiendas:** campos obligatorios por rubro, unidades y serialización, reglas de publicación, datos públicos del vendedor y aprobación previa de tiendas.
- **Expansión:** países y monedas después de Nicaragua.

---

## 14. Documentos de referencia

| Documento | Contenido |
| --- | --- |
| [DISENO.md](./DISENO.md) | Sistema visual único: escala de medidas, superficies, botones, animaciones y accesibilidad |
| [PRICING.md](./PRICING.md) | Planes, precios, comparación de mercado y reglas de facturación |
| [Guia-Google-OAuth-Cloudflare.md](./Guia-Google-OAuth-Cloudflare.md) | Guía paso a paso del OAuth |
