import assert from 'node:assert/strict'
import test from 'node:test'
import { categories, products } from './catalog.js'
import { resolveRoute } from './routes.js'

test('landing and shop routes stay separate and preserve existing deep links', () => {
  for (const hash of ['', '#top', '#forest', '#the-gear', '#summit']) assert.equal(resolveRoute(hash).page, 'landing')
  assert.deepEqual(resolveRoute('#shop'), { page: 'shop', category: 'all', anchor: null })
  assert.deepEqual(resolveRoute('#catalog'), { page: 'shop', category: 'all', anchor: 'catalog' })
  for (const category of categories) {
    for (const hash of [`#${category.id}`, `#shop/${category.id}`]) {
      assert.deepEqual(resolveRoute(hash), { page: 'shop', category: category.id, anchor: 'catalog' })
    }
  }
  for (const product of products) assert.equal(resolveRoute(`#product/${product.id}`).product, product)
  assert.equal(resolveRoute('#product/missing').page, 'shop')
  assert.equal(resolveRoute('#shop/missing').category, 'all')
  assert.equal(resolveRoute('#guarantees').page, 'shop')
  assert.equal(resolveRoute('#most-bought').page, 'shop')
  assert.equal(resolveRoute('#gear-guide').anchor, 'the-gear')
  assert.deepEqual(resolveRoute('#checkout'), { page: 'checkout' })
})
