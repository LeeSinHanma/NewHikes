import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { categories, products, formatPrice, getPackTotals, addPackItem, freeShippingThreshold, demoBestsellerIds, sortProducts } from './catalog'
import ProductPage from './ProductPage'
import LandingPage from './LandingPage'
import CheckoutPage from './CheckoutPage'
import { createDemoReceipt } from './checkout'
import { resolveRoute } from './routes'
import { resetTilt, revealOnScroll, tiltWithPointer } from './immersion'
import './App.css'
import './Showcase.css'
import './Immersion.css'
import './LandingPage.css'

const guarantees = [
  ['50e6f.svg', `Free shipping over ${formatPrice(freeShippingThreshold)}`, 'Direct dispatched from our Reno and Innsbruck gear warehouses. 2-day delivery guarantee to continental trail towns.'],
  ['9905a.svg', '30-day trail trial', 'Take your boots, shell, or backpack onto actual dirt. If fit and friction do not perform flawlessly, return hassle-free.'],
  ['6c7e3.svg', 'Guaranteed repair program', 'Ripped your pack on scree? Snapped a buckle? Send it to our Portland repair workshop for zero-cost seasonal repair.'],
]

function subscribeToHash(onChange) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

function getHash() {
  return window.location.hash
}

function ProductGallery({ product }) {
  const [image, setImage] = useState(product.images[0])
  const rank = demoBestsellerIds.indexOf(product.id)
  return (
    <>
      <a className="product-photo" aria-label={`View ${product.name}`} href={`#product/${product.id}`}>
        <img src={image} alt={product.name} loading="lazy" />
        {rank >= 0 && <span className="merch-badge"><b>0{rank + 1}</b>Bestseller</span>}
        <span className="expand-photo" aria-hidden="true"><img src="/design/78a0d.svg" alt="" /></span>
      </a>
      <div className="thumbnails" aria-label={`${product.name} photos`}>
        {product.images.map((src, index) => <button key={src} aria-label={`View ${product.name} photo ${index + 1}`} aria-pressed={image === src} onClick={() => setImage(src)}><img src={src} alt="" loading="lazy" /></button>)}
      </div>
    </>
  )
}

function ProductCard({ product, onAdd }) {
  return (
    <article className={`product-card${demoBestsellerIds.includes(product.id) ? ' is-featured' : ''}`} onPointerMove={tiltWithPointer} onPointerLeave={resetTilt}>
      <div className="product-spec"><span>{product.tag}</span><small>{product.detail}</small></div>
      <ProductGallery product={product} />
      <h3><a href={`#product/${product.id}`}>{product.name}</a></h3>
      <p className="product-description">{product.description}</p>
      <div className="product-bottom"><div>
        <strong className="price">{formatPrice(product)}</strong>
        {product.rating ? <span className="rating"><img src="/design/31a46.svg" alt="Rated" /><b>{product.rating.toFixed(1)}</b><span>({product.reviews.toLocaleString('en-PH')})</span></span> : <span className="unrated">Not yet rated</span>}
      </div><button className="button add-button" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to pack`}><img src="/design/e2654.svg" alt="" />Add to pack</button></div>
    </article>
  )
}

function MostBought({ onAdd, onBrowse }) {
  return (
    <section className="bestsellers" id="most-bought" aria-labelledby="bestsellers-title">
      <div className="container">
        <div className="bestsellers-heading">
          <div><p className="merch-eyebrow">The NewHikes shortlist / 01—03</p><h2 id="bestsellers-title">Most bought.<span>Built for the way up.</span></h2></div>
          <div className="bestsellers-intro"><p>Standout gear. A little closer.<br />Find the next essential in your loadout.</p><p className="demo-note">Curated selection · Illustrative rankings</p><a href="#shop" onClick={event => { event.preventDefault(); onBrowse() }}>Explore all gear <span aria-hidden="true">↗</span></a></div>
        </div>
        <div className="bestsellers-grid">
          {demoBestsellerIds.slice(0, 3).map((id, index) => {
            const product = products.find(product => product.id === id)
            return <article className={`bestseller-card${index === 0 ? ' bestseller-hero' : ''}`} key={id} onPointerMove={tiltWithPointer} onPointerLeave={resetTilt}>
              <div className="bestseller-topline"><span className="bestseller-label">No. 0{index + 1} <span>/ Bestseller</span></span><span>{categories.find(category => category.id === product.category).name}</span></div>
              <span className="bestseller-ghost" aria-hidden="true">0{index + 1}</span>
              <a className="bestseller-photo" href={`#product/${id}`} aria-label={`View featured ${product.name}`}><span className="product-orbit" aria-hidden="true" /><img src={product.images[0]} alt={product.name} loading="lazy" /><span className="bestseller-open" aria-hidden="true">↗</span></a>
              <div className="bestseller-copy"><p className="bestseller-detail">{product.detail}</p><h3><a href={`#product/${id}`}>{product.name}</a></h3>{index === 0 && <p className="bestseller-description">{product.description}</p>}<div className="bestseller-bottom"><div><strong>{formatPrice(product)}</strong>{product.rating && <span className="bestseller-rating">★ {product.rating.toFixed(1)} <span>({product.reviews.toLocaleString('en-PH')} reviews)</span></span>}</div><button className="button" onClick={() => onAdd(product)} aria-label={`Add featured ${product.name} to pack`}>Add to pack <span aria-hidden="true">+</span></button></div></div>
            </article>
          })}
        </div>
        <div className="bestsellers-footnote"><span>Considered gear. Uncompromising adventures.</span><span>Explore / Equip / Ascend <span aria-hidden="true">↗</span></span></div>
      </div>
    </section>
  )
}

export default function App() {
  const hash = useSyncExternalStore(subscribeToHash, getHash)
  const { page, product: activeProduct, category = 'all', anchor } = resolveRoute(hash)
  const isLanding = page === 'landing'
  const isCheckout = page === 'checkout'
  const [expanded, setExpanded] = useState([])
  const [sort, setSort] = useState('featured')
  const [pack, setPack] = useState({})
  const [receipt, setReceipt] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [panel, setPanel] = useState(null)
  const [announcement, setAnnouncement] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const dialog = useRef(null)
  const noticeTimer = useRef(null)
  const itemCount = Object.values(pack).reduce((sum, line) => sum + line.quantity, 0)

  useEffect(() => revealOnScroll(), [hash, category, expanded, sort])

  useEffect(() => {
    document.title = activeProduct ? `${activeProduct.name} — NewHikes` : isLanding ? 'NewHikes — Outside is Calling' : isCheckout ? 'Checkout — NewHikes' : 'Shop Outdoor Gear — NewHikes'
    if (activeProduct) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.getElementById('product-title')?.focus({ preventScroll: true })
    } else if (anchor && anchor !== 'top') {
      document.getElementById(anchor)?.scrollIntoView({ behavior: isLanding && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant' })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
      if (isCheckout) document.getElementById('checkout-title')?.focus({ preventScroll: true })
    }
  }, [activeProduct, hash, anchor, isLanding, isCheckout])

  function startCheckout() {
    if (!itemCount) return
    setReceipt(null)
    setAnnouncement('')
    clearTimeout(noticeTimer.current)
    setMobileMenu(false)
    dialog.current.close()
    window.location.assign('#checkout')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function placeDemoOrder() {
    if (!Object.keys(pack).length) return
    setReceipt(createDemoReceipt(pack))
    setPack({})
  }

  function addToPack(product, quantity = 1, selection = {}) {
    setPack(current => addPackItem(current, product.id, quantity, selection))
    clearTimeout(noticeTimer.current)
    setAnnouncement(`${quantity > 1 ? `${quantity} × ` : ''}${product.name} added to your pack`)
    noticeTimer.current = setTimeout(() => setAnnouncement(''), 4000)
  }

  function openPanel(nextPanel) {
    setPanel(nextPanel)
    dialog.current.showModal()
  }

  function navigateToCategory(id) {
    setMobileMenu(false)
    const nextHash = id === 'all' ? '#shop' : `#shop/${id}`
    if (window.location.hash === nextHash) document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
    else window.location.assign(nextHash)
  }

  function toggleFavorite(product) {
    setFavorites(current => current.includes(product.id) ? current.filter(id => id !== product.id) : [...current, product.id])
  }

  function changeQuantity(id, amount) {
    setPack(current => {
      const next = { ...current, [id]: { ...current[id], quantity: Math.max(0, current[id].quantity + amount) } }
      if (next[id].quantity === 0) delete next[id]
      return next
    })
  }

  return (
    <>
      <a className="skip-link" href={activeProduct ? '#product-title' : isCheckout ? '#checkout-title' : isLanding ? '#forest' : '#catalog'} onClick={event => { if (activeProduct || isCheckout) { event.preventDefault(); document.getElementById(activeProduct ? 'product-title' : 'checkout-title').focus() } }}>{isLanding ? 'Skip to the journey' : isCheckout ? 'Skip to checkout' : 'Skip to products'}</a>
      <header className={`site-header${isLanding ? ' experience-header' : ''}`} id="top">
        {!isLanding && !activeProduct && !isCheckout && <div className="shipping-banner">Free Worldwide Expedited Shipping on Orders Over {formatPrice(freeShippingThreshold)} <span>• Lifetime Alpine Guarantee</span></div>}
        <div className="header-inner container">
          <a className="brand" href="#top" aria-label="NewHikes home" onClick={() => setMobileMenu(false)}><img src="/design/bed9e.png" alt="NewHikes" width="120" height="32" /></a>
          <div className="header-actions">
            <button className="menu-button" aria-expanded={mobileMenu} aria-controls="main-nav" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? 'Close' : 'Menu'}</button>
            <nav id="main-nav" className={mobileMenu ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
              {isLanding ? <>{[['#forest', 'The journey'], ['#the-gear', 'The gear'], ['#summit', 'The summit']].map(([href, label]) => <a key={href} href={href} onClick={() => setMobileMenu(false)}>{label}</a>)}</> : <>{categories.map(item => <a key={item.id} href={`#shop/${item.id}`} onClick={event => { event.preventDefault(); navigateToCategory(item.id) }}>{item.name}</a>)}<a href="#top" onClick={() => setMobileMenu(false)}>The experience ↗</a></>}
            </nav>
            {isLanding ? <a className="experience-shop-link" href="#shop" onClick={() => setMobileMenu(false)}>Shop <span aria-hidden="true">↗</span></a> : <><button className="header-icon" aria-label={`Saved gear, ${favorites.length} items`} onClick={() => openPanel({ type: 'favorites' })}><img src="/design/c1c46.svg" alt="" /><span>{favorites.length}</span></button>
            <button className="header-icon pack-icon" aria-label={`Your pack, ${itemCount} items`} onClick={() => openPanel({ type: 'pack' })}><img src="/design/bfe8a.svg" alt="" /><span>{itemCount}</span></button></>}
          </div>
        </div>
      </header>

      {isLanding ? <LandingPage /> : isCheckout ? <CheckoutPage pack={pack} receipt={receipt} onPlaceOrder={placeDemoOrder} /> : activeProduct ? <ProductPage key={activeProduct.id} product={activeProduct} isFavorite={favorites.includes(activeProduct.id)} onFavorite={toggleFavorite} onAdd={addToPack} /> : <>
      <main className="shop-page">
        <section className="shop-intro container" aria-labelledby="shop-title"><div><p className="merch-eyebrow">NewHikes / The outfitter</p><h1 id="shop-title">Make the outside yours.</h1><p>Everything you need for the next chapter. Find your gear, build your pack, and get ready to head out.</p></div><a href="#top">Return to the experience <span aria-hidden="true">↗</span></a></section>

        <section id="catalog" className="catalog" aria-labelledby="catalog-heading">
          <div className="catalog-nav"><div className="container"><p className="merch-eyebrow catalog-eyebrow">The complete loadout</p><h2 id="catalog-heading">Explore Our Products</h2><div className="category-tabs" role="group" aria-label="Filter products by category">
            <button aria-pressed={category === 'all'} onClick={() => navigateToCategory('all')}>All gear ({products.length})</button>
            {categories.map(item => <button key={item.id} aria-pressed={category === item.id} onClick={() => navigateToCategory(item.id)}>{item.name} ({products.filter(product => product.category === item.id).length})</button>)}
          </div><div className="catalog-toolbar"><div><p>{products.filter(product => category === 'all' || product.category === category).length} essentials · {category === 'all' ? 'Every kind of adventure' : categories.find(item => item.id === category).name}</p><span>Rankings reflect a curated selection.</span></div><div className="catalog-sort"><label htmlFor="catalog-sort">Sort gear</label><select id="catalog-sort" value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Featured first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Top rated</option></select></div></div></div></div>
          <div className="container catalog-sections">
            {categories.filter(item => category === 'all' || category === item.id).map(item => {
              const categoryProducts = sortProducts(products.filter(product => product.category === item.id), sort)
              const isExpanded = expanded.includes(item.id)
              return <section className="category-section" id={item.id} key={item.id} aria-labelledby={`${item.id}-heading`}>
                <div className="section-heading"><span className="category-number" aria-hidden="true">0{categories.indexOf(item) + 1}</span><div><p>// {item.name}</p><h2 id={`${item.id}-heading`}>{item.title}</h2></div><span className="category-count">{categoryProducts.length} items</span></div>
                <div className="product-grid">{(isExpanded ? categoryProducts : categoryProducts.slice(0, 3)).map(product => <ProductCard key={product.id} product={product} onAdd={addToPack} />)}</div>
                <button className={`explore-more${isExpanded ? ' expanded' : ''}`} aria-expanded={isExpanded} onClick={() => setExpanded(current => isExpanded ? current.filter(id => id !== item.id) : [...current, item.id])}>{isExpanded ? 'Show less' : 'Explore more'}<img src="/design/dd243.svg" alt="" /></button>
              </section>
            })}
          </div>
        </section>

        <MostBought onAdd={addToPack} onBrowse={() => navigateToCategory('all')} />

        <section className="guarantees" id="guarantees" aria-label="NewHikes guarantees"><div className="container guarantees-grid">{guarantees.map(([icon, title, text]) => <div className="guarantee" key={title}><span className="stat-icon"><img src={`/design/${icon}`} alt="" /></span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>
        <div className="footer-spacer" />
      </main>

      <footer className="site-footer"><div className="container">
        <div className="footer-grid">
          <div className="footer-brand"><a href="#top"><img src="/design/bed9e.png" alt="NewHikes home" width="120" height="32" /></a><p>Engineering zero-compromise gear designed for severe high-altitude terrain. 100% field tested across continental divide routes.</p></div>
          <div className="customer-care"><h2>Customer expedition care</h2><a href="#guarantees">Shipping &amp; Dispatch</a><a href="#guarantees">Alpine Returns &amp; Trials</a><a href="#the-gear">Technical Fit Guides</a><button onClick={() => openPanel({ type: 'info', title: 'Field Support Desk', text: 'Field support contact details are coming soon.' })}>Field Support Desk</button></div>
          <div className="dispatch"><h2>Dispatch reports</h2><p>Receive ultra-technical route alerts, seasonal product releases, and high-altitude research papers.</p>
            <form onSubmit={event => { event.preventDefault(); setNewsletterMessage('Dispatch sign-up is coming soon. Your email has not been submitted.') }}><label className="sr-only" htmlFor="dispatch-email">Email address</label><input id="dispatch-email" name="email" type="email" placeholder="summit@explorer.com" autoComplete="email" required /><button type="submit">Join</button></form><p className="newsletter-message" role="status">{newsletterMessage}</p>
          </div>
        </div>
        <div className="footer-bottom"><p>© 2026 NewHikes High-Altitude Equipment Inc. All technical specifications certified.</p><div>{['Privacy Policy', 'Terms of Service'].map(title => <button key={title} onClick={() => openPanel({ type: 'info', title, text: 'This storefront is a local preview. Orders, payments, and newsletter submissions are not processed here.' })}>{title}</button>)}<a href="#catalog">Accessibility</a></div></div>
      </div></footer>
      </>}

      {!isCheckout && <div className={`toast${announcement ? ' visible' : ''}`} role="status" aria-live="polite">{announcement}</div>}
      <dialog ref={dialog} className="gear-dialog" aria-labelledby="dialog-title" onClose={() => setPanel(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current.close() }}>
        <div className="dialog-header"><h2 id="dialog-title">{panel?.type === 'pack' ? 'Your expedition pack' : panel?.type === 'favorites' ? 'Your saved gear' : panel?.title}</h2><button className="close-dialog" aria-label="Close dialog" onClick={() => dialog.current.close()} autoFocus>×</button></div>
        {panel?.type === 'pack' && <div className="pack-content">
          {itemCount === 0 ? <p className="empty-state">Your next adventure starts here. Add some gear to your pack.</p> : <>
            {Object.entries(pack).map(([key, line]) => {
              const product = products.find(product => product.id === line.productId)
              return <div className="pack-row" key={key}><img src={product.images[0]} alt={product.name} /><div><h3>{product.name}</h3>{(line.size || line.color) && <p className="pack-selection">{[line.color, line.size && `Size ${line.size}`].filter(Boolean).join(' · ')}</p>}<p>{formatPrice(product)}</p><div className="quantity-controls"><button aria-label={`Decrease ${product.name} quantity`} onClick={() => changeQuantity(key, -1)}>−</button><span aria-label="Quantity">{line.quantity}</span><button aria-label={`Increase ${product.name} quantity`} onClick={() => changeQuantity(key, 1)}>+</button></div></div><button className="remove-button" aria-label={`Remove ${product.name} from pack`} onClick={() => setPack(current => { const next = { ...current }; delete next[key]; return next })}>Remove</button></div>
            })}
            <div className="pack-total"><h3>Pack total</h3><div>{Object.entries(getPackTotals(pack)).map(([currency, price]) => <strong key={currency}>{formatPrice({ currency, price })} <small>{currency}</small></strong>)}</div></div><button className="checkout-primary pack-checkout" type="button" onClick={startCheckout}>Continue to checkout <span aria-hidden="true">↗</span></button><p className="pack-note">No payment or personal details required.</p>
          </>}<button className="button" onClick={() => dialog.current.close()}>Continue exploring</button>
        </div>}
        {panel?.type === 'favorites' && <div className="saved-content">{favorites.length === 0 ? <p className="empty-state">Keep your next adventure in view. Open a product and save it to your wishlist to start your list.</p> : products.filter(product => favorites.includes(product.id)).map(product => <div className="pack-row" key={product.id}><img src={product.images[0]} alt={product.name} /><div><h3><a href={`#product/${product.id}`} onClick={() => dialog.current.close()}>{product.name}</a></h3><p>{formatPrice(product)}</p><button className="text-button" onClick={() => addToPack(product)}>Add to pack</button></div><button className="remove-button" onClick={() => toggleFavorite(product)} aria-label={`Remove ${product.name} from saved gear`}>Remove</button></div>)}</div>}
        {panel?.type === 'info' && <p className="info-content">{panel.text}</p>}
      </dialog>
    </>
  )
}
