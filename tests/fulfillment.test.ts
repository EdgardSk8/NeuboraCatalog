import assert from 'node:assert/strict'
import test from 'node:test'
import { FULFILLMENT_MODES, fulfillmentNeedsLocation, isFulfillmentMode } from '../shared/fulfillment.ts'

test('accepts every supported fulfilment mode', () => {
  for (const mode of FULFILLMENT_MODES) assert.equal(isFulfillmentMode(mode), true)
  assert.deepEqual([...FULFILLMENT_MODES], ['none', 'store', 'delivery', 'pickup', 'shipping'])
})

test('rejects unknown fulfilment values', () => {
  assert.equal(isFulfillmentMode('tienda'), false)
  assert.equal(isFulfillmentMode(''), false)
  assert.equal(isFulfillmentMode(null), false)
  assert.equal(isFulfillmentMode(42), false)
})

test('only asks for the location when there is a delivery or pickup point', () => {
  assert.equal(fulfillmentNeedsLocation('none'), false)
  assert.equal(fulfillmentNeedsLocation('store'), true)
  assert.equal(fulfillmentNeedsLocation('delivery'), true)
  assert.equal(fulfillmentNeedsLocation('pickup'), true)
  assert.equal(fulfillmentNeedsLocation('shipping'), true)
})
