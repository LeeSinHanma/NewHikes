import { useLayoutEffect, useRef, useState } from 'react'
import { formatPrice } from './catalog'
import { getCheckoutSummary } from './checkout'
import './CheckoutPage.css'

function DeliveryScene({ items, ordered }) {
  const scene = useRef(null)
  const truck = useRef(null)
  const cargo = useRef(null)
  const cancel = useRef(() => {})
  const [phase, setPhase] = useState(() => !ordered ? 'ready' : window.matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate ? 'dispatched' : 'packing')

  function skip() {
    cancel.current()
    setPhase('dispatched')
  }

  useLayoutEffect(() => {
    if (!ordered || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate) return
    let active = true
    const animations = []
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const target = cargo.current.getBoundingClientRect()
    const parcels = [...scene.current.querySelectorAll('.delivery-parcel')]
    for (const [index, parcel] of parcels.entries()) {
      const origin = parcel.getBoundingClientRect()
      const x = target.x + target.width / 2 - origin.x - origin.width / 2
      const y = target.y + target.height / 2 - origin.y - origin.height / 2
      animations.push(parcel.animate([
        { opacity: 0, transform: 'translate3d(0, 12px, 0) scale(.7)', easing: 'ease-out' },
        { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)', offset: 0.18, easing: 'ease-in-out' },
        { opacity: 1, transform: `translate3d(${x * 0.4}px, ${y - 32}px, 0) rotate(-8deg) scale(.8)`, offset: 0.72, easing: 'ease-in' },
        { opacity: 0, transform: `translate3d(${x}px, ${y}px, 0) rotate(5deg) scale(.12)` },
      ], { duration: 1300, delay: parcels.length > 1 ? index * 1600 / (parcels.length - 1) : 0, easing: 'linear', fill: 'both' }))
    }
    cancel.current = () => { active = false; for (const animation of animations) animation.cancel() }
    const onMotion = () => { if (media.matches) { cancel.current(); setPhase('dispatched') } }
    const initialWidth = scene.current.clientWidth
    const onResize = () => { if (scene.current.clientWidth !== initialWidth) { cancel.current(); setPhase('dispatched') } }
    media.addEventListener('change', onMotion)
    window.addEventListener('resize', onResize)
    Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (!active) return
      setPhase('departing')
      const departure = truck.current.animate([
        { transform: 'translate3d(0, 0, 0)', easing: 'ease-out' },
        { transform: 'translate3d(-8px, 0, 0)', offset: 0.12, easing: 'cubic-bezier(.4,0,.7,1)' },
        { transform: `translate3d(${scene.current.clientWidth + 300}px, 0, 0)` },
      ], { duration: 1600, easing: 'linear', fill: 'forwards' })
      animations.push(departure)
      return departure.finished
    }).then(() => { if (active) setPhase('dispatched') }).catch(() => {
      if (active) { for (const animation of animations) animation.cancel(); setPhase('dispatched') }
    })
    return () => { cancel.current(); media.removeEventListener('change', onMotion); window.removeEventListener('resize', onResize) }
  }, [ordered, items])

  const complete = phase === 'dispatched'
  return <section className="delivery-card" aria-label="Delivery animation">
    <div className="delivery-card-heading"><span className="checkout-eyebrow">The scenic route / NewHikes dispatch</span></div>
    <div ref={scene} className="delivery-scene" data-phase={phase} aria-hidden="true">
      <svg className="delivery-mountains" viewBox="0 0 600 240" preserveAspectRatio="none"><path fill="#294937" d="M0 210 110 58 188 161 300 25 440 185 518 95 600 201V240H0Z" /><path fill="#365740" d="m0 224 130-89 103 70 120-95 116 114 78-54 53 54v16H0Z" /><path d="M10 222c120-50 160 22 270-13s142-55 310-10" fill="none" stroke="#b69a6b" strokeWidth="1.5" opacity=".4" /></svg>
      {(ordered ? items : items.slice(0, 5)).map((item, index) => <img key={item.key} className="delivery-parcel" src={item.image} alt="" style={{ left: `${8 + index % 5 * 16}%`, top: `${24 + Math.floor(index % 10 / 5) * 48}px` }} />)}
      <div className="delivery-road"><span /></div>
      <div ref={truck} className="delivery-truck"><span ref={cargo} className="truck-cargo-target" />
        <svg className="truck-body" viewBox="0 0 280 148" role="presentation">
          <ellipse cx="139" cy="137" rx="120" ry="6" fill="#081e15" opacity=".3" />
          <path d="M18 31q0-9 9-9h145v96H18Z" fill="#e9dec3" /><path d="M24 29h141v77H24Z" fill="#244734" /><path d="M172 61h46l33 35v29h-79Z" fill="#c17742" /><path d="M181 69h32l23 26h-55Z" fill="#c2d3c2" /><path d="M180 72h12v20h-12Z" fill="#94ada1" /><path d="M205 105h13" stroke="#774322" strokeWidth="3" strokeLinecap="round" /><path d="M14 116h243v13H14Z" fill="#142e23" /><path d="M249 106h7v13h-7Z" fill="#f4d99d" />
          <path d="m62 71 16-24 9 12 6-8 19 24H59" fill="none" stroke="#d5c39c" strokeWidth="2" /><text x="94" y="92" textAnchor="middle" fill="#ede6d3" fontFamily="sans-serif" fontSize="11" letterSpacing="2">NEWHIKES</text>
          {[61, 220].map(x => <g className="truck-wheel" key={x}><circle cx={x} cy="126" r="17" fill="#12271e" /><circle cx={x} cy="126" r="10" fill="#b7b99e" /><circle cx={x} cy="126" r="4" fill="#244734" /><path d={`M${x} 117v18m-9-9h18`} stroke="#244734" strokeWidth="2" /></g>)}
        </svg>
      </div>
      <div className="delivery-arrived-mark">↗</div>
    </div>
    <div className="delivery-status" role="status" aria-live="polite" aria-atomic="true"><span className="delivery-status-number">{!ordered ? '01' : phase === 'packing' ? '02' : '03'}</span><div><h2>{complete ? 'Off to the next adventure.' : phase === 'departing' ? 'Taking the scenic route.' : ordered ? 'Packing your possibilities.' : 'Your gear has places to go.'}</h2><p>{complete ? 'Dispatch animation complete. No real shipment was created.' : phase === 'departing' ? 'Your gear is heading out.' : ordered ? 'Loading each piece of your gear into the truck.' : 'Place your order to watch your gear head out.'}</p></div></div>
    <div className="delivery-steps" aria-hidden="true"><span className={ordered ? 'is-done' : 'is-current'}>01 Review</span><i /><span className={phase === 'packing' ? 'is-current' : ordered ? 'is-done' : ''}>02 Pack</span><i /><span className={complete ? 'is-done' : phase === 'departing' ? 'is-current' : ''}>03 Head out</span></div>
    {ordered && !complete && <button className="skip-delivery" type="button" onClick={skip}>Skip animation →</button>}
  </section>
}

export default function CheckoutPage({ pack, receipt, onPlaceOrder }) {
  const summary = receipt || getCheckoutSummary(pack)
  const count = summary.items.reduce((total, item) => total + item.quantity, 0)
  if (!summary.items.length) return <main className="checkout-page checkout-empty container"><p className="checkout-eyebrow">NewHikes / Checkout</p><h1 id="checkout-title" tabIndex={-1}>Your adventure starts with a little gear.</h1><p>Your pack is empty. Find something for your next way out.</p><a className="checkout-primary" href="#shop">Explore the shop <span aria-hidden="true">↗</span></a></main>

  function placeOrder() {
    onPlaceOrder()
    window.scrollTo({ top: 0, behavior: 'instant' })
    window.requestAnimationFrame(() => document.getElementById('checkout-title')?.focus({ preventScroll: true }))
  }

  return <main className={`checkout-page container${receipt ? ' is-confirmed' : ''}`}>
    <a className="checkout-back" href="#shop">← Back to the outfitter</a>
    <div className="checkout-heading"><div><p className="checkout-eyebrow">NewHikes / {receipt ? 'Your receipt' : 'The final trail check'}</p><h1 id="checkout-title" tabIndex={-1}>{receipt ? <>Packed for<br /><em>possibility.</em></> : <>Your next adventure,<br /><em>all packed.</em></>}</h1></div><p>{receipt ? 'A little gear. A lot to look forward to.' : 'One last look at your next great escape.'}<span>No payment or personal details required.</span></p></div>
    <div className="checkout-layout">
      <section className="receipt-card" aria-labelledby="receipt-title"><div className="receipt-card-top"><img src="/design/bed9e.png" alt="NewHikes" width="120" height="32" /><span className="receipt-stamp">{receipt ? 'Receipt' : 'Your loadout'}</span></div><div className="receipt-heading"><h2 id="receipt-title">{receipt ? 'A record of your next chapter.' : 'Ready for the way out.'}</h2><p>{receipt ? receipt.id : `${count} ${count === 1 ? 'item' : 'items'} in your expedition pack`}</p>{receipt && <time dateTime={receipt.createdAt}>{new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(receipt.createdAt))}</time>}</div>
        <ol className="receipt-items">{summary.items.map(item => <li className="receipt-item" key={item.key}><div className="receipt-item-photo"><img src={item.image} alt={item.name} /></div><div className="receipt-item-copy"><h3>{item.name}</h3>{(item.size || item.color) && <p>{[item.color, item.size && `Size ${item.size}`].filter(Boolean).join(' · ')}</p>}<span>Qty {item.quantity} × {formatPrice(item)}</span></div><strong className="receipt-line-total">{formatPrice({ ...item, price: item.lineTotal })}</strong></li>)}</ol>
        <dl className="receipt-totals"><div><dt>Gear subtotal</dt><dd>{formatPrice({ ...summary, price: summary.subtotal })}</dd></div><div><dt>Delivery</dt><dd>Included</dd></div><div className="receipt-grand-total"><dt>Total <span>PHP</span></dt><dd>{formatPrice({ ...summary, price: summary.total })}</dd></div></dl>
        <p className="receipt-footnote">{receipt ? 'No payment was taken. This receipt is a preview, not a real order or shipment.' : 'All prices are in Philippine pesos. Delivery is included.'}</p>
      </section>
      <aside className="checkout-dispatch"><DeliveryScene key={receipt?.id || 'review'} items={summary.items} ordered={Boolean(receipt)} />{!receipt ? <div className="checkout-action"><p>Good gear. Great possibilities.</p><button className="checkout-primary" type="button" onClick={placeOrder}>Place order <span>{formatPrice({ ...summary, price: summary.total })} ↗</span></button><span>This is a playful preview. Nothing will be charged or delivered.</span></div> : <div className="checkout-action receipt-confirmation"><p><span aria-hidden="true">✓</span> Order complete</p><a className="checkout-primary" href="#shop">Keep exploring <span aria-hidden="true">↗</span></a><span>Your itemized receipt stays here while you explore.</span></div>}</aside>
    </div>
    <footer className="checkout-footer"><span>Go outside. Come back with a story.</span><span>NewHikes / The outfitter</span></footer>
  </main>
}
