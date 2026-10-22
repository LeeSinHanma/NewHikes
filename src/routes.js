import { categories, products } from './catalog.js'

export function resolveRoute(hash) {
  const path = hash.replace(/^#/, '')
  if (path === 'checkout') return { page: 'checkout' }
  if (path.startsWith('product/')) {
    const product = products.find(product => product.id === path.slice(8))
    return product ? { page: 'product', product } : { page: 'shop', category: 'all' }
  }
  const category = categories.find(category => path === category.id || path === `shop/${category.id}`)
  if (category) return { page: 'shop', category: category.id, anchor: 'catalog' }
  if (['shop', 'catalog', 'most-bought', 'guarantees'].includes(path) || path.startsWith('shop/')) {
    return { page: 'shop', category: 'all', anchor: path === 'shop' || path.startsWith('shop/') ? null : path }
  }
  return { page: 'landing', anchor: path === 'gear-guide' ? 'the-gear' : path || 'top' }
}
