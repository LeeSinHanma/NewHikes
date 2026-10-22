// shortcut: USD amounts use BSP's 22 Oct 2026 rate (₱63.226/USD), rounded to whole pesos; update when selling prices are approved.
export const freeShippingThreshold = { price: 7587, currency: 'PHP' }

export const categories = [
  {
    "id": "footwear",
    "name": "Footwear",
    "title": "Mountain Footwear & Alpine Socks"
  },
  {
    "id": "packs",
    "name": "Packs",
    "title": "Expedition Packs & Summit Daypacks"
  },
  {
    "id": "apparel",
    "name": "Apparel",
    "title": "Technical Alpine Apparel"
  },
  {
    "id": "trail-tools",
    "name": "Trail Tools",
    "title": "High-Altitude Tools & Hardware"
  },
  {
    "id": "protection",
    "name": "Protection",
    "title": "Weather Protection & UV Defense"
  }
]

export const products = [
  {
    "id": "ultra-raptor",
    "category": "footwear",
    "name": "La Sportiva Ultra Raptor II GTX",
    "price": 10800,
    "tag": "GORE-TEX® EXTENDED",
    "detail": "All-terrain grip",
    "rating": 4.6,
    "reviews": 840,
    "description": "An all-terrain waterproof mountain trail shoe with GORE-TEX Extended Comfort lining, a FriXion White sticky rubber outsole, and a stabilizing heel counter for steep descents.",
    "images": [
      "/products/ultra-raptor/1.jpg",
      "/products/ultra-raptor/3.webp",
      "/products/ultra-raptor/2.webp"
    ],
    "currency": "PHP"
  },
  {
    "id": "moab-3",
    "category": "footwear",
    "name": "Merrell Moab 3 Waterproof",
    "price": 9200,
    "tag": "WATERPROOF / VIBRAM®",
    "detail": "Trail comfort",
    "rating": 4.6,
    "reviews": 2036,
    "description": "Legendary out-of-the-box comfort. Pig suede leather, a waterproof membrane, recycled mesh lining, and a high-traction Vibram TC5+ sole.",
    "images": [
      "/products/moab-3/1.jpg",
      "/products/moab-3/2.jpg",
      "/products/moab-3/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "renegade",
    "category": "footwear",
    "name": "Lowa Renegade GTX Mid",
    "price": 14500,
    "tag": "GORE-TEX® / NUBUCK",
    "detail": "Mid-cut support",
    "rating": 4.7,
    "reviews": 3500,
    "description": "Handcrafted European hiking boots with a nubuck leather upper, waterproof GORE-TEX lining, and a Vibram EVO outsole for stability under heavy packs.",
    "images": [
      "/products/renegade/1.jpg",
      "/products/renegade/2.jpg",
      "/products/renegade/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "nh100-boot",
    "category": "footwear",
    "name": "Quechua NH100 Waterproof Boot",
    "price": 2290,
    "tag": "LOW / WATERPROOF",
    "detail": "Dark grey",
    "description": "Comfortable low hiking boots that combine grip and rain protection for occasional outings in lowlands, forests, and along the coast.",
    "images": [
      "/products/nh100-boot/1.jpg",
      "/products/nh100-boot/2.jpg",
      "/products/nh100-boot/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "mh500-boot",
    "category": "footwear",
    "name": "Quechua MH500 Mid Hiking Shoes",
    "price": 3790,
    "tag": "OUTDOOR CONTACT SOLE",
    "detail": "Grey",
    "description": "Waterproof mid-height mountain hiking shoes with an Outdoor Contact sole for grip and a rubber toe bumper for extra protection.",
    "images": [
      "/products/mh500-boot/1.jpg",
      "/products/mh500-boot/2.jpg",
      "/products/mh500-boot/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "aqua-hike",
    "category": "footwear",
    "name": "Aqua Hike Water Sandal-Shoes",
    "price": 2590,
    "tag": "VENTILATED / WATER-READY",
    "detail": "Grey",
    "description": "Light, ventilated sandal-shoes designed to grip wet rocks and drain water quickly for comfort on aquatic hikes.",
    "images": [
      "/products/aqua-hike/1.jpg",
      "/products/aqua-hike/2.jpg",
      "/products/aqua-hike/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "arpenaz-50",
    "category": "packs",
    "name": "Quechua Arpenaz 50 Daypack 10L",
    "price": 190,
    "tag": "LIGHTWEIGHT / DAY HIKING",
    "detail": "10L",
    "rating": 4.8,
    "reviews": 23890,
    "description": "A compact 10-liter daypack for basic day hikes and quick outings. Features a lightweight padded back, thumb loops, and a single main zip compartment.",
    "images": [
      "/products/arpenaz-50/1.jpg",
      "/products/arpenaz-50/2.jpg",
      "/products/arpenaz-50/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "arpenaz-100",
    "category": "packs",
    "name": "Quechua NH Arpenaz 100 Pack",
    "price": 590,
    "tag": "PADDED / COUNTRY HIKING",
    "detail": "20L",
    "rating": 4.8,
    "reviews": 18619,
    "description": "A comfortable 20-liter daypack with deep storage pockets, padded back panels, and thumb loop straps for balanced load distribution.",
    "images": [
      "/products/arpenaz-100/1.jpg",
      "/products/arpenaz-100/2.jpg",
      "/products/arpenaz-100/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "travel-100",
    "category": "packs",
    "name": "Forclaz Travel 100 Pack 10L",
    "price": 290,
    "tag": "FOLDABLE / WATER-REPELLENT",
    "detail": "45g / 10L",
    "rating": 4.7,
    "reviews": 4120,
    "description": "An ultra-lightweight backup daypack that folds into a tiny pouch. Water-repellent ripstop fabric keeps the weight to just 45 grams.",
    "images": [
      "/products/travel-100/1.jpg",
      "/products/travel-100/2.jpg",
      "/products/travel-100/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "mh900-pack",
    "category": "packs",
    "name": "Quechua MH900 Mountain Pack",
    "price": 4990,
    "tag": "VENTILATED / MOUNTAIN HIKING",
    "detail": "25L",
    "description": "Compact mountain storage with a preformed foam back and ventilated straps. Built for comfort, organization, and durability on intensive hikes.",
    "images": [
      "/products/mh900-pack/1.jpg",
      "/products/mh900-pack/2.jpg",
      "/products/mh900-pack/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "mh100-pack",
    "category": "packs",
    "name": "Quechua MH100 Hiking Backpack",
    "price": 2290,
    "tag": "AIRCOOLING / PADDED WAIST",
    "detail": "35L",
    "description": "A padded waistband and ventilated AirCooling back keep you comfortable. Includes secure pockets and space for a hydration pouch.",
    "images": [
      "/products/mh100-pack/1.jpg",
      "/products/mh100-pack/2.jpg",
      "/products/mh100-pack/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "mh500-pack",
    "category": "packs",
    "name": "Quechua MH500 Hiking Backpack",
    "price": 3990,
    "tag": "ADJUSTABLE FRAME / VENTILATED",
    "detail": "38L / Khaki",
    "description": "A ventilated back panel, adjustable frame, and padded straps distribute the weight. Organized compartments make this pack ideal for family hikes.",
    "images": [
      "/products/mh500-pack/1.jpg",
      "/products/mh500-pack/2.jpg",
      "/products/mh500-pack/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "alpha-jacket",
    "category": "apparel",
    "name": "Arc’teryx Alpha Jacket",
    "price": 44258,
    "currency": "PHP",
    "tag": "WINDPROOF / WATERPROOF",
    "detail": "Graphite / Black",
    "rating": 4,
    "reviews": 8,
    "description": "A durable alpine jacket for fast, technical ascents. Blocks wind and water, with a harness-compatible fit articulated to keep you moving through storms.",
    "images": [
      "/products/alpha-jacket/1.jpg",
      "/products/alpha-jacket/2.jpg",
      "/products/alpha-jacket/3.jpg"
    ]
  },
  {
    "id": "r1-air",
    "category": "apparel",
    "name": "Patagonia R1 Air Full-Zip Hoody",
    "price": 12582,
    "currency": "PHP",
    "tag": "100% RECYCLED POLYESTER",
    "detail": "Treeline green",
    "rating": 4.8,
    "reviews": 59,
    "description": "Lightweight, highly breathable, quick-drying fleece for cool conditions. A full zip makes venting easy. Made in a Fair Trade Certified factory.",
    "images": [
      "/products/r1-air/1.jpg",
      "/products/r1-air/2.jpg",
      "/products/r1-air/3.jpg"
    ]
  },
  {
    "id": "merino-resist",
    "category": "apparel",
    "name": "Forclaz Merino Resist T-Shirt",
    "price": 2290,
    "tag": "MERINO / ODOR CONTROL",
    "detail": "Grey",
    "description": "Merino wool threads wrapped in polyamide resist friction, while mesh inserts wick perspiration. A durable short-sleeved layer that helps limit odors.",
    "images": [
      "/products/merino-resist/1.jpg",
      "/products/merino-resist/2.jpg",
      "/products/merino-resist/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "mh100-jacket",
    "category": "apparel",
    "name": "Quechua MH100 Waterproof Jacket",
    "price": 3390,
    "tag": "2.5-LAYER / WATERPROOF",
    "detail": "15,000 mm H₂O",
    "description": "A lightweight, breathable hiking jacket with a 2.5-layer membrane. Designed for prolonged rain and changing mountain weather.",
    "images": [
      "/products/mh100-jacket/1.jpg",
      "/products/mh100-jacket/2.jpg",
      "/products/mh100-jacket/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "mh500-trousers",
    "category": "apparel",
    "name": "Quechua MH500 Hiking Trousers",
    "price": 1990,
    "tag": "STRETCH / QUICK-DRYING",
    "detail": "Blue",
    "description": "Breathable hiking trousers with 15% elastane and pre-shaped knees for freedom of movement. An adjustable belt and leg bottoms fine-tune your fit.",
    "images": [
      "/products/mh500-trousers/1.jpg",
      "/products/mh500-trousers/2.jpg",
      "/products/mh500-trousers/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "mt100-pole",
    "category": "trail-tools",
    "name": "Forclaz MT100 Trekking Pole",
    "price": 390,
    "tag": "3-SECTION / ALUMINUM",
    "detail": "Telescopic",
    "rating": 4.8,
    "reviews": 7465,
    "description": "A simple, sturdy three-section aluminum hiking pole with intuitive push-pin height adjustment and a high-density foam grip.",
    "images": [
      "/products/mt100-pole/1.jpg",
      "/products/mt100-pole/2.jpg",
      "/products/mt100-pole/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "huntsman",
    "category": "trail-tools",
    "name": "Victorinox Huntsman",
    "price": 2950,
    "tag": "15 FUNCTIONS / STAINLESS STEEL",
    "detail": "Swiss Army",
    "rating": 4.9,
    "reviews": 5120,
    "description": "A classic Swiss Army multi-tool with a wood saw, scissors, dual blades, bottle opener, and multi-purpose hook for practical trail repairs.",
    "images": [
      "/products/huntsman/1.jpg",
      "/products/huntsman/2.jpg",
      "/products/huntsman/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "hl100",
    "category": "trail-tools",
    "name": "Forclaz HL100 LED Headlamp",
    "price": 590,
    "tag": "3 BEAM MODES / IPX4",
    "detail": "100 lumens",
    "rating": 4.6,
    "reviews": 3120,
    "description": "A compact, splash-proof trail headlamp with red night vision, eco white, and bright white modes for your after-dark adventures.",
    "images": [
      "/products/hl100/1.jpg",
      "/products/hl100/2.jpg",
      "/products/hl100/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "mt500-pole",
    "category": "trail-tools",
    "name": "Forclaz MT500 Cork Hiking Pole",
    "price": 1190,
    "tag": "CORK GRIP / QUICK DEPLOYMENT",
    "detail": "Regular trekking",
    "description": "A versatile pole with a comfortable cork handle. Deploy and store it in a single movement, for regular hikes and mountain treks.",
    "images": [
      "/products/mt500-pole/1.jpg",
      "/products/mt500-pole/2.jpg",
      "/products/mt500-pole/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "carbon-poles",
    "category": "trail-tools",
    "name": "Carbon Folding Trail Poles",
    "price": 6990,
    "tag": "ULTRALIGHT / 3-PIECE",
    "detail": "Folding pair",
    "description": "Ultralight carbon poles fold away in one movement. Designed to save energy and provide stability on long trail runs with elevation gains.",
    "images": [
      "/products/carbon-poles/1.jpg",
      "/products/carbon-poles/2.jpg",
      "/products/carbon-poles/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "kiprun-belt",
    "category": "trail-tools",
    "name": "Kiprun 900 Trail Running Belt",
    "price": 1590,
    "tag": "FLEXIBLE / POLE HOLDER",
    "detail": "Grey / Beige",
    "description": "Carry a 500 mL flask, gels, bars, your phone, race number, and running poles in a lightweight, flexible trail belt.",
    "images": [
      "/products/kiprun-belt/1.jpg",
      "/products/kiprun-belt/2.jpg",
      "/products/kiprun-belt/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "mt50-poncho",
    "category": "protection",
    "name": "Forclaz MT50 Packable Poncho",
    "price": 490,
    "tag": "WATERPROOF / PACK COVER",
    "detail": "10L",
    "rating": 4.6,
    "reviews": 4615,
    "description": "A compact, lightweight waterproof EVA rain cape designed to cover you and a small 10L daypack when sudden rain hits.",
    "images": [
      "/products/mt50-poncho/1.jpg",
      "/products/mt50-poncho/2.jpg",
      "/products/mt50-poncho/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "mh100-sunglasses",
    "category": "protection",
    "name": "Quechua MH100 Sunglasses",
    "price": 290,
    "tag": "CATEGORY 3 / 100% UV FILTER",
    "detail": "Wraparound fit",
    "rating": 4.7,
    "reviews": 2786,
    "description": "Shatterproof polycarbonate lenses and lightweight wraparound frames. Category 3 lenses block UV rays for bright days on the trail.",
    "images": [
      "/products/mh100-sunglasses/1.jpg",
      "/products/mh100-sunglasses/2.jpg",
      "/products/mh100-sunglasses/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "surf-hat",
    "category": "protection",
    "name": "Decathlon 500 Surf Hat",
    "price": 790,
    "tag": "QUICK-DRYING / SECURE FIT",
    "detail": "Black",
    "rating": 4.7,
    "reviews": 290,
    "description": "A secure surf hat that stays put in the waves. A rear mesh panel drains water, and synthetic fabric dries quickly between adventures.",
    "images": [
      "/products/surf-hat/1.jpg",
      "/products/surf-hat/2.jpg",
      "/products/surf-hat/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "mh140-sunglasses",
    "category": "protection",
    "name": "Quechua MH140 Premium Sunglasses",
    "price": 1690,
    "tag": "CATEGORY 3 / ANTI-UV",
    "detail": "Green",
    "description": "Lightweight sunglasses with steel arms for support. Category 3 anti-UV lenses protect against glare for hiking and everyday adventures.",
    "images": [
      "/products/mh140-sunglasses/1.jpg",
      "/products/mh140-sunglasses/2.jpg",
      "/products/mh140-sunglasses/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "raincut-long",
    "category": "protection",
    "name": "Quechua Raincut Long Jacket",
    "price": 1320,
    "tag": "WATERPROOF / PACKABLE",
    "detail": "Women’s long fit",
    "description": "A long waterproof jacket for light rain in town and on the trail. Features two storage compartments and folds into its inner mesh pocket.",
    "images": [
      "/products/raincut-long/1.jpg",
      "/products/raincut-long/2.jpg",
      "/products/raincut-long/3.jpg"
    ],
    "currency": "PHP"
  },
  {
    "id": "desert-500",
    "category": "protection",
    "name": "Forclaz Desert 500 Trekking Cap",
    "price": 990,
    "tag": "UV PROTECTION / NECK COVER",
    "detail": "Desert trekking",
    "description": "Sun and sand protection that extends down to your shoulders. Designed for desert treks through changing winds and strong sunshine.",
    "images": [
      "/products/desert-500/1.jpg",
      "/products/desert-500/2.jpg"
    ],
    "currency": "PHP"
  }
]

// shortcut: these are curated demo rankings; replace with order totals when sales data is connected.
export const demoBestsellerIds = ['ultra-raptor', 'mh500-pack', 'alpha-jacket', 'huntsman', 'mt50-poncho', 'moab-3']

export function sortProducts(items, order = 'featured') {
  return [...items].sort((a, b) => {
    if (order === 'price-asc') return a.price - b.price
    if (order === 'price-desc') return b.price - a.price
    if (order === 'rating') return (b.rating || 0) - (a.rating || 0)
    const aRank = demoBestsellerIds.indexOf(a.id)
    const bRank = demoBestsellerIds.indexOf(b.id)
    return (aRank < 0 ? demoBestsellerIds.length : aRank) - (bRank < 0 ? demoBestsellerIds.length : bRank)
  })
}

export function formatPrice(product) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency', currency: product.currency, maximumFractionDigits: 0,
  }).format(product.price)
}

export function getPackTotals(pack) {
  return Object.values(pack).reduce((totals, line) => {
    const product = products.find(product => product.id === line.productId)
    totals[product.currency] = (totals[product.currency] || 0) + product.price * line.quantity
    return totals
  }, {})
}

export function addPackItem(pack, productId, quantity = 1, selection = {}) {
  if (!products.some(product => product.id === productId)) throw new RangeError('Unknown product')
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new RangeError('Choose a quantity from 1 to 99')
  const key = JSON.stringify([productId, selection.color || '', selection.size || ''])
  return { ...pack, [key]: { productId, color: selection.color || '', size: selection.size || '', quantity: (pack[key]?.quantity || 0) + quantity } }
}
