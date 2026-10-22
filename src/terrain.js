export const trailStops = [
  { name: 'Trailhead', progress: 0, caption: 'Every ascent starts here.' },
  { name: 'High pass', progress: 0.55, caption: 'Find your line through the ridges.' },
  { name: 'Summit', progress: 1, caption: 'Built for the view from up here.' },
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

export function trailPoint(progress) {
  const t = Math.max(0, Math.min(1, progress))
  const x = -6 + t * 8
  const z = 5 - t * 7 + Math.sin(t * Math.PI * 3) * 0.65
  return [x, terrainHeight(x, z) + 0.18, z]
}

export function createTerrain(segments = 80) {
  const positions = new Float32Array((segments + 1) ** 2 * 3)
  const normals = new Float32Array(positions.length)
  const indices = []
  for (let row = 0; row <= segments; row++) {
    for (let col = 0; col <= segments; col++) {
      const x = (col / segments - 0.5) * 22
      const z = (row / segments - 0.5) * 18
      const index = (row * (segments + 1) + col) * 3
      const nx = (terrainHeight(x - 0.05, z) - terrainHeight(x + 0.05, z)) / 0.1
      const nz = (terrainHeight(x, z - 0.05) - terrainHeight(x, z + 0.05)) / 0.1
      const length = Math.hypot(nx, 1, nz)
      positions.set([x, terrainHeight(x, z), z], index)
      normals.set([nx / length, 1 / length, nz / length], index)
      if (row < segments && col < segments && (x / 10.8) ** 2 + (z / 8.4) ** 2 < 0.98) {
        const a = row * (segments + 1) + col
        const b = a + segments + 1
        indices.push(a, b, a + 1, a + 1, b, b + 1)
      }
    }
  }
  return { positions, normals, indices: new Uint16Array(indices) }
}
