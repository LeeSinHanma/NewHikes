import { lazy, Suspense } from 'react'
import { products } from './catalog'
import { resetTilt, tiltWithPointer } from './immersion'

const JourneyScene = lazy(() => import('./JourneyScene'))
const fieldGear = [
  { id: 'ultra-raptor', title: 'Find your footing.', detail: 'Footwear / Grounded in possibility', text: 'Rock, roots, and the winding way ahead. A sure-footed start to every adventure.' },
  { id: 'mh500-pack', title: 'Carry the possibility.', detail: 'Packs / Room for the unexpected', text: 'A day outside. A little further than planned. Bring what matters and leave room for more.' },
  { id: 'alpha-jacket', title: 'Meet the elements.', detail: 'Layers / Follow the changing sky', text: 'For the wind on the ridge and the clouds rolling in. Keep your eyes on what lies ahead.' },
]

export default function LandingPage() {
  return (
    <main className="experience-page">
      <Suspense fallback={<div className="journey-backdrop" />}><JourneyScene /></Suspense>
      <div className="experience-content">
        <section className="experience-hero container" aria-labelledby="experience-title">
          <p className="experience-eyebrow">NewHikes / Outside is calling</p>
          <h1 id="experience-title" tabIndex={-1}>Go where<br />you feel <em>alive.</em></h1>
          <div className="experience-hero-bottom"><p>Beyond the everyday.<br />Into something you’ll remember.</p><a className="journey-scroll" href="#forest"><span>Scroll to begin</span><span aria-hidden="true">↓</span></a><span className="experience-coordinate">A journey in three chapters<br />Forest / Ridgeline / Summit</span></div>
        </section>

        <section className="journey-chapter container" id="forest" aria-labelledby="forest-title">
          <div className="chapter-copy"><p className="experience-eyebrow">01 / Beneath the canopy</p><h2 id="forest-title">Take the<br /><em>long way.</em></h2><p>Cold air. Tall pines. The quiet rhythm of a trail unfolding under your feet. Out here, getting a little lost can feel like finding something.</p><a href="#the-gear" className="chapter-link">Made for moments like this <span aria-hidden="true">↘</span></a></div>
          <div className="chapter-marker" aria-hidden="true"><span>01</span><i /><p>Slow down.<br />Look around.</p></div>
        </section>

        <section className="experience-gear" id="the-gear" aria-labelledby="experience-gear-title">
          <div className="container">
            <div className="experience-gear-heading"><div><p className="experience-eyebrow">The essentials / For your way out</p><h2 id="experience-gear-title">The right gear.<br /><span>The rest is instinct.</span></h2></div><p>Thoughtful companions for the miles,<br />the weather, and the stories in between.</p></div>
            <div className="experience-gear-grid">{fieldGear.map((item, index) => {
              const product = products.find(product => product.id === item.id)
              return <article className="field-gear" key={item.id} onPointerMove={tiltWithPointer} onPointerLeave={resetTilt}>
                <div className="field-gear-image"><span className="field-gear-number" aria-hidden="true">0{index + 1}</span><span className="product-orbit" aria-hidden="true" /><img src={product.images[0]} alt={product.name} loading="lazy" /></div>
                <p className="field-gear-detail">{item.detail}</p><h3>{item.title}</h3><p className="field-gear-description">{item.text}</p><span className="field-gear-name">{product.name}</span>
              </article>
            })}</div>
          </div>
        </section>

        <section className="journey-chapter ridge-chapter container" id="ridgeline" aria-labelledby="ridge-title">
          <div className="chapter-marker" aria-hidden="true"><span>02</span><i /><p>Leave the familiar<br />a little further below.</p></div>
          <div className="chapter-copy"><p className="experience-eyebrow">02 / Above the treeline</p><h2 id="ridge-title">A little higher.<br /><em>A little further.</em></h2><p>The trees give way to open sky. One more switchback, one more deep breath. This is the feeling you came for.</p><a href="#summit" className="chapter-link">Keep following the trail <span aria-hidden="true">↗</span></a></div>
        </section>

        <section className="journey-finale container" id="summit" aria-labelledby="summit-title">
          <p className="experience-eyebrow">03 / The view is only the beginning</p><h2 id="summit-title">Your next chapter<br />is <em>out there.</em></h2><p>You’ve felt the call. Now, make it yours.</p><a className="enter-shop" href="#shop">Enter the shop <span aria-hidden="true">↗</span></a><span className="shop-invitation">Footwear · Packs · Layers · Trail essentials</span>
        </section>
        <footer className="experience-footer container"><a href="#top" aria-label="NewHikes home"><img src="/design/bed9e.png" width="120" height="32" alt="NewHikes" /></a><p>Go outside. Come back with a story.</p><a href="#top">Back to the beginning <span aria-hidden="true">↑</span></a><small>© 2026 NewHikes</small></footer>
      </div>
    </main>
  )
}
