/**
 * Cómo entrega el negocio sus productos. La ubicación (país, ciudad y
 * dirección) solo se pide cuando hay un punto de entrega, retiro o local.
 */
export const FULFILLMENT_MODES = ['none', 'store', 'delivery', 'pickup', 'shipping'] as const

export type FulfillmentMode = typeof FULFILLMENT_MODES[number]

export function isFulfillmentMode(value: unknown): value is FulfillmentMode {
  return typeof value === 'string' && FULFILLMENT_MODES.some((mode) => mode === value)
}

export function fulfillmentNeedsLocation(mode: FulfillmentMode): boolean {
  return mode !== 'none'
}
