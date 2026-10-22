export const trailStops = [
  { name: 'Forest', progress: 0, caption: 'Beneath the canopy.' },
  { name: 'Ridgeline', progress: 0.55, caption: 'Above the treeline.' },
  { name: 'Summit', progress: 1, caption: 'The view is only the beginning.' },
]

export function terrainHeight(x, z) {
  const radius = Math.sqrt((x / 10.8) ** 2 + (z / 8.4) ** 2)
  const edge = Math.max(0, Math.min(1, (1 - radius) / 0.32))
  const peaks = Math.max(
    8.4 * Math.exp(-(((x - 2) ** 2 / 12 + (z + 2) ** 2 / 10) ** 0.68)),
    6.9 * Math.exp(-(((x + 3.5) ** 2 / 10 + (z + 1) ** 2 / 12) ** 0.72)),
    4.8 * Math.exp(-(((x - 5) ** 2 / 9 + (z - 3) ** 2 / 8) ** 0.75)),
  )
  const ridges = (1 - Math.abs(Math.sin(x * 1.7 + z * 1.15))) * 0.55 + Math.sin(x * 4.1 - z * 2.8) * 0.12
  return Math.max(0, (0.18 + peaks + ridges * Math.min(peaks, 1.5)) * edge)
}

export function landscapeHeight(x, z) {
  const peaks = Math.max(
    terrainHeight((x + 4) / 2.6, (z + 26) / 2.6) * 2.6,
    terrainHeight((x + 34) / 2, (z + 39) / 2) * 2,
    terrainHeight((x - 35) / 2.8, (z + 45) / 2.8) * 2.8,
  )
  return 0.5 + Math.sin(x * 0.06) * 0.35 + Math.cos(z * 0.07) * 0.4 + peaks
}

export function trailPoint(progress, branch = 0) {
  const t = Math.max(0, Math.min(1, progress))
  const x = branch === 1 ? 4 - t * 33 + Math.sin(t * Math.PI) * 6 : branch === 2 ? -3 + t * 44 + Math.sin(t * Math.PI) * 4 : Math.sin(t * Math.PI * 2) * 5 + t * 1.2
  const z = branch === 1 ? 14 - t * 57 : branch === 2 ? -4 - t * 45 : 42 - t * 74
  return [x, landscapeHeight(x, z) + 0.3, z]
}

export function forestPositions(count = 180) {
  const trees = []
  const paths = [0, 1, 2].flatMap(branch => Array.from({ length: 100 }, (_, i) => trailPoint(i / 99, branch)))
  for (let i = 0; trees.length < count && i < count * 20; i++) {
    const random = seed => { const value = Math.sin(seed * 127.1 + 31.7) * 43758.5453; return value - Math.floor(value) }
    const x = (random(i * 2) - 0.5) * 90
    const z = random(i * 2 + 1) * 68 - 14
    const y = landscapeHeight(x, z)
    if (y > 7 || paths.some(point => Math.hypot(point[0] - x, point[2] - z) < 2.5)) continue
    trees.push({ x, y, z, size: 1.8 + random(i + 433) * 2.8 })
  }
  return trees
}

export function createTerrain(segments = 112) {
  const positions = new Float32Array((segments + 1) ** 2 * 3)
  const normals = new Float32Array(positions.length)
  const indices = []
  for (let row = 0; row <= segments; row++) {
    for (let col = 0; col <= segments; col++) {
      // Stretch the outer ring into the fog so summit views never expose a terrain edge.
      const x = col === 0 ? -300 : col === segments ? 300 : (col / segments - 0.5) * 160
      const z = row === 0 ? -300 : row === segments ? 300 : row / segments * 145 - 90
      const index = (row * (segments + 1) + col) * 3
      const nx = (landscapeHeight(x - 0.05, z) - landscapeHeight(x + 0.05, z)) / 0.1
      const nz = (landscapeHeight(x, z - 0.05) - landscapeHeight(x, z + 0.05)) / 0.1
      const length = Math.hypot(nx, 1, nz)
      positions.set([x, landscapeHeight(x, z), z], index)
      normals.set([nx / length, 1 / length, nz / length], index)
      if (row < segments && col < segments) {
        const a = row * (segments + 1) + col
        const b = a + segments + 1
        indices.push(a, b, a + 1, a + 1, b, b + 1)
      }
    }
  }
  return { positions, normals, indices: new Uint16Array(indices) }
}
