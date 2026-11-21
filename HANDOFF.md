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
  `© 2026 TellezSoftware`. El correo de contacto es `tellezsoftware@gmail.com`.

---

## 2. Estado real del proyecto

### Implementado y funcionando

- Registro e inicio de sesión con correo y contraseña.
- Registro y login sin verificación obligatoria: las cuentas nuevas quedan
  verificadas al crearse y pasan directamente a configurar el negocio. La
  infraestructura de códigos se conserva para el flujo heredado, pero la
  migración `0010` marcó todas las cuentas existentes como verificadas.
- Inicio de sesión con Google (OAuth 2.0 con `state` de un solo uso y PKCE S256),
  configurado en el proyecto `tellezsoftware-auth` y publicado en producción.
- Sesiones en cookie `__Host-tellez-session` (HttpOnly, `Secure`, SameSite).
- Multiempresa: `tenants`, `tenant_memberships`, roles y aislamiento por tenant
  verificado en cada endpoint.
- Productos: alta, edición, archivado reversible, restauración y paginación por
  cursor.
- Perfiles de negocio: ropa/calzado, ferretería, productos sólidos e inventario
  personal.
- Movimientos de inventario con motivo y fecha (auditables).
- Imágenes: se optimizan en el navegador antes de subirse (máximo **5 por
  producto**, **150 KiB** por archivo tras la conversión a WebP) y se guardan en
  R2 privado. El usuario solo ve el límite de 5 y una vista previa de cada foto.
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
| `migrations/` | `0001` a `0009`, migraciones SQL |
| `scripts/` | `provision-cloudflare.mjs` (infra) y `test-local-api.mjs` |
| `workers/` | `mailer.js`: Worker interno que expone Email Sending a Pages |
| `tests/` | Pruebas con `node:test` + `--experimental-strip-types` |
| `public/` | Logo, iconos, manifiesto PWA, service worker, `privacidad.html` y `copiar-codigo.html` |

### Rutas del frontend

| Ruta | Qué muestra |
| --- | --- |
| `/` | Verificación si la cuenta no confirmó el correo; panel si la sesión está verificada; landing si no hay sesión |
| `/bienvenida` | Landing aunque haya sesión (útil para revisarla) |
| `/ingresar` | Inicio de sesión y registro |
| `/terminos` | Términos y condiciones (`?lang=en` para inglés) |
| `/privacidad` | Política de privacidad (página estática en `public/privacidad.html`) |
| `/copiar-codigo` | Copia el código de verificación desde el enlace del correo |
| `/catalogo/{slug}` | Catálogo público del negocio |

---

## 4. Recursos de Cloudflare (producción)

| Recurso | Nombre | Identificador |
| --- | --- | --- |
| Proyecto Pages | `nouboracatalog` | — |
| Dominio de producción | `nouboracatalog.pages.dev` | — |
| Repositorio | `EdgardSk8/NeuboraCatalog` (rama `main`) | — |
| D1 producción | `nouboracatalog` | `c850de7e-b330-41df-90c1-f2336bb0e40f` |
| D1 preview | `nouboracatalog-preview` | `ff212bee-ce8e-4490-a396-623b4c3a97a6` |
| R2 producción | `nouboracatalog-files-production` | — |
| R2 preview | `nouboracatalog-files-preview` | — |
| Worker de correo | `nouboracatalog-mailer` | — |

> Los recursos `tellezsoftware*` siguen existiendo como instalación anterior. La
> aplicación nueva no comparte base de datos ni imágenes con ellos: empieza con
> D1 y R2 vacíos.

**Bindings en `wrangler.jsonc`:** `DB` (D1), `FILES` (R2) y `MAILER` (service
binding al Worker de correo), con un bloque `env.preview` que apunta a los
recursos de preview.

**Secretos del proyecto (no van en el repositorio):**

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

> **Estado:** ambos secretos están configurados en el proyecto `nouboracatalog`
> y el botón de Google funciona en producción. Los secretos se cargan con
> `wrangler pages secret put`; después hay que volver a desplegar para que el
> nuevo deployment los reciba. Los valores no se guardan en este repositorio.

**Correo:** el canal principal es el relay de Gmail (`tellezsoftware@gmail.com`)
en `scripts/gmail-relay.gs`, configurado con los secretos `MAIL_RELAY_URL` y
`MAIL_RELAY_SECRET`. Pages no admite `send_email`; como alternativa con dominio
propio queda el Worker `nouboracatalog-mailer` con el service binding `MAILER`.

### Enlaces al panel de Cloudflare

- Panel general: <https://dash.cloudflare.com>
- Workers & Pages: <https://dash.cloudflare.com/?to=/:account/workers-and-pages>
- Proyecto Pages: <https://dash.cloudflare.com/?to=/:account/pages/view/nouboracatalog>
- Bases D1: <https://dash.cloudflare.com/?to=/:account/d1>
- D1 producción: <https://dash.cloudflare.com/?to=/:account/d1/databases/c850de7e-b330-41df-90c1-f2336bb0e40f>
- D1 preview: <https://dash.cloudflare.com/?to=/:account/d1/databases/ff212bee-ce8e-4490-a396-623b4c3a97a6>
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
npm run db:seed:dev  # cuenta de prueba con cuatro espacios de trabajo
```

`dev:stack` aplica las migraciones locales (`wrangler d1 migrations apply
nouboracatalog --local`) y luego compila y sirve. Los datos locales viven en
`.wrangler/` y **no** se sincronizan con Cloudflare.

`db:seed:dev` crea (o recrea) la cuenta de prueba `dev@noubora.local` con la
contraseña `noubora-dev-2026` y cuatro espacios de trabajo —ropa, ferretería,
alimentos y tienda general— con productos de ejemplo. En `127.0.0.1` la
pantalla de acceso muestra un botón para entrar con esa cuenta. Solo existe en
la base local: en producción ese correo no está registrado.

### Sesión en desarrollo

La cookie de sesión se emite como `__Host-tellez-session` con `Secure` cuando la
petición llega por HTTPS (producción). Sobre HTTP —`localhost` o la IP de la red
local— se emite como `tellez-session` sin `Secure`, porque el prefijo `__Host-`
exige HTTPS y el navegador descartaría la cookie. El backend lee ambos nombres,
así que las sesiones abiertas siguen siendo válidas.

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
npx wrangler pages project create nouboracatalog --production-branch main

# Desplegar (la rama main va a producción; el proyecto está conectado a GitHub)
npm run build
npx wrangler pages deploy dist --project-name nouboracatalog --branch main

# Rama de preview
npx wrangler pages deploy dist --project-name nouboracatalog --branch preview

# Worker interno de correo (solo si cambia workers/mailer.js)
npm run deploy:mailer
```

> El proyecto está conectado a `EdgardSk8/NeuboraCatalog`, pero durante la puesta
> en marcha los `git push` no dispararon builds. Si vuelve a ocurrir, revisa en
> GitHub → Settings → Applications que la app de Cloudflare Pages tenga acceso al
> repositorio, o despliega manualmente con `npm run build` y el comando
> `wrangler pages deploy` de arriba.

### Migraciones en remoto

```powershell
npx wrangler d1 migrations apply nouboracatalog --remote
npx wrangler d1 migrations apply nouboracatalog --remote --env preview
```

### Secretos en producción

```powershell
npx wrangler pages secret put GOOGLE_CLIENT_ID --project-name nouboracatalog
npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name nouboracatalog
```

También se puede conectar el repositorio de GitHub desde el panel de Pages con:
comando de compilación `npm run build`, directorio de salida `dist`.

---

## 7. Google OAuth (paso a paso)

- Cuenta de Google: **`tellezsoftware@gmail.com`**.
- Proyecto de Google Cloud: **`TellezSoftware Auth`** (`tellezsoftware-auth`).
  Se usa para esta app y queda disponible para futuras aplicaciones de
  TellezSoftware.
- Cliente OAuth: **`Noubora Catalog Web`**, tipo **Web application**.
- Client ID (público):
  `887091178384-ad49lbic533ms075orpd5mi5ddc7and3.apps.googleusercontent.com`
- Client Secret: solo en Cloudflare (`GOOGLE_CLIENT_SECRET`) y en Google Cloud.
  **Nunca** se guarda en el repositorio.
- Consola de Auth Platform:
  <https://console.cloud.google.com/auth/overview?project=tellezsoftware-auth>
- Clientes:
  <https://console.cloud.google.com/auth/clients?project=tellezsoftware-auth>

**Redirect URIs registradas:**

- `https://nouboracatalog.pages.dev/api/auth/google/callback`
- `http://localhost:8788/api/auth/google/callback`
- `http://127.0.0.1:8788/api/auth/google/callback`

**Orígenes JS autorizados:**

- `https://nouboracatalog.pages.dev`
- `http://localhost:8788`
- `http://127.0.0.1:8788`

**Desarrollo local:** `.dev.vars` (ignorado por git) contiene
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MAIL_FROM` y `MAIL_FROM_NAME` para
que el botón funcione con `wrangler pages dev`.

**Información de la marca registrada:**

- Página principal: `https://nouboracatalog.pages.dev`
- Política de privacidad: `https://nouboracatalog.pages.dev/privacidad`
- Condiciones del servicio: `https://nouboracatalog.pages.dev/terminos`
- Dominio autorizado: `nouboracatalog.pages.dev`
- Sin logotipo en la pantalla de consentimiento para no activar la verificación
  externa mientras la app usa solo scopes básicos.

**Cómo funciona:** el frontend llama `POST /api/auth/google/start` (solo POST;
un GET devuelve el HTML de la SPA). El endpoint genera `state` de un solo uso y
PKCE (S256) en una cookie HttpOnly de 10 minutos; el callback valida `state`,
canjea el código, exige `email_verified` y guarda el `sub` de Google en
`oauth_accounts`. **El correo nunca se usa como identificador.** Si el correo ya
existe con contraseña, se vincula la identidad de Google a esa misma cuenta
(Google ya confirmó la dirección) y se crea la sesión; así el usuario puede
entrar con Google o con su contraseña.

**Modo de la app:** **En producción** (público, sin lista de usuarios de prueba).
Los scopes son `openid`, `email` y `profile`; no son sensibles. Si en el futuro
se sube un logotipo, se superan 10 dominios o se piden scopes sensibles, Google
puede exigir verificación.

**Verificación realizada:** `POST /api/auth/google/start` responde `200` con una
URL de `accounts.google.com` en producción y en `127.0.0.1:8788`. El flujo
completo se probó con una cuenta nueva y con una cuenta existente de correo y
contraseña; en ambos casos crea la sesión y entra a la configuración del negocio.
La cuenta de Google queda vinculada a la cuenta existente.

**Para añadir un dominio nuevo** (por ejemplo `noubora.com`): añadir la redirect
URI y el origen JS nuevos, agregar el dominio en *Información de la marca*,
guardar y dejar los anteriores activos al menos una semana hasta confirmar que
nadie los usa. Si se agrega un logotipo o más de 10 dominios, revisar si Google
exige verificación.

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
| `0010_disable_email_verification.sql` | Verifica las cuentas existentes y elimina códigos pendientes; el alta ya no exige confirmación |

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
además exigen `users.email_verified = 1`. La comprobación se mantiene por
seguridad, pero las cuentas nuevas y las existentes ya quedan verificadas.

### Verificación de correo (flujo heredado)

- El alta actual con correo y contraseña **no exige verificación**: la cuenta se
  crea con `email_verified = 1`, no se envía ningún código y pasa directamente a
  la configuración del negocio.
- Las cuentas creadas con Google también entran verificadas.
- Migración `0010_disable_email_verification.sql`: marca como verificadas las
  cuentas existentes que aún no habían confirmado y elimina los códigos
  pendientes.
- La pantalla independiente, los endpoints `/api/auth/verification/*`, el correo
  de confirmación y el relay de Gmail se conservan para el flujo heredado, pero
  el registro ya no los usa.
- Para referencia del flujo heredado: el correo usa el remitente
  **TellezSoftware** y un diseño minimalista inspirado en GitHub; el código y el
  botón **Copiar código** abren `/copiar-codigo#<código>`.

Configuración de envío (Gmail):

1. Desplegar `scripts/gmail-relay.gs` como Web App con la cuenta
   `tellezsoftware@gmail.com`:
   - Ejecutar como **Yo**.
   - Acceso: **Cualquier persona**.
2. Guardar la URL `/exec` y el mismo secreto del script en Pages:

   ```powershell
   npx wrangler pages secret put MAIL_RELAY_URL --project-name nouboracatalog
   npx wrangler pages secret put MAIL_RELAY_SECRET --project-name nouboracatalog
   ```

3. `MAIL_FROM` por defecto es `tellezsoftware@gmail.com` y `MAIL_FROM_NAME` es
   `TellezSoftware`; se pueden sobrescribir en Pages.
4. Alternativa con dominio propio: habilitar Email Sending en el dominio,
   desplegar `nouboracatalog-mailer` (`npm run deploy:mailer`) y mantener el
   service binding `MAILER`.
5. En local, `wrangler pages dev` usa `EMAIL` y **simula** el envío: el código
   aparece en la consola (`send_email binding called with...`) y el correo se
   guarda en `.wrangler/tmp/email/...`.

> **Mientras el relay de Gmail no esté configurado**, las cuentas nuevas quedan
> con `email_verified = 0` y el servidor rechaza sus escrituras. Para desbloquear
> una cuenta manualmente:
>
> ```powershell
> npx wrangler d1 execute nouboracatalog --remote --command "UPDATE users SET email_verified = 1 WHERE email = 'correo@ejemplo.com'"
> ```
>
> Cuando exista un dominio en Cloudflare, basta con habilitarlo para Email
> Sending y volver a desplegar el Worker; el código ya está preparado.

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
- La prueba al registrarse dura **7 días** y permite hasta **10 productos**;
  después se requiere un plan de pago. Está aplicado en `products.ts`.
- **Inconsistencia pendiente:** el plan Emprende gratuito de la tabla y de la
  landing (100 productos) todavía no está implementado. Hoy la única vía
  gratuita es la prueba de 7 días con 10 productos.

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
2. En Pages → proyecto `nouboracatalog` → *Custom domains* → añadir
   `noubora.com` y `www.noubora.com`. Cloudflare crea el DNS y el certificado.
3. Google Auth Platform → Clientes → cliente `Noubora Catalog Web` → añadir:
   - Redirect URI: `https://noubora.com/api/auth/google/callback`
   - Origen JS: `https://noubora.com`
   - Dominio autorizado: `noubora.com`
   Dejar los anteriores activos al menos una semana.
4. Actualizar en `index.html`: `og:url`, `og:image`, `twitter:image`.
5. Actualizar los enlaces del sitio corporativo (`site/index.html` y
   `site/en/index.html`) que hoy apuntan a `https://nouboracatalog.pages.dev`.
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
