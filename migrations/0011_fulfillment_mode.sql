-- Forma de entrega del negocio. La ubicación solo se pide cuando el negocio
-- tiene local, hace delivery, permite retiro o envía a domicilio.
ALTER TABLE tenants ADD COLUMN fulfillment_mode TEXT NOT NULL DEFAULT 'none' CHECK (
  fulfillment_mode IN ('none', 'store', 'delivery', 'pickup', 'shipping')
);
