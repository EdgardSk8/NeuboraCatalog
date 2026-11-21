import assert from 'node:assert/strict'
import test from 'node:test'
import { BUSINESS_TYPES, type BusinessType } from '../shared/business-types.ts'
import { productFormProfile, unitsForProductKind } from '../shared/product-form-profile.ts'

const ALL_TYPES: BusinessType[] = ['clothing', 'hardware', 'food', 'general', 'electronics', 'auto_parts', 'liquor', 'personal']

test('every business type has its own labels, placeholders and unit choices', () => {
  for (const businessType of ALL_TYPES) {
    const profile = productFormProfile(businessType, 'es')
    assert.ok(profile.name.label.length > 0, `${businessType} needs a name label`)
    assert.ok(profile.name.placeholder.length > 0, `${businessType} needs a name placeholder`)
    assert.ok(profile.sku.placeholder.length > 0, `${businessType} needs a SKU placeholder`)
    assert.ok(profile.category.suggestions.length > 0, `${businessType} needs category suggestions`)
    assert.ok(profile.unit.options.length > 0, `${businessType} needs unit options`)
    assert.ok(profile.unit.options.includes(profile.unit.options[0]))
  }

  const namePlaceholders = new Set(ALL_TYPES.map((businessType) => productFormProfile(businessType, 'es').name.placeholder))
  assert.equal(namePlaceholders.size, ALL_TYPES.length, 'each business type suggests a different product example')

  for (const businessType of BUSINESS_TYPES) {
    assert.notEqual(productFormProfile(businessType, 'es').name.placeholder, productFormProfile(businessType, 'en').name.placeholder)
    assert.notEqual(productFormProfile(businessType, 'es').quantity.label, productFormProfile(businessType, 'en').quantity.label)
  }
})

test('tailors quantity, unit and variant wording to the business type', () => {
  const clothing = productFormProfile('clothing', 'es')
  const liquor = productFormProfile('liquor', 'es')
  const food = productFormProfile('food', 'es')

  assert.equal(clothing.quantity.label, 'Unidades disponibles')
  assert.equal(liquor.quantity.label, 'Botellas disponibles')
  assert.equal(liquor.unit.options[0], 'botella')
  assert.equal(food.unit.options[0], 'kilogramo')
  assert.match(liquor.variant.placeholder, /750 ml/u)
  assert.match(food.variant.placeholder, /500 g/u)
})

test('only shows the serial field where it makes sense', () => {
  assert.ok(productFormProfile('electronics', 'es').serial)
  assert.ok(productFormProfile('auto_parts', 'es').serial)
  assert.equal(productFormProfile('clothing', 'es').serial, null)
  assert.equal(productFormProfile('food', 'es').serial, null)
})

test('refines a general store by the product kind from the category', () => {
  const drinks = productFormProfile('general', 'es', 'beverages')
  assert.deepEqual(drinks.unit.options, unitsForProductKind('beverages'))
  assert.equal(drinks.unit.options[0], 'botella')
  assert.match(drinks.variant.label, /Volumen/u)

  const clothing = productFormProfile('general', 'es', 'clothing')
  assert.deepEqual(clothing.unit.options, unitsForProductKind('clothing'))

  const plain = productFormProfile('general', 'es', 'general')
  assert.deepEqual(plain.unit.options, ['unidad', 'caja', 'paquete', 'kilogramo', 'litro'])
})

test('keeps the specialized business wording even when the category points elsewhere', () => {
  const hardware = productFormProfile('hardware', 'es', 'beverages')
  assert.equal(hardware.quantity.label, 'Cantidad en stock')
  assert.match(hardware.variant.label, /Medida o material/u)
})
