# Pendientes — Noubora Catalog

> Última actualización: 20 de noviembre de 2026, 21:10 (America/Managua).
> Estado: Google OAuth y el rediseño del panel están desplegados. El registro con
> correo y contraseña vuelve a exigir confirmación por código. Para el estado
> técnico completo, consulta [HANDOFF.md](./HANDOFF.md).

---

## 0. Trabajo de esta sesión (sin commit todavía)

- **Formulario de producto por tipo de negocio.** `shared/product-form-profile.ts`
  define etiquetas, placeholders, categorías sugeridas, unidades y campos
  visibles para los ocho giros (`clothing`, `hardware`, `food`, `liquor`,
  `electronics`, `auto_parts`, `general`, `personal`). El modal de
  [App.tsx](./src/App.tsx) consume ese perfil: el nombre del campo, el ejemplo,
  el selector de unidad y la variante cambian según el negocio. En la tienda
  general, la categoría (`Bebidas`, `Ropa`…) ajusta unidades y variante.
- **Imágenes de producto.** Al seleccionar una foto se optimiza al instante en
  el navegador, se muestra una vista previa numerada con botón para quitarla y
  el contador `n/5`. Al guardar se suben ya optimizadas (sin recomprimir). El
  texto visible solo dice “Hasta 5 imágenes por producto”; ya no menciona WebP.
- **Paleta completa en el panel.** Las tarjetas de resumen, el donut, la
  leyenda, los accesos rápidos, los estados y las miniaturas usan solo verde
  (`#1db973`), magenta (`#b91db1`) y rojo (`#b9251d`) con sus tonos suaves.
- **Sesión en desarrollo arreglada.** Sobre HTTP la cookie se emite como
  `tellez-session` sin `Secure` (el prefijo `__Host-` exige HTTPS y el navegador
  la descartaba). En HTTPS de producción se mantiene `__Host-tellez-session`.
- **Cuenta de prueba local.** `npm run db:seed:dev` crea `dev@noubora.local` /
  `noubora-dev-2026` con cuatro espacios de trabajo y productos de ejemplo; en
  `127.0.0.1` el acceso muestra un botón para entrar con ella.
- **Código / SKU opcional.** Al crear un producto el campo puede quedar vacío: el
  backend genera un código legible y único (tres letras de la categoría y cuatro
  caracteres aleatorios, p. ej. `GRA-FD78`). Al editar, dejar el campo vacío
  conserva el código actual.
- **Alerta de stock bajo en enteros.** El campo usa `step="1"`, redondea al salir
  y el backend guarda `Math.round(minStock)`, así que nunca queda `3.06`.
- **Modal y botones alineados al sistema de diseño.** El modal tiene barra de
  acento con la paleta, cabecera fija, cuerpo con scroll propio (secciones
  “Datos del producto” e “Inventario y precios”) y pie fijo con las acciones.
  Los botones pasan a 36 px, radio 10 px, padding 0 16 px, fuente 13 px y
  micro-elevación al pasar el cursor.
- **Verificación por correo reactivada.** El registro crea la cuenta con
  `email_verified = 0`, emite un código de 6 dígitos y lo envía. Hasta
  confirmarlo el panel queda bloqueado: la pantalla de confirmación sustituye a
  toda la aplicación y el API rechaza cualquier escritura con
  `403 email_not_verified`. Al validar el código correcto se desbloquea todo.
  En local, `DEV_SHOW_VERIFICATION_CODE=true` devuelve el código en la respuesta
  y la pantalla lo muestra para poder probar sin correo.
- **Entrega y ubicación en Configurar cuenta.** La configuración inicial ya no
  pide país, ciudad ni dirección (ni GPS): solo nombre, giro, moneda y teléfono.
  En **Configurar cuenta** se elige la forma de entrega —solo catálogo, tienda
  física, delivery a domicilio, retiro en tienda o envío a domicilio— y, cuando
  hay punto de entrega o retiro, aparecen país, ciudad y dirección. Al volver a
  «solo catálogo» esos datos se limpian. Migración `0011_fulfillment_mode.sql`.
- **Pruebas:** `npm test` pasa **16/16**; la última es
  `tests/fulfillment.test.ts`.

---

## 1. Lo que ya quedó funcionando

- **Google OAuth en producción y local.** El botón abre la cuenta de Google,
  canjea el código y crea la sesión. Se probó el flujo completo en
  `127.0.0.1:8788` y el inicio con una cuenta existente en producción.
- **Cuentas existentes con correo y contraseña:** si el correo coincide con una
  cuenta de Google verificada, la identidad de Google se vincula a esa cuenta y
  se permite entrar con cualquiera de los dos métodos.
- **Registro con verificación:** la cuenta se crea con `email_verified = 0`, se
  envía el código de 6 dígitos y el panel queda bloqueado hasta confirmarlo.
- **Migración `0010_disable_email_verification.sql`:** aplicada en producción y
  en local. Marcó como verificadas las cuentas que existían en ese momento y
  eliminó los códigos pendientes; las cuentas nuevas vuelven a nacer pendientes.
- **URIs de Google agregadas:** `http://127.0.0.1:8788` como origen JS y
  `http://127.0.0.1:8788/api/auth/google/callback` como redirect URI, además de
  producción y `localhost`.
- **Credenciales locales:** `.dev.vars` existe en la raíz (ignorado por git) con
  el Client ID, el Client Secret nuevo, `MAIL_FROM` y `MAIL_FROM_NAME`.
- **Secreto de Google rotado:** el secreto nuevo está activo en Google Cloud,
  Cloudflare Pages y `.dev.vars`. El anterior quedó **inhabilitado**.
- **Build y pruebas:** `npm run build` correcto; `npm test` pasa **8/8**.

### Deploy actual

- Producción: <https://nouboracatalog.pages.dev>
- Último deployment: `fbc87851`
- `dist/` está compilado con los cambios actuales.

---

## 2. Pendientes y decisiones

### 2.1 Secreto antiguo de Google

- El secreto terminado en `kCzd` está **inhabilitado**, pero todavía visible en
  Google Auth Platform → Clientes → `Noubora Catalog Web` → *Información y
  resumen* → *Secretos del cliente*.
- Si todo sigue estable, bórralo desde ahí. No lo borres si quieres conservar
  una vía de rollback.
- **Nunca** subas el secreto al repositorio.

### 2.2 Cuentas actuales en producción

| Correo | Estado | Google vinculado | Configuración |
| --- | --- | --- | --- |
| `tellezsoftware@gmail.com` | Verificada | Sí | Incompleta, sin productos |
| `osais1000@gmail.com` | Verificada | No | Incompleta, sin productos |

- Si alguna de las dos no se va a usar, elimínala o limpia su tenant.
- Si se va a usar, entra y termina la configuración del negocio.
- `osais1000@gmail.com` todavía puede vincularse automáticamente al pulsar
  “Continuar con Google”.

### 2.3 Correos de prueba

- Hay correos de prueba enviados a variantes `tellezsoftware+...@gmail.com`.
- Se pueden borrar desde Gmail; sus cuentas y códigos ya fueron eliminados de D1.

### 2.4 Verificación por correo

- **Sí se exige** para crear cuentas con correo y contraseña: la cuenta nace con
  `email_verified = 0`, el panel queda bloqueado y solo se desbloquea al
  confirmar el código de 6 dígitos.
- En producción el envío sale por el Worker `nouboracatalog-mailer` (service
  binding `MAILER`) o por el relay de Gmail si están configurados.
- En local, `DEV_SHOW_VERIFICATION_CODE=true` en `.dev.vars` devuelve el código
  en la respuesta del API y la pantalla de confirmación lo muestra. Esa variable
  **no** debe existir en Cloudflare Pages.

### 2.5 Antiabuso

- Al no verificar el correo, es más fácil crear cuentas y aprovechar la prueba de
  7 días / 10 productos.
- Pendiente recomendado: añadir Turnstile, límites por IP/correo y rate limiting
  antes de abrir el registro masivamente.

### 2.6 Pruebas que faltan

- Añadir pruebas automatizadas para:
  - Registro que devuelve `emailVerified: true` y no crea código.
  - Vinculación de una cuenta de Google con un usuario existente.
- Probar el inicio con Google usando `osais1000@gmail.com` si se va a conservar
  esa cuenta.

### 2.7 Commit — completado

Los cambios se confirmaron en el commit **«Configura Google OAuth y desactiva
la verificación por correo»** (14 archivos, +1070/−248):

- `HANDOFF.md`, `README.md`, `PENDIENTES.md`
- `.dev.vars.example`
- `functions/_lib/email.ts`
- `functions/api/auth/google/callback.ts`
- `functions/api/auth/register.ts`
- `functions/api/auth/verification/send.ts`
- `scripts/gmail-relay.gs`
- `src/App.css`, `src/App.tsx`
- `migrations/0010_disable_email_verification.sql`
- `public/copiar-codigo.html`, `public/privacidad.html`

`.dev.vars` quedó fuera del commit (está en `.gitignore`). El árbol de trabajo
quedó limpio y `npm test` pasa **8/8** antes de confirmar.

Si vuelves a tocar estos archivos, el comando de referencia es:

```powershell
git add HANDOFF.md README.md PENDIENTES.md .dev.vars.example functions scripts src migrations public
git commit -m "Configura Google OAuth y desactiva la verificación por correo"
```

### 2.8 Lint

`npm run lint` sigue fallando por un error previo, no relacionado con estos
cambios:

- `src/App.tsx:1428` — `useGpsLocation` llamado dentro de un callback.

También hay warnings previos de `Date.now` y escapes innecesarios.

---

## 3. Cómo continuar en local

El servidor local se detuvo al cerrar la sesión. Para levantarlo de nuevo:

```powershell
npm run build
npx wrangler pages dev dist --port 8788 --ip 0.0.0.0
```

Queda en <http://127.0.0.1:8788> y usa `.dev.vars`.

Para volver a desplegar:

```powershell
npm run build
npx wrangler pages deploy dist --project-name nouboracatalog --commit-dirty=true
```

Migraciones:

```powershell
npx wrangler d1 migrations apply nouboracatalog --remote
npx wrangler d1 migrations apply nouboracatalog --local
```

---

## 4. Referencias rápidas

- Google Auth Platform:
  <https://console.cloud.google.com/auth/overview?project=tellezsoftware-auth>
- Cliente OAuth:
  <https://console.cloud.google.com/auth/clients?project=tellezsoftware-auth>
- Cloudflare Pages:
  <https://dash.cloudflare.com/?to=/:account/pages/view/nouboracatalog>
- D1 producción: `nouboracatalog` (`c850de7e-b330-41df-90c1-f2336bb0e40f`)
- Última documentación técnica: [HANDOFF.md](./HANDOFF.md)
