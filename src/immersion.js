export function pointerTilt(x, y, width, height, strength = 3) {
  if (width <= 0 || height <= 0) return { x: 0, y: 0 }
  const horizontal = Math.max(-1, Math.min(1, x / width * 2 - 1))
  const vertical = Math.max(-1, Math.min(1, y / height * 2 - 1))
  return { x: -vertical * strength, y: horizontal * strength }
}

export function tiltWithPointer(event) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const element = event.currentTarget
  const box = element.getBoundingClientRect()
  const tilt = pointerTilt(event.clientX - box.left, event.clientY - box.top, box.width, box.height, element.classList.contains('pdp-photo') ? 6 : 2)
  element.style.setProperty('--tilt-x', `${tilt.x}deg`)
  element.style.setProperty('--tilt-y', `${tilt.y}deg`)
}

export function resetTilt(event) {
  event.currentTarget.style.setProperty('--tilt-x', '0deg')
  event.currentTarget.style.setProperty('--tilt-y', '0deg')
}

export function viewportProgress(top, height, viewportHeight) {
  if (height <= 0 || viewportHeight <= 0) return 0
  return Math.max(0, Math.min(1, (viewportHeight - top) / (viewportHeight + height)))
}

export function revealOnScroll() {
  if (!('IntersectionObserver' in window)) return
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  const elements = document.querySelectorAll('.chapter-copy, .chapter-marker, .experience-gear-heading, .field-gear, .journey-finale h2, .bestsellers-heading, .bestseller-card, .section-heading, .product-card, .guarantee, .pdp-info-card, .pdp-specs-card, .pdp-review, .pdp-related-heading')
  const layers = document.querySelectorAll('.journey-chapter, .experience-gear, .pdp-gallery')
  const activeLayers = new Set()
  let frame = 0

  function update() {
    frame = 0
    if (media.matches || document.hidden) return
    const height = window.innerHeight
    const measurements = [...activeLayers].map(element => ({ element, box: element.getBoundingClientRect() }))
    const distance = document.documentElement.scrollHeight - height
    document.documentElement.style.setProperty('--page-progress', distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0)
    for (const { element, box } of measurements) {
      element.style.setProperty('--scroll-depth', (viewportProgress(box.top, box.height, height) * 2 - 1).toFixed(4))
    }
  }

  function schedule() {
    if (!frame && !media.matches && !document.hidden) frame = window.requestAnimationFrame(update)
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed')
        if (entry.target.classList.contains('scroll-layer')) activeLayers.add(entry.target)
        else observer.unobserve(entry.target)
      } else {
        activeLayers.delete(entry.target)
      }
    }
    schedule()
  }, { threshold: 0 })

  for (const element of elements) {
    const index = [...element.parentElement.children].indexOf(element)
    element.style.setProperty('--reveal-delay', `${index % 3 * 90}ms`)
    element.classList.add('scroll-reveal')
    observer.observe(element)
  }
  for (const layer of layers) {
    layer.classList.add('scroll-layer')
    observer.observe(layer)
  }

  function syncMotion() {
    if (media.matches) {
      for (const element of elements) element.classList.add('is-revealed')
      for (const layer of layers) {
        layer.style.removeProperty('--scroll-depth')
        layer.style.removeProperty('--hero-progress')
      }
      document.documentElement.style.removeProperty('--page-progress')
    } else schedule()
  }

  function onFocus(event) {
    if (event.target.matches(':focus-visible')) event.target.closest('.scroll-reveal')?.classList.add('is-revealed')
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  document.addEventListener('visibilitychange', schedule)
  document.addEventListener('focusin', onFocus)
  media.addEventListener('change', syncMotion)
  syncMotion()
  return () => {
    window.cancelAnimationFrame(frame)
    observer.disconnect()
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    document.removeEventListener('visibilitychange', schedule)
    document.removeEventListener('focusin', onFocus)
    media.removeEventListener('change', syncMotion)
    for (const element of elements) element.classList.remove('scroll-reveal')
    for (const layer of layers) {
      layer.classList.remove('scroll-layer')
      layer.style.removeProperty('--scroll-depth')
      layer.style.removeProperty('--hero-progress')
    }
    document.documentElement.style.removeProperty('--page-progress')
  }
}
