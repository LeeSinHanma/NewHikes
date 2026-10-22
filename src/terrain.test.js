import assert from 'node:assert/strict'
import test from 'node:test'
import { createTerrain, terrainHeight, trailPoint, trailStops } from './terrain.js'
import { pointerTilt, viewportProgress } from './immersion.js'

test('terrain is deterministic, bounded, and has a pronounced alpine summit', () => {
  assert.ok(terrainHeight(2, -2) > 8)
  assert.equal(terrainHeight(30, 30), 0)
  for (let x = -12; x <= 12; x += 2) {
    for (let z = -10; z <= 10; z += 2) {
      const height = terrainHeight(x, z)
      assert.ok(Number.isFinite(height) && height >= 0 && height < 11)
      assert.equal(height, terrainHeight(x, z))
    }
  }
})

test('terrain mesh has valid triangles and normalized upward surface normals', () => {
  const { positions, normals, indices } = createTerrain(16)
  assert.equal(positions.length, 17 * 17 * 3)
  assert.equal(normals.length, positions.length)
  assert.equal(indices.length % 3, 0)
  assert.ok(indices.length > 0)
  for (const index of indices) assert.ok(index >= 0 && index < positions.length / 3)
  for (let i = 0; i < normals.length; i += 3) {
    assert.ok(Math.abs(Math.hypot(...normals.slice(i, i + 3)) - 1) < 0.00001)
    assert.ok(normals[i + 1] > 0)
  }
  for (const position of positions) assert.ok(Number.isFinite(position))
})

test('trail and its interactive checkpoints stay above the terrain', () => {
  for (let i = 0; i <= 100; i++) {
    const [x, y, z] = trailPoint(i / 100)
    assert.ok(Math.abs(y - terrainHeight(x, z) - 0.18) < 0.00001)
  }
  assert.deepEqual(trailPoint(-1), trailPoint(0))
  assert.deepEqual(trailPoint(2), trailPoint(1))
  assert.equal(trailStops.length, 3)
  assert.deepEqual(trailStops.map(stop => stop.progress), [0, 0.55, 1])
})

test('pointer depth stays within its allowed tilt and handles empty bounds', () => {
  assert.deepEqual(pointerTilt(0, 0, 100, 100, 6), { x: 6, y: -6 })
  assert.deepEqual(pointerTilt(-100, 999, 100, 100, 6), { x: -6, y: -6 })
  assert.equal(Math.abs(pointerTilt(50, 50, 100, 100).x), 0)
  assert.equal(pointerTilt(50, 50, 100, 100).y, 0)
  assert.deepEqual(pointerTilt(10, 10, 0, 0), { x: 0, y: 0 })
})

test('scroll depth follows the viewport and clamps outside it, including empty bounds', () => {
  assert.equal(viewportProgress(800, 400, 800), 0)
  assert.equal(viewportProgress(200, 400, 800), 0.5)
  assert.equal(viewportProgress(-400, 400, 800), 1)
  assert.equal(viewportProgress(1200, 400, 800), 0)
  assert.equal(viewportProgress(-900, 400, 800), 1)
  assert.equal(viewportProgress(0, 0, 800), 0)
  assert.equal(viewportProgress(0, 400, 0), 0)
})
