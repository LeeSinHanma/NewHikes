# NewHikes

Responsive React storefront implementing the [NewHikes desktop landing frame](https://www.figma.com/design/hpPVrtGqGujJEm3n3qrY1w/NewHikes-Design?node-id=1-2).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Use `npm run build` for a production build, `npm run lint` for linting, and `npm test` for catalog, currency-total, and local-asset checks.

The page uses the Figma logo, hero and editorial images, and SVG icons. Fonts and all images are served locally. The 29 products and 86 product photos come from `D:\NewHikes\assets`; their descriptions, ratings where supplied, prices, and currencies are in `src/catalog.js`. Product photos live in `public/products`.

Each category initially shows three products. Category filters, “Explore more,” photo thumbnails, saved gear, and the pack's quantity/removal controls work locally. All product prices, saved gear, detail-page quantity totals, and pack totals use Philippine pesos (PHP).

The “Most bought” showcase highlights three products in a large feature card and two supporting cards, with working product links and quick-add buttons. Rankings and bestseller badges are explicitly labeled demo content: `demoBestsellerIds` is a curated selection, with no sales counts implied. The catalog defaults to featured products first within each category; shoppers can also sort by price or rating. Numbered category headings and highlighted cards distinguish the featured gear from the rest of the range. Replace demo rankings with real order data before presenting them as actual bestsellers.

Pricing audit: the 27 PHP prices match the supplied asset descriptions. The Arc’teryx Alpha Jacket ($700) is ₱44,258 and the Patagonia R1 Air Hoody ($199) is ₱12,582, converted at ₱63.226/USD from the [BSP Reference Exchange Rate Bulletin](https://www.bsp.gov.ph/Statistics/RERB/RERB.xlsx) dated 22 October 2026, rounded to the nearest whole peso. The design's $120 free-shipping threshold becomes ₱7,587, shared by both shipping messages. These are fixed conversion amounts, not live exchange rates or confirmed Philippine retail prices; update them when approved selling prices are supplied.

Product links open full detail pages using `#product/<product-id>`, including direct links and browser Back navigation. The [La Sportiva product page](http://127.0.0.1:5173/#product/ultra-raptor) implements the [Figma product frame](https://www.figma.com/design/hpPVrtGqGujJEm3n3qrY1w/NewHikes-Design?node-id=58-2), including its gallery, color/size selectors, quantity control, information tabs, field-review layout, and related-gear carousel. Other products reuse the layout with their catalog information. The pack retains separate entries for each size/color combination.

The source catalog's ₱10,800 price and 4.6 rating (840 reviews) replace the product frame's sample price/rating. Related gear uses real catalog products. Color and size selections are design previews, with the supplied product photo shown for every color. Actual inventory and manufacturer sizing are not connected. Field-review cards are labeled sample content; the frame's unrelated C2 crampon-fit claim is replaced with product-specific notes.

The landing hero includes a lazy-loaded React Three Fiber mountain scene with procedural terrain, snow shading, contour lines, a glowing trail, three interactive checkpoints, and daybreak/moonlight lighting. Moving the cursor orbits, lifts, and tilts the terrain and moves its accent light. A pause button, reduced-motion support, offscreen/tab suspension, capped pixel density, and a WebGL photo fallback limit unnecessary rendering. The terrain is a decorative alpine study, not a navigation map. Product photos gain perspective depth, cards respond to the pointer, and sections reveal on scroll. No 3D product models or new runtime dependencies were added.

Scrolling advances the mountain camera through a gentle orbit, separates the hero's foreground and background layers, and moves the editorial photos at different depths. Product cards, headings, field notes, guarantees, and detail panels enter with staggered perspective transitions. A thin progress line tracks your place on the page. DOM updates are batched into one requested frame per scroll event, parallax only updates visible layers, and observers/listeners are removed on route/filter changes. Reduced motion shows all content immediately and disables decorative movement; keyboard focus also reveals controls immediately.

The mislabeled MH500 trousers listing with fleece photos is omitted at the owner's request. The other MH500 trousers listing uses its correct blue trouser photos.

This is a frontend preview. Pack and saved gear reset on refresh. Checkout, newsletter delivery, support contact details, and legal policies need production services/content; forms do not claim to process submissions. Shipping and guarantee copy follows the design and should be confirmed before launch.
