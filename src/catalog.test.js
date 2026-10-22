/* global process */
import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import test from 'node:test'
import { categories, products, formatPrice, getPackTotals, addPackItem, freeShippingThreshold, demoBestsellerIds, sortProducts } from './catalog.js'

test('catalog has 29 unique products with valid local photos and audited PHP prices', () => {
  assert.equal(products.length, 29)
  assert.equal(new Set(products.map(product => product.id)).size, products.length)
  for (const product of products) {
    assert.ok(categories.some(category => category.id === product.category))
    assert.ok(product.price > 0)
    assert.equal(product.currency, 'PHP')
    assert.match(formatPrice(product), /^₱[\d,]+$/)
    assert.ok(product.images.length >= 2)
    for (const image of product.images) assert.ok(statSync(`${process.cwd()}/public${image}`).size > 0)
  }
  assert.equal(products.filter(product => product.category === 'apparel').length, 5)
  assert.deepEqual(Object.fromEntries(products.map(product => [product.id, product.price])), {
    'ultra-raptor': 10800, 'moab-3': 9200, renegade: 14500,
    'nh100-boot': 2290, 'mh500-boot': 3790, 'aqua-hike': 2590,
    'arpenaz-50': 190, 'arpenaz-100': 590, 'travel-100': 290,
    'mh900-pack': 4990, 'mh100-pack': 2290, 'mh500-pack': 3990,
    'alpha-jacket': 44258, 'r1-air': 12582, 'merino-resist': 2290,
    'mh100-jacket': 3390, 'mh500-trousers': 1990,
    'mt100-pole': 390, huntsman: 2950, hl100: 590,
    'mt500-pole': 1190, 'carbon-poles': 6990, 'kiprun-belt': 1590,
    'mt50-poncho': 490, 'mh100-sunglasses': 290, 'surf-hat': 790,
    'mh140-sunglasses': 1690, 'raincut-long': 1320, 'desert-500': 990,
  })
  assert.deepEqual(freeShippingThreshold, { price: 7587, currency: 'PHP' })
})

test('demo merchandising uses real products and sorting preserves catalog data', () => {
  assert.equal(new Set(demoBestsellerIds).size, demoBestsellerIds.length)
  for (const id of demoBestsellerIds) assert.ok(products.some(product => product.id === id))
  const original = [...products]
  assert.deepEqual(sortProducts(products).slice(0, demoBestsellerIds.length).map(product => product.id), demoBestsellerIds)
  for (const [order, value] of [['price-asc', product => product.price], ['price-desc', product => -product.price], ['rating', product => -(product.rating || 0)]]) {
    const sorted = sortProducts(products, order)
    assert.equal(sorted.length, 29)
    assert.equal(new Set(sorted.map(product => product.id)).size, 29)
    for (let index = 1; index < sorted.length; index++) assert.ok(value(sorted[index - 1]) <= value(sorted[index]))
  }
  const packs = sortProducts(products.filter(product => product.category === 'packs'))
  assert.equal(packs[0].id, 'mh500-pack')
  assert.deepEqual(products, original)
})

test('pack totals combine original and converted prices in PHP and respect quantities', () => {
  assert.deepEqual(getPackTotals({}), {})
  let pack = addPackItem({}, 'ultra-raptor', 2)
  pack = addPackItem(pack, 'arpenaz-50')
  pack = addPackItem(pack, 'alpha-jacket')
  pack = addPackItem(pack, 'r1-air', 2)
  assert.deepEqual(getPackTotals(pack), { PHP: 91212 })
  assert.match(formatPrice({ currency: 'PHP', price: 10800 }), /₱10,800/)
  assert.equal(formatPrice(freeShippingThreshold), '₱7,587')
})

test('pack merges matching variants and preserves distinct sizes and colors', () => {
  const original = addPackItem({}, 'ultra-raptor', 2, { color: 'Granite Basalt', size: '9.0' })
  let pack = addPackItem(original, 'ultra-raptor', 1, { size: '9.0', color: 'Granite Basalt' })
  assert.equal(Object.values(pack)[0].quantity, 3)
  assert.equal(Object.values(original)[0].quantity, 2)
  pack = addPackItem(pack, 'ultra-raptor', 1, { color: 'Granite Basalt', size: '10.5' })
  pack = addPackItem(pack, 'ultra-raptor', 1, { color: 'Lichen Earth', size: '9.0' })
  assert.equal(Object.keys(pack).length, 3)
  assert.deepEqual(getPackTotals(pack), { PHP: 54000 })
  for (const quantity of [0, -1, 1.5, 100, NaN]) assert.throws(() => addPackItem({}, 'ultra-raptor', quantity), RangeError)
  assert.throws(() => addPackItem({}, 'missing-product'), RangeError)
})

test('every static design asset and font referenced by the page exists locally', () => {
  const app = ['App.jsx', 'ProductPage.jsx', 'AlpineScene.jsx'].map(file => readFileSync(new URL(file, import.meta.url), 'utf8')).join('\n')
  const css = ['App.css', 'index.css', 'ProductPage.css', 'Immersion.css', 'Showcase.css'].map(file => readFileSync(new URL(file, import.meta.url), 'utf8')).join('\n')
  const files = [...`${app}\n${css}`.matchAll(/\/(?:design|fonts)\/[a-z0-9.-]+/g)].map(match => match[0])
  for (const [icon] of [...app.matchAll(/\['([a-z0-9]+\.svg)'/g)].map(match => [match[1]])) files.push(`/design/${icon}`)
  for (const file of new Set(files)) assert.ok(statSync(`${process.cwd()}/public${file}`).size > 0)
  assert.ok(!app.includes('figma.com/api/mcp/asset'))
})
