import assert from 'node:assert/strict'
import test from 'node:test'
import { addPackItem, getPackTotals } from './catalog.js'
import { getCheckoutSummary, createDemoReceipt } from './checkout.js'

test('checkout and receipt preserve variants, quantities, PHP totals and a stable item snapshot', () => {
  let pack = addPackItem({}, 'ultra-raptor', 2, { size: '9.0', color: 'Granite Basalt' })
  pack = addPackItem(pack, 'ultra-raptor', 1, { size: '10.5', color: 'Lichen Earth' })
  pack = addPackItem(pack, 'alpha-jacket')
  const summary = getCheckoutSummary(pack)
  assert.equal(summary.items.length, 3)
  assert.equal(summary.total, 76658)
  assert.equal(summary.total, getPackTotals(pack).PHP)
  assert.equal(summary.subtotal, summary.total)
  assert.equal(summary.delivery, 0)
  assert.equal(summary.items.reduce((sum, item) => sum + item.lineTotal, 0), summary.total)
  assert.deepEqual(summary.items.map(item => item.quantity), [2, 1, 1])
  assert.deepEqual(summary.items.slice(0, 2).map(item => item.size), ['9.0', '10.5'])
  const receipt = createDemoReceipt(pack)
  assert.deepEqual(receipt.items, summary.items)
  assert.equal(receipt.currency, 'PHP')
  assert.match(receipt.id, /^NH-[0-9A-F]{8}$/)
  assert.ok(Number.isFinite(Date.parse(receipt.createdAt)))
  Object.values(pack)[0].quantity = 10
  assert.equal(receipt.items[0].quantity, 2)
  assert.equal(receipt.total, 76658)
})

test('empty checkout is safe to display and cannot create a receipt', () => {
  assert.deepEqual(getCheckoutSummary({}), { items: [], currency: 'PHP', subtotal: 0, delivery: 0, total: 0 })
  assert.throws(() => createDemoReceipt({}), RangeError)
  for (const quantity of [0, -1, 1.5, Infinity, NaN]) {
    assert.throws(() => getCheckoutSummary({ item: { productId: 'ultra-raptor', quantity } }), RangeError)
  }
  assert.throws(() => getCheckoutSummary({ item: { productId: 'missing', quantity: 1 } }), RangeError)
  assert.throws(() => getCheckoutSummary({ item: { productId: 'ultra-raptor', quantity: Number.MAX_SAFE_INTEGER } }), RangeError)
})
