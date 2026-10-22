import { useRef, useState } from 'react'
import { categories, products, formatPrice } from './catalog'
import { resetTilt, tiltWithPointer } from './immersion'
import './ProductPage.css'

const colors = [
  { name: 'Alpine Spruce / Rust', base: '#274836', accent: '#cb4914' },
  { name: 'Granite Basalt', base: '#2a2c2b', accent: '#d0a331' },
  { name: 'Lichen Earth', base: '#403c34', accent: '#649cb3' },
]
const shoeSizes = ['8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0', '11.5', '12.0', '13.0']
const tabs = ['Product Details', 'Technical Specs', 'Shipping & Returns']
const sampleReviews = [
  ['Exceptional Lateral Rigidity', 'Zero hotspots across 4 days in the Wind River Range. Outstanding tension control between instep and collar.', 'SARAH M. · IFMGA GUIDE'],
  ['Arctic Grip is Genuine', 'The wet granite traction is outstanding. Scree rand took brutal abuse over sharp limestone without separation.', 'MARKUS K. · ALASKA RIDGE'],
  ['Confidence on Steep Descents', 'A stabilizing heel counter and sticky rubber outsole help maintain control on technical mountain trails.', 'ULTRA RAPTOR II · PRODUCT NOTES'],
]

export default function ProductPage({ product, isFavorite, onFavorite, onAdd }) {
  const isRaptor = product.id === 'ultra-raptor'
  const [image, setImage] = useState(product.images[0])
  const [color, setColor] = useState(colors[0].name)
  const [size, setSize] = useState(product.category === 'footwear' ? '10.5' : product.category === 'apparel' ? 'M' : '')
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState(tabs[0])
  const [sizeGuide, setSizeGuide] = useState(false)
  const tabButtons = useRef([])
  const carousel = useRef(null)
  const category = categories.find(category => category.id === product.category)
  const sizes = product.category === 'footwear' ? shoeSizes : product.category === 'apparel' ? ['XS', 'S', 'M', 'L', 'XL', 'XXL'] : []
  const views = isRaptor ? [product.images[0], product.images[2], product.images[1]] : product.images
  const photoLabels = isRaptor ? ['Lateral', 'Outsole / Tread', 'Upper / Laces'] : views.map((_, index) => `View ${index + 1}`)
  const specs = isRaptor ? [
    ['Weight', '400g (Single, US 9.0)'],
    ['Membrane', 'GORE-TEX Extended Comfort'],
    ['Outsole', 'FriXion® White + Impact Brake System™'],
    ['Upper', 'High-Abrasion AirMesh & Microfiber'],
  ] : [['Category', category.name], ['Construction', product.tag], ['Details', product.detail], ['Price', formatPrice(product)]]
  const related = ['mt500-pole', 'merino-resist', 'mt50-poncho', 'carbon-poles', 'arpenaz-50', 'hl100'].filter(id => id !== product.id).map(id => products.find(product => product.id === id))

  function switchTab(event, index) {
    let next
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return
    event.preventDefault()
    setTab(tabs[next])
    tabButtons.current[next].focus()
  }

  return (
    <main className="product-page">
      <section className="pdp-main container" aria-labelledby="product-title">
        <div className="pdp-main-grid">
          <div className="pdp-gallery">
            <div className="pdp-photo" onPointerMove={tiltWithPointer} onPointerLeave={resetTilt}><img key={image} src={image} alt={product.name} /><span className="pdp-photo-caption">Photo study <span>0{views.indexOf(image) + 1} / 0{views.length}</span></span><button className="pdp-favorite" aria-label={isFavorite ? 'Remove from saved gear' : 'Save to wishlist'} aria-pressed={isFavorite} onClick={() => onFavorite(product)}><img src="/design/7dc18.svg" alt="" /></button></div>
            <div className="pdp-thumbnails" aria-label="Product photos">{views.map((src, index) => <button key={src} aria-label={`Show ${photoLabels[index]} photo`} aria-pressed={image === src} onClick={() => setImage(src)}><img src={src} alt="" /><span>{photoLabels[index]}</span></button>)}</div>
          </div>
          <div className="pdp-order">
            <div className="pdp-product-heading"><p className="pdp-eyebrow">{isRaptor ? 'Mountain running / hiking series' : `${category.name} / expedition series`}</p><h1 id="product-title" tabIndex={-1}>{product.name}</h1>
              {product.rating ? <div className="pdp-rating"><span className="pdp-stars" aria-hidden="true">{[0, 1, 2, 3, 4].map(index => <img src={index < Math.floor(product.rating) ? '/design/a1368.svg' : '/design/13ec1.svg'} alt="" key={index} />)}</span><strong>{product.rating.toFixed(1)}</strong><span>·</span><button onClick={() => document.getElementById('product-reviews').scrollIntoView({ behavior: 'smooth' })}>{product.reviews.toLocaleString('en-PH')} Reviews</button></div> : <p className="pdp-rating">Not yet rated</p>}
            </div>
            <div className="pdp-price"><strong>{formatPrice(product)}</strong><span>{product.currency}</span></div>
            <p className="pdp-intro">{isRaptor ? 'Engineered for technical off-road trails and endurance mountain routes. Features breathable air-mesh upper with microfiber reinforcements, waterproof GORE-TEX Extended Comfort membrane, and ultra-grippy FriXion® White rubber with Impact Brake System™.' : product.description}</p>
            {isRaptor ? <fieldset className="pdp-choice"><legend>Color: <strong>{color}</strong></legend><div className="pdp-colors">{colors.map(item => <button key={item.name} type="button" style={{ background: item.base, '--swatch-accent': item.accent }} aria-label={item.name} aria-pressed={color === item.name} onClick={() => setColor(item.name)}><span /></button>)}</div></fieldset> : <div className="pdp-choice"><p className="pdp-choice-label">Details <strong>{product.detail}</strong></p><span className="pdp-tag">{product.tag}</span></div>}
            {sizes.length > 0 && <fieldset className="pdp-choice"><legend>{product.category === 'footwear' ? 'US men’s sizing' : 'Select size'}<button className="pdp-guide-link" type="button" aria-expanded={sizeGuide} onClick={() => setSizeGuide(!sizeGuide)}>Size guide</button></legend><div className="pdp-sizes">{sizes.map(value => <button key={value} type="button" disabled={isRaptor && value === '12.0'} aria-label={`Size ${value}`} aria-pressed={size === value} onClick={() => setSize(value)}>{value}</button>)}</div>{sizeGuide && <p className="pdp-size-help">{product.category === 'footwear' ? 'Sizes shown use the US men’s system. Compare your current hiking shoe size and allow room for hiking socks. Confirm manufacturer measurements before ordering.' : 'Choose your usual layering size and confirm the manufacturer’s measurements before ordering.'} Size availability is a preview.</p>}</fieldset>}
            <div className="pdp-buy-row"><div className="pdp-quantity"><button type="button" aria-label="Decrease product quantity" disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)}><img src="/design/740ba.svg" alt="" /></button><output aria-live="polite" aria-label="Product quantity">{quantity}</output><button type="button" aria-label="Increase product quantity" disabled={quantity === 99} onClick={() => setQuantity(quantity + 1)}><img src="/design/e809b.svg" alt="" /></button></div><button className="pdp-add" onClick={() => onAdd(product, quantity, { size, color: isRaptor ? color : '' })}><img src="/design/d9dcc.svg" alt="" />Add to cart · {formatPrice({ ...product, price: product.price * quantity })}</button></div>
            <div className="pdp-assurances">{[['86207.svg', 'Free Express Shipping'], ['976dd.svg', 'Free 30-Day Returns'], ['9ae87.svg', 'Lifetime Guarantee']].map(([icon, text]) => <span key={icon}><img src={`/design/${icon}`} alt="" />{text}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="pdp-deep-dive">
        <div className="container">
          <div className="pdp-tabs" role="tablist" aria-label="Product information">{tabs.map((name, index) => <button key={name} ref={element => { tabButtons.current[index] = element }} id={`pdp-tab-${index}`} role="tab" aria-selected={tab === name} aria-controls="pdp-tab-content" tabIndex={tab === name ? 0 : -1} onClick={() => setTab(name)} onKeyDown={event => switchTab(event, index)}>{name}</button>)}</div>
          <div className="pdp-info-grid" id="pdp-tab-content" role="tabpanel" aria-labelledby={`pdp-tab-${tabs.indexOf(tab)}`} tabIndex={0}>
            <div className="pdp-info-card">
              {tab === tabs[0] ? <><h2>{isRaptor ? 'Built for High-Mileage Mountain Running & Rugged Technical Trails' : `Built for the Trail: ${product.name}`}</h2><p>{isRaptor ? 'The La Sportiva Ultra Raptor II GTX is engineered for long-distance mountain trails, fastpacking, and technical off-trail terrain. Featuring high-frequency lacing harness tensioning, an integrated TPU heel stabilizer, and full-length rock protection, it balances plush endurance cushioning with precise alpine foot control.' : product.description}</p><div className="pdp-feature-grid">{(isRaptor ? [['GORE-TEX EXTENDED COMFORT', 'Waterproof, breathable membrane designed for intense aerobic mountain output.'], ['FRIXION® WHITE + TRAIL BITE', 'Super-sticky compound with Impact Brake System and pronounced heel brake lugs.']] : [[product.tag, product.description], [category.name.toUpperCase(), product.detail]]).map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div></> : tab === tabs[1] ? <><h2>Technical Specifications</h2><p>{product.description}</p><dl className="pdp-expanded-specs">{specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></> : <><h2>Shipping & Returns</h2><p>Free express shipping, a 30-day return period, and lifetime care are featured in the NewHikes design.</p><div className="pdp-feature-grid"><div><h3>Delivery</h3><p>Shipping destinations and dispatch estimates will be confirmed when online ordering opens.</p></div><div><h3>30-Day Trail Trial</h3><p>Return eligibility and repair terms will be available before checkout.</p></div></div></>}
            </div>
            <aside className="pdp-specs-card" aria-labelledby="pdp-specs-title"><h2 id="pdp-specs-title">Specifications</h2><dl>{specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></aside>
          </div>
          <section className="pdp-reviews" id="product-reviews" aria-labelledby="reviews-title"><div className="pdp-reviews-heading"><h2 id="reviews-title">Field Reviews</h2><p>{isRaptor ? 'Design sample content' : product.rating ? `${product.reviews.toLocaleString('en-PH')} catalog reviews` : 'Trail logs coming soon'}</p></div>
            <div className="pdp-review-grid">{(isRaptor ? sampleReviews : [['Your Next Trail Log', 'Detailed customer trail logs will appear here when reviews are connected.', 'COMMUNITY FIELD NOTES'], ['Made for the Outdoors', product.description, `${category.name.toUpperCase()} · PRODUCT NOTES`], ['Share Your Experience', 'Take your gear out on the trail and tell us how it performs when review submissions open.', 'NEW HIKES · FIELD COMMUNITY']]).map(([title, text, author]) => <article className="pdp-review" key={title}>{isRaptor && <span className="pdp-review-stars" aria-label="Illustrative five-star rating">{[0, 1, 2, 3, 4].map(index => <img src="/design/7a54a.svg" alt="" key={index} />)}</span>}<h3>{title}</h3><p>{text}</p><footer>{author}</footer></article>)}</div>
          </section>
        </div>
      </section>

      <section className="pdp-related container" aria-labelledby="related-title"><div className="pdp-related-heading"><div><p className="pdp-eyebrow">Coordinated loadout</p><h2 id="related-title">Complete Your Alpine Kit</h2></div><div className="pdp-carousel-controls"><button aria-label="Previous gear" onClick={() => carousel.current.scrollBy({ left: -carousel.current.clientWidth, behavior: 'smooth' })}><img src="/design/0ad21.svg" alt="" /></button><button aria-label="Next gear" onClick={() => carousel.current.scrollBy({ left: carousel.current.clientWidth, behavior: 'smooth' })}><img src="/design/25d9e.svg" alt="" /></button></div></div>
        <div className="pdp-related-grid" ref={carousel}>{related.map(item => <article className="pdp-related-card" key={item.id}><a href={`#product/${item.id}`} className="pdp-related-photo"><img src={item.images[0]} alt={item.name} loading="lazy" /><span>{item.tag}</span></a><p className="pdp-related-category">{categories.find(category => category.id === item.category).name}</p><h3><a href={`#product/${item.id}`}>{item.name}</a></h3><p className="pdp-related-description">{item.description}</p><div className="pdp-related-bottom"><strong>{formatPrice(item)}</strong><button aria-label={`Add ${item.name} to pack`} onClick={() => onAdd(item)}><img src="/design/7b679.svg" alt="" />Add</button></div></article>)}</div>
      </section>
    </main>
  )
}
