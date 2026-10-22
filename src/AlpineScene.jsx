import { Component, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, MathUtils, Vector3 } from 'three'
import { createTerrain, trailPoint, trailStops } from './terrain'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
function subscribeMotion(onChange) {
  const media = window.matchMedia(reducedMotionQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
function getReducedMotion() {
  return window.matchMedia(reducedMotionQuery).matches
}

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <div className="alpine-fallback"><span>Explore the outdoors.</span><small>Photo view is active on this device.</small></div> : this.props.children
  }
}

function contourMaterial(shader) {
  shader.vertexShader = `varying float vAltitude;\n${shader.vertexShader}`
  shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvAltitude = position.y;')
  shader.fragmentShader = `varying float vAltitude;\n${shader.fragmentShader}`
  shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
    #include <color_fragment>
    float snow = smoothstep(3.8, 7.0, vAltitude);
    vec3 rock = mix(vec3(0.035, 0.12, 0.075), vec3(0.20, 0.28, 0.22), clamp(vAltitude / 4.0, 0.0, 1.0));
    diffuseColor.rgb = mix(rock, vec3(0.76, 0.86, 0.82), snow);
    float contour = 1.0 - smoothstep(0.014, 0.04 + fwidth(vAltitude), abs(fract(vAltitude * 2.4) - 0.5));
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.43, 0.65, 0.48), contour * 0.24);
  `)
}

function TerrainWorld({ pointer, journey, stop, onSelect, night, animate }) {
  const world = useRef(null)
  const dust = useRef(null)
  const beacon = useRef(null)
  const hoverLight = useRef(null)
  const phase = useRef(0)
  const terrain = useMemo(() => createTerrain(), [])
  const selected = useMemo(() => trailPoint(trailStops[stop].progress), [stop])
  const route = useMemo(() => new CatmullRomCurve3(Array.from({ length: 90 }, (_, index) => new Vector3(...trailPoint(index / 89)))), [])
  const specks = useMemo(() => new Float32Array(Array.from({ length: 210 }, (_, index) => {
    const seed = Math.sin(index * 127.1 + 31.7) * 43758.5453
    const random = seed - Math.floor(seed)
    return index % 3 === 1 ? random * 9 + 1 : (random - 0.5) * 25
  })), [])

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05)
    const hovering = animate && pointer.current.active
    const scroll = animate ? journey.current : 0
    const targetX = 14.5 + (stop - 1) * 1.2 + (animate ? pointer.current.x * 4 : 0) - scroll * 5
    const targetY = 13.5 - (animate ? pointer.current.y * 2.5 : 0) + scroll * 4
    const orbitRadius = (hovering ? 30 : 28.5) + scroll * 2
    const targetZ = Math.sqrt(orbitRadius ** 2 - targetX ** 2 - targetY ** 2)
    camera.position.x = animate ? MathUtils.damp(camera.position.x, targetX, 2.5, dt) : targetX
    camera.position.y = animate ? MathUtils.damp(camera.position.y, targetY, 2.5, dt) : targetY
    camera.position.z = animate ? MathUtils.damp(camera.position.z, targetZ, 2.5, dt) : targetZ
    camera.lookAt(selected[0] * 0.09, 2.0, 0)
    if (animate) {
      phase.current += dt
      world.current.position.y = MathUtils.damp(world.current.position.y, (hovering ? 0.5 : 0) + Math.sin(phase.current * 0.5) * 0.12, 3, dt)
      world.current.rotation.y = MathUtils.damp(world.current.rotation.y, -0.2 + pointer.current.x * 0.3 + scroll * 0.65, 3, dt)
      world.current.rotation.x = MathUtils.damp(world.current.rotation.x, -pointer.current.y * 0.1 + scroll * 0.12, 3, dt)
      const scale = MathUtils.damp(world.current.scale.x, hovering ? 1.1 : 1.02, 3, dt)
      world.current.scale.setScalar(scale)
      hoverLight.current.position.x = MathUtils.damp(hoverLight.current.position.x, pointer.current.x * 9 - 2, 3, dt)
      hoverLight.current.position.z = MathUtils.damp(hoverLight.current.position.z, pointer.current.y * 6 + 4, 3, dt)
      dust.current.rotation.y = phase.current * 0.015
      beacon.current.scale.setScalar(1 + Math.sin(phase.current * 2.5) * 0.12)
    }
  })

  return (
    <>
      <fog attach="fog" args={[night ? '#062c2b' : '#133c2d', 30, 65]} />
      <hemisphereLight args={[night ? '#8ac5dd' : '#d8f0d5', '#15281e', night ? 1.6 : 2.4]} />
      <directionalLight position={[-8, 14, -6]} color={night ? '#a4c9ff' : '#ffca8c'} intensity={night ? 2.5 : 4} />
      <directionalLight position={[8, 6, 8]} color="#6cae96" intensity={1.4} />
      <pointLight ref={hoverLight} position={[-2, 12, 4]} color={night ? '#8fc5ff' : '#ffc88b'} intensity={65} distance={32} decay={2} />
      <group ref={world}>
        <mesh position={[0, -0.28, 0]} scale={[1, 1, 0.78]}>
          <cylinderGeometry args={[10.9, 10.9, 0.48, 96]} />
          <meshStandardMaterial color={night ? '#0d2529' : '#143528'} roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[terrain.positions, 3]} />
            <bufferAttribute attach="attributes-normal" args={[terrain.normals, 3]} />
            <bufferAttribute attach="index" args={[terrain.indices, 1]} />
          </bufferGeometry>
          <meshStandardMaterial onBeforeCompile={contourMaterial} customProgramCacheKey={() => 'alpine-contours-v1'} roughness={0.92} />
        </mesh>
        <mesh>
          <tubeGeometry args={[route, 180, 0.045, 5, false]} />
          <meshBasicMaterial color={night ? '#ffc879' : '#f59a50'} toneMapped={false} />
        </mesh>
        <mesh>
          <tubeGeometry args={[route, 180, 0.12, 5, false]} />
          <meshBasicMaterial color="#e6a15d" transparent opacity={0.14} depthWrite={false} toneMapped={false} />
        </mesh>
        {trailStops.map((item, index) => <group key={item.name} position={trailPoint(item.progress)} onClick={event => { event.stopPropagation(); onSelect(index) }}>
          <mesh position={[0, 0.1, 0]}><sphereGeometry args={[index === stop ? 0.2 : 0.13, 16, 12]} /><meshBasicMaterial color={index === stop ? '#fff2cb' : '#ed944b'} toneMapped={false} /></mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.3, 0.36, 32]} /><meshBasicMaterial color="#f4bc73" transparent opacity={index === stop ? 0.9 : 0.4} toneMapped={false} /></mesh>
          <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.018, 0.018, 1.1, 6]} /><meshBasicMaterial color="#dbd6ad" transparent opacity={0.5} /></mesh>
        </group>)}
        <group ref={beacon} position={trailPoint(trailStops[stop].progress)}>
          <mesh position={[0, 0.8, 0]}><sphereGeometry args={[0.5, 20, 16]} /><meshBasicMaterial color="#ffd89c" wireframe transparent opacity={0.18} depthWrite={false} toneMapped={false} /></mesh>
        </group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.53, 0]} scale={[1, 0.78, 1]}><ringGeometry args={[11.5, 11.52, 128]} /><meshBasicMaterial color="#a4c6a3" transparent opacity={0.25} /></mesh>
      </group>
      <points ref={dust}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[specks, 3]} /></bufferGeometry>
        <pointsMaterial color={night ? '#cee8ff' : '#f4dcaa'} size={0.035} transparent opacity={0.55} depthWrite={false} sizeAttenuation />
      </points>
    </>
  )
}

export default function AlpineScene() {
  const region = useRef(null)
  const pointer = useRef({ x: 0, y: 0, active: false })
  const journey = useRef(0)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const [paused, setPaused] = useState(false)
  const [night, setNight] = useState(false)
  const [stop, setStop] = useState(1)
  const reducedMotion = useSyncExternalStore(subscribeMotion, getReducedMotion)
  const animate = visible && pageVisible && !paused && !reducedMotion

  useEffect(() => {
    if (!animate) return
    const hero = region.current.closest('.hero')
    function onScroll() {
      const box = hero.getBoundingClientRect()
      journey.current = Math.max(0, Math.min(1, -box.top / box.height))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [animate])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.01 })
    observer.observe(region.current)
    const onVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])

  return (
    <div ref={region} className={`alpine-scene${night ? ' is-night' : ''}`} data-animated={animate} onPointerMove={event => {
      if (event.pointerType !== 'mouse') return
      const box = event.currentTarget.getBoundingClientRect()
      pointer.current.active = true
      pointer.current.x = (event.clientX - box.left) / box.width * 2 - 1
      pointer.current.y = (event.clientY - box.top) / box.height * 2 - 1
    }} onPointerLeave={() => { pointer.current.x = 0; pointer.current.y = 0; pointer.current.active = false }}>
      <div className="alpine-scene-heading"><span><i />Live alpine study</span><p className="scene-hint">{reducedMotion || paused ? 'Choose a checkpoint to explore' : 'Scroll or move to explore'}</p><button className="scene-motion" disabled={reducedMotion} aria-label={paused ? 'Resume 3D motion' : 'Pause 3D motion'} aria-pressed={paused || reducedMotion} onClick={() => setPaused(!paused)}>{reducedMotion ? 'Still view' : paused ? '▶' : 'Ⅱ'}</button></div>
      <div className="terrain-canvas" role="img" aria-label="Interactive three-dimensional alpine terrain with a glowing trail from the trailhead to the summit">
        <SceneBoundary><Canvas camera={{ position: [14.5, 13.5, 20], fov: 40, near: 0.1, far: 100 }} dpr={[1, 1.5]} frameloop={visible && pageVisible ? animate ? 'always' : 'demand' : 'never'} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} fallback={<div className="alpine-fallback">Explore the outdoors.</div>}>
          <TerrainWorld pointer={pointer} journey={journey} stop={stop} onSelect={setStop} night={night} animate={animate} />
        </Canvas></SceneBoundary>
      </div>
      <div className="alpine-readout" aria-live="polite"><span>0{stop + 1} / 03</span><div><strong>{trailStops[stop].name}</strong><p>{trailStops[stop].caption}</p></div><span className="terrain-compass">N ↗</span></div>
      <div className="alpine-controls"><div className="trail-stops" role="group" aria-label="Explore trail checkpoints">{trailStops.map((item, index) => <button key={item.name} aria-pressed={stop === index} onClick={() => setStop(index)}><span>0{index + 1}</span>{item.name}</button>)}</div><button className="scene-light" aria-pressed={night} onClick={() => setNight(!night)}>{night ? '☾ Moonlight' : '☼ Daybreak'}</button></div>
    </div>
  )
}
