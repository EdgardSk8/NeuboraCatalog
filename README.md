# Noubora Catalog

Aplicación web de inventario y catálogo público para pequeños negocios. Es un
producto de **TellezSoftware** y se publica de forma independiente en Cloudflare
Pages.

> **Para retomar el proyecto, lee primero [HANDOFF.md](./HANDOFF.md).** Ahí está
> el estado real, los recursos de Cloudflare con sus IDs, los pasos de despliegue
> y las decisiones de negocio ya aprobadas.

## Documentación

| Documento | Contenido |
| --- | --- |
| [HANDOFF.md](./HANDOFF.md) | Estado real, recursos de Cloudflare, despliegue y decisiones aprobadas |
| [DISENO.md](./DISENO.md) | Sistema visual reutilizable: medidas, contenedores, botones y animación |
| [PRICING.md](./PRICING.md) | Planes, precios y reglas de facturación |
| [Guia-Google-OAuth-Cloudflare.md](./Guia-Google-OAuth-Cloudflare.md) | Configurar Google OAuth en Cloudflare |

## Stack

React 19 + TypeScript + Vite · Cloudflare Pages Functions (runtime de Workers) ·
D1 (base de datos) · R2 (imágenes) · Wrangler.

## Ejecutar en localhost

Requiere Node.js 20.19+ o 22.12+.

```powershell
npm install
npm run dev
```

Vite muestra la dirección local (habitualmente `http://localhost:5173`) con datos
de demostración en el navegador.

Para levantar la aplicación real con Pages Functions, D1 y R2 simulados:

```powershell
npm run dev:stack
```

Queda en `http://localhost:8788`. `dev:stack` migra D1 con `--local` y Wrangler
guarda los datos bajo `.wrangler/`; nada se modifica en Cloudflare.

Para exponerla a la red local:

```powershell
npm run dev:stack:lan
```

También existe `iniciar-servidor.bat`: doble clic y elige solo local (1) o
local + red (2). Detecta la IP de la máquina y muestra las dos URLs.

> Sobre HTTP en la red local la cookie de sesión es `Secure` y el navegador la
> descarta, así que el catálogo se ve pero no se puede iniciar sesión desde otro
> dispositivo. Para eso hay que servir HTTPS con `--local-protocol https`.

## Comprobar cambios

```powershell
npm run build
npm run lint
npm test
```

## Estructura

| Ruta | Contenido |
| --- | --- |
| `src/` | Interfaz React (panel, landing, login, términos) |
| `functions/api/` | Endpoints de Pages Functions |
| `functions/_lib/` | Utilidades de auth, HTTP, Google y validación de imágenes |
| `shared/` | Tipos y reglas compartidas entre frontend y backend |
| `migrations/` | Migraciones SQL versionadas de D1 |
| `scripts/` | Aprovisionamiento de Cloudflare y pruebas de API local |
| `tests/` | Pruebas con `node:test` |
| `public/` | Logos, iconos, manifiesto y service worker |
