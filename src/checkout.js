import { products, getPackTotals } from './catalog.js'

export function getCheckoutSummary(pack) {
  const items = Object.entries(pack).map(([key, line]) => {
    const product = products.find(product => product.id === line.productId)
    if (!product || product.currency !== 'PHP') throw new RangeError('Checkout requires a known PHP product')
    if (!Number.isSafeInteger(line.quantity) || line.quantity < 1) throw new RangeError('Checkout quantities must be positive whole numbers')
    const lineTotal = product.price * line.quantity
    if (!Number.isSafeInteger(lineTotal)) throw new RangeError('Checkout amount is too large')
    return { key, productId: product.id, name: product.name, image: product.images[0], price: product.price, currency: 'PHP', quantity: line.quantity, size: line.size || '', color: line.color || '', lineTotal }
  })
  const subtotal = getPackTotals(pack).PHP || 0
  if (!Number.isSafeInteger(subtotal)) throw new RangeError('Checkout amount is too large')
  return { items, currency: 'PHP', subtotal, delivery: 0, total: subtotal }
}

export function createDemoReceipt(pack) {
  const summary = getCheckoutSummary(pack)
  if (!summary.items.length) throw new RangeError('Add gear before checking out')
  return { ...summary, id: `NH-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, createdAt: new Date().toISOString() }
}
