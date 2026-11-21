import type { BusinessType } from './business-types.ts'
import type { ProductKind } from './product-categories.ts'

export type FormLanguage = 'es' | 'en'

export type FieldCopy = { label: string; placeholder: string }

export type ProductFormProfile = {
  name: FieldCopy
  sku: FieldCopy
  category: FieldCopy & { suggestions: string[] }
  unit: { label: string; options: string[] }
  quantity: FieldCopy
  minStock: FieldCopy
  cost: FieldCopy
  price: FieldCopy
  variant: FieldCopy
  /** `null` cuando el tipo de negocio no maneja números de serie. */
  serial: FieldCopy | null
}

const UNITS_BY_KIND: Record<ProductKind, string[]> = {
  clothing: ['unidad', 'paquete', 'caja'],
  hardware: ['unidad', 'caja', 'paquete', 'metro', 'centímetro', 'kilogramo', 'gramo', 'rollo'],
  auto_parts: ['unidad', 'caja', 'paquete'],
  electronics: ['unidad', 'caja', 'paquete'],
  food: ['kilogramo', 'gramo', 'unidad', 'paquete', 'caja', 'litro'],
  beverages: ['botella', 'caja', 'litro', 'galón'],
  general: ['unidad', 'caja', 'paquete', 'kilogramo', 'litro'],
}

export function unitsForProductKind(kind: ProductKind): string[] {
  return [...UNITS_BY_KIND[kind]]
}

function variantForKind(kind: ProductKind, language: FormLanguage): FieldCopy {
  const copyByKind: Record<ProductKind, { es: FieldCopy; en: FieldCopy }> = {
    clothing: {
      es: { label: 'Color o talla (opcional)', placeholder: 'Ej. Azul / Talla M' },
      en: { label: 'Colour or size (optional)', placeholder: 'e.g. Blue / Size M' },
    },
    hardware: {
      es: { label: 'Medida o material (opcional)', placeholder: 'Ej. 1/2 pulg. / acero' },
      en: { label: 'Size or material (optional)', placeholder: 'e.g. 1/2 in / steel' },
    },
    electronics: {
      es: { label: 'Modelo o especificación (opcional)', placeholder: 'Ej. 128 GB / negro' },
      en: { label: 'Model or specification (optional)', placeholder: 'e.g. 128 GB / black' },
    },
    auto_parts: {
      es: { label: 'Compatibilidad (opcional)', placeholder: 'Ej. Modelo / año' },
      en: { label: 'Compatibility (optional)', placeholder: 'e.g. Model / year' },
    },
    food: {
      es: { label: 'Peso o presentación (opcional)', placeholder: 'Ej. 500 g / paquete' },
      en: { label: 'Weight or packaging (optional)', placeholder: 'e.g. 500 g / package' },
    },
    beverages: {
      es: { label: 'Volumen o presentación (opcional)', placeholder: 'Ej. 750 ml / caja de 12' },
      en: { label: 'Volume or packaging (optional)', placeholder: 'e.g. 750 ml / case of 12' },
    },
    general: {
      es: { label: 'Detalle adicional (opcional)', placeholder: 'Ej. Material o presentación' },
      en: { label: 'Additional detail (optional)', placeholder: 'e.g. Material or packaging' },
    },
  }
  return { ...copyByKind[kind][language] }
}

type TypeCopy = {
  name: FieldCopy
  sku: FieldCopy
  category: FieldCopy & { suggestions: string[] }
  quantity: FieldCopy
  variant: FieldCopy
  serial: FieldCopy | null
  units: string[]
}

const TYPE_COPY: Record<BusinessType, { es: TypeCopy; en: TypeCopy }> = {
  clothing: {
    es: {
      name: { label: 'Nombre del producto', placeholder: 'Ej. Camisa deportiva talla M' },
      sku: { label: 'Código / SKU', placeholder: 'CAM-NEG-M' },
      category: { label: 'Categoría', placeholder: 'Ej. Ropa', suggestions: ['Ropa', 'Calzado', 'Accesorios'] },
      quantity: { label: 'Unidades disponibles', placeholder: 'Ej. 24' },
      variant: { label: 'Color o talla (opcional)', placeholder: 'Ej. Azul / Talla M' },
      serial: null,
      units: ['unidad', 'paquete', 'caja'],
    },
    en: {
      name: { label: 'Product name', placeholder: 'e.g. Sports shirt size M' },
      sku: { label: 'Code / SKU', placeholder: 'SHIRT-BLK-M' },
      category: { label: 'Category', placeholder: 'e.g. Clothing', suggestions: ['Clothing', 'Footwear', 'Accessories'] },
      quantity: { label: 'Units available', placeholder: 'e.g. 24' },
      variant: { label: 'Colour or size (optional)', placeholder: 'e.g. Blue / Size M' },
      serial: null,
      units: ['unidad', 'paquete', 'caja'],
    },
  },
  hardware: {
    es: {
      name: { label: 'Nombre del producto', placeholder: 'Ej. Taladro percutor 650 W' },
      sku: { label: 'Código / SKU', placeholder: 'FER-TAL-065' },
      category: { label: 'Categoría', placeholder: 'Ej. Herramientas', suggestions: ['Herramientas', 'Materiales', 'Electricidad', 'Repuestos'] },
      quantity: { label: 'Cantidad en stock', placeholder: 'Ej. 12' },
      variant: { label: 'Medida o material (opcional)', placeholder: 'Ej. 1/2 pulg. / acero' },
      serial: { label: 'Número de serie (opcional)', placeholder: 'Ej. Serie del equipo o lote' },
      units: ['unidad', 'caja', 'paquete', 'metro', 'centímetro', 'kilogramo', 'gramo', 'rollo'],
    },
    en: {
      name: { label: 'Product name', placeholder: 'e.g. 650 W hammer drill' },
      sku: { label: 'Code / SKU', placeholder: 'TOOL-DRL-650' },
      category: { label: 'Category', placeholder: 'e.g. Tools', suggestions: ['Tools', 'Materials', 'Electrical', 'Auto parts'] },
      quantity: { label: 'Stock quantity', placeholder: 'e.g. 12' },
      variant: { label: 'Size or material (optional)', placeholder: 'e.g. 1/2 in / steel' },
      serial: { label: 'Serial number (optional)', placeholder: 'e.g. Tool or batch serial' },
      units: ['unidad', 'caja', 'paquete', 'metro', 'centímetro', 'kilogramo', 'gramo', 'rollo'],
    },
  },
  electronics: {
    es: {
      name: { label: 'Nombre del producto', placeholder: 'Ej. Smartphone 128 GB' },
      sku: { label: 'Código / SKU', placeholder: 'TEC-CEL-128' },
      category: { label: 'Categoría', placeholder: 'Ej. Tecnología', suggestions: ['Tecnología', 'Celulares', 'Accesorios'] },
      quantity: { label: 'Unidades disponibles', placeholder: 'Ej. 8' },
      variant: { label: 'Modelo o especificación (opcional)', placeholder: 'Ej. 128 GB / negro' },
      serial: { label: 'IMEI o número de serie (opcional)', placeholder: 'Ej. IMEI 356789012345678' },
      units: ['unidad', 'caja', 'paquete'],
    },
    en: {
      name: { label: 'Product name', placeholder: 'e.g. 128 GB smartphone' },
      sku: { label: 'Code / SKU', placeholder: 'TECH-PH-128' },
      category: { label: 'Category', placeholder: 'e.g. Technology', suggestions: ['Technology', 'Phones', 'Accessories'] },
      quantity: { label: 'Units available', placeholder: 'e.g. 8' },
      variant: { label: 'Model or specification (optional)', placeholder: 'e.g. 128 GB / black' },
      serial: { label: 'IMEI or serial number (optional)', placeholder: 'e.g. IMEI 356789012345678' },
      units: ['unidad', 'caja', 'paquete'],
    },
  },
  auto_parts: {
    es: {
      name: { label: 'Nombre del producto', placeholder: 'Ej. Pastillas de freno delanteras' },
      sku: { label: 'Código / SKU', placeholder: 'REP-FRE-DEL' },
      category: { label: 'Categoría', placeholder: 'Ej. Repuestos', suggestions: ['Repuestos', 'Frenos', 'Motor', 'Suspensión'] },
      quantity: { label: 'Unidades disponibles', placeholder: 'Ej. 6' },
      variant: { label: 'Compatibilidad (opcional)', placeholder: 'Ej. Modelo / año' },
      serial: { label: 'Número de parte (opcional)', placeholder: 'Ej. ABC-1234' },
      units: ['unidad', 'caja', 'paquete'],
    },
    en: {
      name: { label: 'Product name', placeholder: 'e.g. Front brake pads' },
      sku: { label: 'Code / SKU', placeholder: 'PART-BRK-FRT' },
      category: { label: 'Category', placeholder: 'e.g. Auto parts', suggestions: ['Auto parts', 'Brakes', 'Engine', 'Suspension'] },
      quantity: { label: 'Units available', placeholder: 'e.g. 6' },
      variant: { label: 'Compatibility (optional)', placeholder: 'e.g. Model / year' },
      serial: { label: 'Part number (optional)', placeholder: 'e.g. ABC-1234' },
      units: ['unidad', 'caja', 'paquete'],
    },
  },
  food: {
    es: {
      name: { label: 'Nombre del producto', placeholder: 'Ej. Arroz blanco 500 g' },
      sku: { label: 'Código / SKU', placeholder: 'ALI-ARR-500' },
      category: { label: 'Categoría', placeholder: 'Ej. Alimentos', suggestions: ['Alimentos', 'Granos', 'Lácteos', 'Bebidas'] },
      quantity: { label: 'Cantidad disponible (kg / unidades)', placeholder: 'Ej. 25' },
      variant: { label: 'Peso o presentación (opcional)', placeholder: 'Ej. 500 g / paquete' },
      serial: null,
      units: ['kilogramo', 'gramo', 'unidad', 'paquete', 'caja', 'litro'],
    },
    en: {
      name: { label: 'Product name', placeholder: 'e.g. White rice 500 g' },
      sku: { label: 'Code / SKU', placeholder: 'FOOD-RICE-500' },
      category: { label: 'Category', placeholder: 'e.g. Food', suggestions: ['Food', 'Grains', 'Dairy', 'Beverages'] },
      quantity: { label: 'Available amount (kg / units)', placeholder: 'e.g. 25' },
      variant: { label: 'Weight or packaging (optional)', placeholder: 'e.g. 500 g / package' },
      serial: null,
      units: ['kilogramo', 'gramo', 'unidad', 'paquete', 'caja', 'litro'],
    },
  },
  liquor: {
    es: {
      name: { label: 'Nombre del producto', placeholder: 'Ej. Ron añejo 750 ml' },
      sku: { label: 'Código / SKU', placeholder: 'LIC-RON-750' },
      category: { label: 'Categoría', placeholder: 'Ej. Licores', suggestions: ['Licores', 'Vinos', 'Cervezas', 'Bebidas'] },
      quantity: { label: 'Botellas disponibles', placeholder: 'Ej. 36' },
      variant: { label: 'Volumen o presentación (opcional)', placeholder: 'Ej. 750 ml / caja de 12' },
      serial: null,
      units: ['botella', 'caja', 'litro', 'galón'],
    },
    en: {
      name: { label: 'Product name', placeholder: 'e.g. Aged rum 750 ml' },
      sku: { label: 'Code / SKU', placeholder: 'LIQ-RUM-750' },
      category: { label: 'Category', placeholder: 'e.g. Liquor', suggestions: ['Liquor', 'Wines', 'Beers', 'Beverages'] },
      quantity: { label: 'Bottles available', placeholder: 'e.g. 36' },
      variant: { label: 'Volume or packaging (optional)', placeholder: 'e.g. 750 ml / case of 12' },
      serial: null,
      units: ['botella', 'caja', 'litro', 'galón'],
    },
  },
  general: {
    es: {
      name: { label: 'Nombre del producto', placeholder: 'Ej. Organizador de escritorio' },
      sku: { label: 'Código / SKU', placeholder: 'GEN-ORG-001' },
      category: { label: 'Categoría', placeholder: 'Ej. Hogar', suggestions: ['Hogar', 'Oficina', 'Tecnología', 'Ropa', 'Bebidas'] },
      quantity: { label: 'Cantidad en stock', placeholder: 'Ej. 15' },
      variant: { label: 'Detalle adicional (opcional)', placeholder: 'Ej. Material o presentación' },
      serial: null,
      units: ['unidad', 'caja', 'paquete', 'kilogramo', 'litro'],
    },
    en: {
      name: { label: 'Product name', placeholder: 'e.g. Desk organiser' },
      sku: { label: 'Code / SKU', placeholder: 'GEN-ORG-001' },
      category: { label: 'Category', placeholder: 'e.g. Home', suggestions: ['Home', 'Office', 'Technology', 'Clothing', 'Beverages'] },
      quantity: { label: 'Stock quantity', placeholder: 'e.g. 15' },
      variant: { label: 'Additional detail (optional)', placeholder: 'e.g. Material or packaging' },
      serial: null,
      units: ['unidad', 'caja', 'paquete', 'kilogramo', 'litro'],
    },
  },
  personal: {
    es: {
      name: { label: 'Nombre del producto', placeholder: 'Ej. Audífonos inalámbricos' },
      sku: { label: 'Código / SKU', placeholder: 'PER-AUD-01' },
      category: { label: 'Categoría', placeholder: 'Ej. Hogar', suggestions: ['Hogar', 'Oficina', 'Tecnología'] },
      quantity: { label: 'Cantidad', placeholder: 'Ej. 2' },
      variant: { label: 'Detalle adicional (opcional)', placeholder: 'Ej. Modelo o color' },
      serial: null,
      units: ['unidad', 'caja', 'paquete'],
    },
    en: {
      name: { label: 'Product name', placeholder: 'e.g. Wireless earphones' },
      sku: { label: 'Code / SKU', placeholder: 'PER-EAR-01' },
      category: { label: 'Category', placeholder: 'e.g. Home', suggestions: ['Home', 'Office', 'Technology'] },
      quantity: { label: 'Quantity', placeholder: 'e.g. 2' },
      variant: { label: 'Additional detail (optional)', placeholder: 'e.g. Model or colour' },
      serial: null,
      units: ['unidad', 'caja', 'paquete'],
    },
  },
}

/**
 * Etiquetas, placeholders y opciones del formulario de producto.
 *
 * La tienda general mezcla rubros, así que solo ahí el tipo de producto
 * (deducido de la categoría) ajusta las unidades y la variante. El resto de
 * los negocios conserva el vocabulario de su propio giro.
 */
export function productFormProfile(
  businessType: BusinessType,
  language: FormLanguage,
  productKind?: ProductKind,
): ProductFormProfile {
  const base = TYPE_COPY[businessType][language]
  const refine = businessType === 'general' && Boolean(productKind)

  const labels = language === 'es'
    ? { unit: 'Unidad de venta', minStock: 'Alerta de stock bajo', minStockPlaceholder: 'Ej. 3', cost: 'Costo de compra', price: 'Precio de venta', amountPlaceholder: '0.00' }
    : { unit: 'Selling unit', minStock: 'Low stock alert', minStockPlaceholder: 'e.g. 3', cost: 'Purchase cost', price: 'Sale price', amountPlaceholder: '0.00' }

  return {
    name: { ...base.name },
    sku: { ...base.sku },
    category: { ...base.category, suggestions: [...base.category.suggestions] },
    unit: { label: labels.unit, options: refine && productKind ? unitsForProductKind(productKind) : [...base.units] },
    quantity: { ...base.quantity },
    minStock: { label: labels.minStock, placeholder: labels.minStockPlaceholder },
    cost: { label: labels.cost, placeholder: labels.amountPlaceholder },
    price: { label: labels.price, placeholder: labels.amountPlaceholder },
    variant: refine && productKind ? variantForKind(productKind, language) : { ...base.variant },
    serial: base.serial ? { ...base.serial } : null,
  }
}
