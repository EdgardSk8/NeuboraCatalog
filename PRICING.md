# Precios y planes — Noubora Catalog

Este documento define la estructura comercial de suscripciones para el mercado
inicial (Nicaragua, NIO) y su comparación con el mercado actual.

**Estado:** la escalera de precios e ítems de la sección 3 fue **aprobada por el
propietario el 19 de noviembre de 2026**. Sigue pendiente la implementación
(migración, límites aplicados en el API y pruebas) y las decisiones abiertas de
la sección 8. Ninguna cifra se considera vigente para clientes hasta que exista
código que la aplique.

Reglas del documento:

- Los precios se expresan en **USD/mes** y en **córdobas redondeados** con
  referencia aproximada de **C$37 por USD**; recalcular si el tipo de cambio
  se mueve más de 10 %.
- Los precios de la competencia se verificaron el **19 de noviembre de 2026**
  en sus páginas públicas y corresponden a **facturación anual**; los planes
  mensuales suelen costar entre 15 % y 40 % más.
- La comisión del 20 % sobre la tarifa de delivery ya está decidida en
  `HANDOFF.md` y **se mantiene separada** de la suscripción.

## 1. Principios

1. **Cobrar por negocio (tenant), no por usuario.** Una pyme nicaragüense tiene
   2–4 personas operando; el cobro por asiento frena la adopción y ningún
   competidor de la región lo usa en el segmento de entrada.
2. **Plan gratis con límites duros.** Todos los comparables tienen plan gratuito;
   sin él, el registro se frena antes de que el negocio vea valor.
3. **El plan de $5 es de entrada, no de utilidad.** Sirve para convertir y
   filtrar; el ingreso recurrente real viene del plan de $12 y de la comisión
   de delivery.
4. **Límites medibles y aplicados en el servidor.** Productos, usuarios,
   negocios e imágenes se validan en Pages Functions, no solo en la interfaz.
5. **Precios redondeados en córdobas.** C$180 / C$450 / C$925 / C$1,800, siempre
   con la referencia en USD visible.

## 2. Comparación de mercado (verificada el 2026-11-19)

| Aplicación | Entrada | Plan medio | Plan alto | Modelo de cobro |
| --- | --- | --- | --- | --- |
| Loyverse (POS) | $0 | $5 y $25 (complementos) | — | gratis + add-ons |
| Sortly (inventario) | $0 (100 ítems) | $24 | $74 / $149 | límites por plan |
| Zoho Inventory | $0 | $29 | $79 / $129 / $249 | por organización |
| Alegra (Colombia) | ~$14 (COP 56.175) | ~$31 | ~$47 / ~$60 | por ingresos del negocio |
| Shopify | $5 (Starter) | $39 (Basic) | $105 (Grow) | por canal |

Fuentes consultadas: `loyverse.com/pricing`, `sortly.com/pricing`,
`zoho.com/inventory/pricing`, `alegra.com/colombia/precios`.

Conclusiones que guían la propuesta:

- **Nadie cobra por usuario** en el segmento pyme de Latinoamérica: se cobra por
  organización, por ingresos o por volumen de ítems.
- **El punto de $5 existe y está validado** (Loyverse lo usa como complemento;
  Shopify como plan de entrada), pero en ambos casos es un plan deliberadamente
  recortado.
- **Alegra segmenta por ingresos del negocio**, no por cantidad de funciones.
  Es un criterio a considerar más adelante para el plan Empresa.
- El plan gratuito de la competencia es real (no es solo prueba), lo que obliga
  a que nuestro plan gratis sirva para operar, pero con techo de crecimiento.

### 2.1 Referencia de precio por ítem (Sortly, verificado el 2026-11-19)

Sortly es el comparable más cercano porque también cobra por cantidad de ítems:

| Plan Sortly | Precio | Ítems incluidos | USD por ítem/mes |
| --- | --- | --- | --- |
| Free | $0 | 100 | — |
| Advanced | $24 | 500 | $0.048 |
| Ultra | $74 | 2,000 | $0.037 |
| Business | $149 | 5,000 | $0.030 |
| Enterprise | a medida | 10,000+ | — |

Esta tabla es la que fija la escala de Noubora Catalog: no se puede regalar más
por menos que el comparable directo sin destruir el valor del producto. La
propuesta queda **entre 3 y 6 veces más barata por ítem que Sortly**, lo que
corresponde a la diferencia de poder adquisitivo del mercado nicaragüense.

## 3. Planes aprobados

| Plan | USD/mes | C$/mes | Anual USD | Anual C$ | Dirigido a |
| --- | --- | --- | --- | --- | --- |
| **Emprende** | $0 | C$0 | — | — | Probar la app o llevar inventario personal |
| **Básico** | $5 | C$180 | $45 | C$1,650 | Un negocio que formaliza su inventario |
| **Negocio** | $12 | C$450 | $100 | C$3,700 | Negocio con más catálogo y más usuarios |
| **Pro** | $25 | C$925 | $200 | C$7,400 | Varios negocios en la misma cuenta |
| **Empresa** | $49+ | C$1,800+ | $588+ | C$21,700+ | Cadenas y distribuidores |

El descuento anual aprobado no es de un mes: equivale a **25 % en Básico, 31 %
en Negocio y 33 % en Pro**, y **Empresa no tiene descuento** (paga 12 meses).

### 3.1 Límites de recursos

Todos los límites de esta tabla se pueden aplicar hoy, porque corresponden a
recursos que ya existen en el producto (productos, usuarios, negocios,
imágenes).

| Límite | Emprende | Básico | Negocio | Pro | Empresa |
| --- | --- | --- | --- | --- | --- |
| Precio USD/mes | $0 | $5 | $12 | $25 | $49+ |
| Productos activos | 100 | 300 | 1,500 | 5,000 | 20,000+ |
| Usuarios por negocio | 1 | 2 | 5 | 10 | ilimitado |
| Negocios por cuenta | 1 | 1 | 1 | 3 | ilimitado |
| Imágenes por producto | 1 | 3 | 5 | 5 | 5 |
| USD por producto/mes | — | $0.017 | $0.008 | $0.005 | $0.003 |
| Soporte | comunidad | correo (48 h) | correo (24 h) | WhatsApp prioritario | dedicado |

Perfil de cliente por escalón, para que el límite no sea arbitrario:

| Plan | Ítems | Negocio típico en Nicaragua |
| --- | --- | --- |
| Emprende | 100 | Prueba, inventario personal, pulpería que inicia |
| Básico | 300 | Pulpería establecida, cosméticos, boutique pequeña |
| Negocio | 1,500 | Boutique completa, farmacia pequeña, ferretería pequeña |
| Pro | 5,000 | Ferretería completa, distribuidora pequeña, varias sucursales |
| Empresa | 20,000+ | Mayorista, supermercado, cadena |

### 3.2 Funciones por plan y estado real de cada una

Ninguna función se anuncia ni se cobra antes de estar en producción. Esta tabla
separa lo que el producto hace hoy de lo que depende de fases pendientes.

| Función | Estado | Desde qué plan |
| --- | --- | --- |
| Inventario con perfiles de negocio | **Disponible** | Emprende |
| Archivado y restauración de productos | **Disponible** | Emprende |
| Imágenes WebP en R2 | **Disponible** | Emprende |
| Catálogo público `/catalogo/{slug}` | **Disponible** | Emprende (con marca) |
| Quitar la marca de la plataforma | **Disponible** | Básico |
| Usuarios y roles por negocio | **Disponible** | Según límite del plan |
| Varios negocios por cuenta | **Disponible** | Pro |
| Exportar CSV | Pendiente | — |
| Reportes de inventario | Pendiente | — |
| Pedidos, delivery y liquidación (Fase 5) | Pendiente | — |
| Comisión del 20 % de delivery | Pendiente | — |
| Multi-sucursal y multi-almacén | Pendiente | — |
| API e integraciones | Pendiente | — |

Consecuencia práctica: **hoy solo se puede vender inventario, catálogo e
imágenes.** Los precios de $12, $25 y $49 quedan definidos como meta, pero la
escalera de ítems es lo único exigible al cliente hasta completar la Fase 5.

Notas sobre los límites:

- **Productos:** el límite cuenta **productos activos**. Los archivados no
  consumen cupo, pero se conservan como máximo 12 meses antes de poder
  purgarse; así se evita castigar al negocio que limpia su catálogo.
- **Variantes:** hoy `variant` es un campo de texto descriptivo, no un sistema
  de SKUs con existencia propia. Cuando existan variantes reales hay que decidir
  si consumen cupo (ver sección 8).
- **Imágenes:** el límite coincide con el tope técnico ya implementado de cinco
  imágenes WebP de 150 KiB por producto.
- **Catálogo público con marca:** el plan gratuito muestra una etiqueta discreta
  «Hecho con Noubora Catalog» con enlace; los planes pagos la quitan.

## 4. Reglas de facturación

1. **Anual con descuento variable:** Básico $45 (25 %), Negocio $100 (31 %) y
   Pro $200 (33 %); Empresa $588 sin descuento. Es el formato recomendado
   para transferencia, billetera móvil y depósito, donde el cobro recurrente
   automático no existe.
2. **Mensual solo con tarjeta o cobro automático.** Con procesador de tarjeta,
   $5 netos quedan cerca de $4.50 tras comisión y tipo de cambio; conviene
   empujar el anual.
3. **Activación manual para medios locales.** BAC, Lafise, transferencia y
   billetera móvil requieren comprobante y activación por administración; el
   plan no se activa por redirección del navegador.
4. **Periodo de gracia de 5 días** tras el vencimiento con aviso en la interfaz;
   luego el negocio pasa a solo lectura (no se borran datos) hasta 60 días.
5. **Cambio de plan inmediato hacia arriba**, al final del ciclo hacia abajo,
   con bloqueo si los límites del nuevo plan ya están excedidos.

## 5. Piloto y precio congelado

- Primeros **20–30 negocios**: plan Básico gratis durante **3 meses** a cambio
  de retroalimentación y permiso para usar su nombre o logotipo.
- Al terminar, se les ofrece **50 % de descuento de por vida** sobre Básico
  (C$90/mes) si se suscriben en los siguientes 30 días.
- El piloto no incluye delivery real con repartidores hasta que la liquidación
  y los comprobantes estén probados.

## 6. Relación con la comisión de delivery

> El delivery y la comisión aún **no están implementados** (Fase 5). Esta
> sección fija el criterio para cuando existan; no es una oferta vigente.

La suscripción y la comisión cumplen funciones distintas:

- **Suscripción:** compromiso del vendedor y filtro de calidad; evita tiendas
  abandonadas con catálogo vacío.
- **Comisión del 20 % de la tarifa de delivery:** fuente principal de ingreso
  cuando hay volumen. Un pedido con C$1,000 de envío genera C$200, equivalente a
  40 meses del plan Básico.

Recomendaciones:

- Mantener la comisión **solo sobre la tarifa de delivery** en esta etapa; no
  cobrar comisión sobre el valor de los productos hasta tener volumen y
  conciliación probada.
- No incluir la comisión dentro del precio de la suscripción: se facturan y
  auditan por separado.
- Publicar la comisión en los términos antes de abrir el marketplace.

## 7. Implementación técnica mínima (pendiente)

1. Migración D1 con `plans`, `plan_limits` y `subscriptions`
   (`tenant_id`, `plan_id`, `status`, `period_start`, `period_end`,
   `billing_cycle`, `price_amount`, `currency`, `activated_by`, `notes`).
2. Estado del plan por `tenant_id`; nunca por usuario.
3. Verificación de límites en Pages Functions antes de cada alta o cambio:
   productos, usuarios, negocios e imágenes.
4. Panel de administración para activar, extender y suspender manualmente, con
   registro de auditoría y comprobante adjunto en R2.
5. Avisos en la interfaz al llegar al 80 % y 100 % de cada límite.
6. Pruebas: intento de exceder límites por API, aislamiento entre tenants,
   expiración del periodo y paso a solo lectura.

## 8. Decisiones abiertas

- ~~Aprobar los precios y límites de la tabla de la sección 3.~~ Aprobado el
  2026-11-19.
- Definir el procesador de tarjeta disponible para Nicaragua y su comisión.
- Confirmar si el plan gratuito tendrá catálogo público desde el lanzamiento o
  solo inventario.
- Definir si se ofrecerá facturación en córdobas con equivalente en USD o solo
  referencia informativa.
- Revisar con asesoría fiscal el tratamiento de IVA y comprobantes de las
  suscripciones.
- Decidir si las variantes reales consumirán cupo de productos o si se contarán
  por separado; de esto depende que el plan Básico alcance o no para una tienda
  de ropa.
- Revisar la escalera completa **cuando la Fase 5 (pedidos y delivery) esté en
  producción** y con los primeros 50 clientes reales; hasta entonces los precios
  de $12, $25 y $49 son objetivo, no oferta publicable.
