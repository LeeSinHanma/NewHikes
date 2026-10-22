import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, Color, MathUtils, Object3D, Vector3 } from 'three'
import { createTerrain, forestPositions, trailPoint, trailStops } from './terrain'

const motionQuery = '(prefers-reduced-motion: reduce)'
function subscribeMotion(onChange) {
  const media = window.matchMedia(motionQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
function getReducedMotion() { return window.matchMedia(motionQuery).matches }

class LandscapeBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <div className="journey-photo-fallback" /> : this.props.children }
}

function alpineMaterial(shader) {
  shader.vertexShader = `varying float vAltitude;\n${shader.vertexShader}`
  shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvAltitude = position.y;')
  shader.fragmentShader = `varying float vAltitude;\n${shader.fragmentShader}`
  shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
    #include <color_fragment>
    vec3 forest = mix(vec3(0.055, 0.15, 0.095), vec3(0.22, 0.29, 0.24), smoothstep(2.0, 14.0, vAltitude));
    diffuseColor.rgb = mix(forest, vec3(0.84, 0.88, 0.78), smoothstep(12.0, 22.0, vAltitude));
    float contour = 1.0 - smoothstep(0.01, 0.045 + fwidth(vAltitude), abs(fract(vAltitude * 0.75) - 0.5));
    diffuseColor.rgb += vec3(0.16, 0.22, 0.12) * contour * 0.12;
  `)
}

function PineForest() {
  const foliage = useRef(null)
  const trunks = useRef(null)
  const trees = useMemo(() => forestPositions(), [])
  useLayoutEffect(() => {
    const transform = new Object3D()
    const color = new Color()
    trees.forEach((tree, index) => {
      transform.position.set(tree.x, tree.y + tree.size * 0.25, tree.z)
      transform.scale.set(tree.size * 0.12, tree.size * 0.8, tree.size * 0.12)
      transform.updateMatrix()
      trunks.current.setMatrixAt(index, transform.matrix)
      for (let layer = 0; layer < 2; layer++) {
        transform.position.set(tree.x, tree.y + tree.size * (layer ? 1 : 0.65), tree.z)
        transform.scale.setScalar(tree.size * (layer ? 0.45 : 0.65))
        transform.updateMatrix()
        foliage.current.setMatrixAt(index * 2 + layer, transform.matrix)
        foliage.current.setColorAt(index * 2 + layer, color.setHSL(0.37 + index % 3 * 0.012, 0.25, 0.16 + index % 5 * 0.015))
      }
    })
    for (const mesh of [foliage.current, trunks.current]) {
      mesh.instanceMatrix.needsUpdate = true
      mesh.computeBoundingSphere()
    }
    foliage.current.instanceColor.needsUpdate = true
  }, [trees])
  return <group name="pine-forest">
    <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]}><cylinderGeometry args={[0.7, 1, 1, 5]} /><meshStandardMaterial color="#544b34" roughness={1} /></instancedMesh>
    <instancedMesh ref={foliage} args={[undefined, undefined, trees.length * 2]}><coneGeometry args={[0.65, 2, 7]} /><meshStandardMaterial roughness={1} /></instancedMesh>
  </group>
}

function JourneyWorld({ travel, animate, night }) {
  const terrain = useMemo(() => createTerrain(), [])
  const trails = useMemo(() => [0, 1, 2].map(branch => new CatmullRomCurve3(Array.from({ length: 180 }, (_, i) => new Vector3(...trailPoint(i / 179, branch))))), [])
  const progress = useRef(0)
  useFrame(({ camera }, delta) => {
    if (!animate) return
    const dt = Math.min(delta, 0.05)
    progress.current = MathUtils.damp(progress.current, travel.current.progress, 3, dt)
    const p = progress.current
    camera.position.x = MathUtils.damp(camera.position.x, 18 - p * 8 + Math.sin(p * Math.PI) * 18 + travel.current.x * 1.2, 3, dt)
    camera.position.y = MathUtils.damp(camera.position.y, 8 + p * 24 - travel.current.y * 0.7, 3, dt)
    camera.position.z = MathUtils.damp(camera.position.z, 40 - p * 32, 3, dt)
    camera.lookAt(-3, 6 + p * 8, -25)
  })
  return <>
    <color attach="background" args={[night ? '#102d35' : '#466454']} />
    <fog attach="fog" args={[night ? '#102d35' : '#466454', 35, 125]} />
    <hemisphereLight args={[night ? '#b0c9e5' : '#e4ead1', '#142a20', night ? 1.4 : 2.6]} />
    <directionalLight position={[-25, 45, -30]} color={night ? '#a8c4ff' : '#ffcf91'} intensity={night ? 2 : 3.5} />
    <directionalLight position={[30, 12, 20]} color="#8aa69c" intensity={1.2} />
    <mesh position={[-28, 28, -70]}><sphereGeometry args={[5.5, 24, 16]} /><meshBasicMaterial color={night ? '#cfdfec' : '#ffe3a9'} fog={false} /></mesh>
    <mesh name="mountain-range"><bufferGeometry><bufferAttribute attach="attributes-position" args={[terrain.positions, 3]} /><bufferAttribute attach="attributes-normal" args={[terrain.normals, 3]} /><bufferAttribute attach="index" args={[terrain.indices, 1]} /></bufferGeometry><meshStandardMaterial onBeforeCompile={alpineMaterial} customProgramCacheKey={() => 'journey-alpine-v1'} roughness={1} /></mesh>
    <PineForest />
    {trails.map((curve, index) => <group key={index} name={`trail-${index + 1}`}><mesh><tubeGeometry args={[curve, 220, index ? 0.065 : 0.12, 5, false]} /><meshBasicMaterial color={index ? '#c4a77a' : '#edb26e'} toneMapped={false} /></mesh><mesh><tubeGeometry args={[curve, 160, index ? 0.13 : 0.24, 5, false]} /><meshBasicMaterial color="#ffc877" transparent opacity={0.12} depthWrite={false} /></mesh></group>)}
    {trailStops.map(stop => <group key={stop.name} position={trailPoint(stop.progress)}><mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.035, 0.035, 1.5, 6]} /><meshBasicMaterial color="#e7c99a" /></mesh><mesh position={[0, 1.4, 0]}><sphereGeometry args={[0.16, 12, 8]} /><meshBasicMaterial color="#fff0c5" toneMapped={false} /></mesh></group>)}
  </>
}

export default function JourneyScene() {
  const travel = useRef({ progress: 0, x: 0, y: 0 })
  const [paused, setPaused] = useState(false)
  const [night, setNight] = useState(false)
  const [visible, setVisible] = useState(!document.hidden)
  const [covered, setCovered] = useState(false)
  const coverage = useRef(false)
  const reducedMotion = useSyncExternalStore(subscribeMotion, getReducedMotion)
  const animate = visible && !covered && !paused && !reducedMotion

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    function onScroll() {
      const distance = document.documentElement.scrollHeight - innerHeight
      travel.current.progress = distance > 0 ? Math.max(0, Math.min(1, scrollY / distance)) : 0
      const gear = document.getElementById('the-gear')?.getBoundingClientRect()
      const hidden = Boolean(gear && gear.top <= 0 && gear.bottom >= innerHeight)
      if (coverage.current !== hidden) {
        coverage.current = hidden
        setCovered(hidden)
      }
    }
    function onPointer(event) {
      if (!animate || event.pointerType !== 'mouse') return
      travel.current.x = event.clientX / innerWidth * 2 - 1
      travel.current.y = event.clientY / innerHeight * 2 - 1
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [animate])

  return <>
    <div className={`journey-stage${night ? ' is-night' : ''}`} data-animated={animate} aria-hidden="true">
      <LandscapeBoundary><Canvas camera={{ position: [18, 8, 40], fov: 50, near: 0.1, far: 180 }} dpr={[1, 1.25]} frameloop={visible && !covered ? animate ? 'always' : 'demand' : 'never'} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} onCreated={({ camera }) => camera.lookAt(-3, 6, -25)} fallback={<div className="journey-photo-fallback" />}><JourneyWorld travel={travel} animate={animate} night={night} /></Canvas></LandscapeBoundary>
    </div>
    <div className="journey-scene-controls" role="group" aria-label="Landscape controls"><button type="button" onClick={() => setPaused(!paused)} disabled={reducedMotion} aria-pressed={paused || reducedMotion} aria-label={paused ? 'Resume scenery motion' : 'Pause scenery motion'}>{reducedMotion ? 'Still scenery' : paused ? '▶ Resume scenery' : 'Ⅱ Pause scenery'}</button><span aria-hidden="true">/</span><button type="button" onClick={() => setNight(!night)} aria-pressed={night}>{night ? '☾ Moonlight' : '☼ Daybreak'}</button></div>
  </>
}
