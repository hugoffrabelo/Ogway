'use client'

import { Suspense, useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import type { Mesh, Group, Points } from 'three'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function useIsDesktop() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setOk(mq.matches)
    const onChange = () => setOk(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return ok
}

/** tiny deterministic PRNG so the scatter looks intentional and never shifts */
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * The hero's focal object: a FACETED low-poly gold shell.
 * Intentionally angular — flat-shaded facets are the object's identity.
 */
function ShellForm({
  reduced,
  scroll,
}: {
  reduced: boolean
  scroll: React.MutableRefObject<number>
}) {
  const group = useRef<Group>(null)
  const { pointer } = useThree()
  const target = useRef({ x: 0.32, y: 0 })

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()

    const entrance = Math.min(1, t / 1.4)
    const ease = 1 - Math.pow(1 - entrance, 3)
    const s = 0.86 + ease * 0.14
    group.current.scale.setScalar(s)

    if (reduced) {
      group.current.rotation.set(0.32, 0.2, 0)
      group.current.position.y = 0
      return
    }

    const floatY = Math.sin(t * 0.5) * 0.06
    const baseYaw = t * 0.08
    target.current.y = baseYaw + pointer.x * 0.35
    target.current.x = 0.32 + -pointer.y * 0.18

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      target.current.y,
      3,
      delta,
    )
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      target.current.x + Math.sin(t * 0.3) * 0.03,
      3,
      delta,
    )
    group.current.position.y = floatY * ease - scroll.current * 0.4
  })

  return (
    <group ref={group} rotation={[0.32, 0, 0]}>
      {/* faceted low-poly shell dome — flat shading keeps the angular identity */}
      <mesh scale={[1, 0.6, 1]} castShadow>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          color="#c4a24c"
          metalness={0.85}
          roughness={0.38}
          envMapIntensity={1.05}
          flatShading
        />
      </mesh>
      {/* ceramic navy underbody peeking beneath — grounds the object */}
      <mesh scale={[0.9, 0.46, 0.9]} position={[0, -0.28, 0]}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#1e2e45"
          metalness={0.15}
          roughness={0.7}
          flatShading
        />
      </mesh>
    </group>
  )
}

type ShardCfg = {
  pos: [number, number, number]
  scale: number
  kind: 0 | 1 | 2
  spin: number
  phase: number
}

/**
 * Sparse faceted shards — lascas of the same material drifting near the object.
 * `depth` places the layer in front of or behind the shell for parallax.
 */
function Shards({
  reduced,
  scroll,
  count,
  depth,
  seed,
  opacity = 1,
}: {
  reduced: boolean
  scroll: React.MutableRefObject<number>
  count: number
  depth: number
  seed: number
  opacity?: number
}) {
  const group = useRef<Group>(null)
  const { pointer } = useThree()

  const shards = useMemo<ShardCfg[]>(() => {
    const rnd = mulberry32(seed)
    return Array.from({ length: count }, () => ({
      pos: [
        (rnd() - 0.5) * 5.6,
        (rnd() - 0.5) * 3.6,
        depth + (rnd() - 0.5) * 1.2,
      ],
      scale: 0.08 + rnd() * 0.16,
      kind: Math.floor(rnd() * 3) as 0 | 1 | 2,
      spin: 0.1 + rnd() * 0.3,
      phase: rnd() * Math.PI * 2,
    }))
  }, [count, depth, seed])

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    const px = reduced ? 0 : pointer.x
    const py = reduced ? 0 : pointer.y
    // layers further away parallax less; closer layers move more
    const par = depth < 0 ? 0.12 : 0.4
    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      px * par,
      3,
      delta,
    )
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      -py * par * 0.6 - scroll.current * (depth < 0 ? 0.15 : 0.7),
      3,
      delta,
    )
    group.current.children.forEach((child, i) => {
      const c = shards[i]
      if (!c) return
      if (!reduced) {
        child.rotation.x = t * c.spin + c.phase
        child.rotation.y = t * c.spin * 0.7 + c.phase
        child.position.y = c.pos[1] + Math.sin(t * 0.4 + c.phase) * 0.12
      }
    })
  })

  return (
    <group ref={group}>
      {shards.map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.scale}>
          {c.kind === 0 && <tetrahedronGeometry args={[1, 0]} />}
          {c.kind === 1 && <octahedronGeometry args={[1, 0]} />}
          {c.kind === 2 && <icosahedronGeometry args={[1, 0]} />}
          <meshStandardMaterial
            color="#c4a24c"
            metalness={0.8}
            roughness={0.4}
            envMapIntensity={1}
            flatShading
            transparent={opacity < 1}
            opacity={opacity}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Fine, sparse motes of light drifting slowly — discreet, never a starfield. */
function Motes({
  reduced,
  scroll,
}: {
  reduced: boolean
  scroll: React.MutableRefObject<number>
}) {
  const points = useRef<Points>(null)
  const COUNT = 90

  const geometry = useMemo(() => {
    const rnd = mulberry32(97)
    const positions = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (rnd() - 0.5) * 7
      positions[i * 3 + 1] = (rnd() - 0.5) * 4.4
      positions[i * 3 + 2] = (rnd() - 0.5) * 3
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [])

  useFrame((state, delta) => {
    if (!points.current) return
    const t = state.clock.getElapsedTime()
    if (!reduced) {
      points.current.rotation.y = t * 0.02
      points.current.position.y = THREE.MathUtils.damp(
        points.current.position.y,
        Math.sin(t * 0.15) * 0.1 - scroll.current * 0.3,
        3,
        delta,
      )
    }
  })

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        color="#d9c48a"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  )
}

function Scene({
  reduced,
  scroll,
}: {
  reduced: boolean
  scroll: React.MutableRefObject<number>
}) {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3.5, 5, 4]} intensity={2.1} color="#fff3d6" />
      <directionalLight
        position={[-4, 1.5, -2]}
        intensity={0.7}
        color="#9fb4d6"
      />

      {/* background layer — behind the shell, gentle parallax */}
      <Shards reduced={reduced} scroll={scroll} count={7} depth={-1.4} seed={11} />
      <Motes reduced={reduced} scroll={scroll} />

      <ShellForm reduced={reduced} scroll={scroll} />

      {/* foreground layer — softer/dimmer, stronger parallax for depth */}
      <Shards
        reduced={reduced}
        scroll={scroll}
        count={5}
        depth={1.6}
        seed={42}
        opacity={0.6}
      />

      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.4}
        scale={8}
        blur={3.4}
        far={3.2}
        color="#1e2e45"
      />
      <Environment resolution={256}>
        <Lightformer
          intensity={1.4}
          position={[0, 0, 5]}
          scale={[14, 14, 1]}
          color="#f4e4bf"
        />
        <Lightformer
          intensity={1.1}
          position={[0, 3, -3]}
          scale={[12, 8, 1]}
          color="#efdcae"
        />
        <Lightformer
          intensity={0.8}
          position={[0, -3, 2]}
          scale={[10, 8, 1]}
          color="#e8d3a4"
        />
        <Lightformer
          intensity={2.6}
          position={[3, 3, 3]}
          scale={[5, 5, 1]}
          color="#fff4d6"
        />
        <Lightformer
          intensity={1.2}
          position={[-4, 1, -2]}
          scale={[5, 5, 1]}
          color="#b6c6e2"
        />
      </Environment>
    </Suspense>
  )
}

export function Shell3D({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const isDesktop = useIsDesktop()
  const scroll = useRef(0)

  useEffect(() => {
    if (!isDesktop) return
    const onScroll = () => {
      // normalized 0..1 across the first viewport of scrolling
      scroll.current = Math.min(1, window.scrollY / (window.innerHeight || 1))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isDesktop])

  // Static, elegant fallback on small screens (no three.js load)
  if (!isDesktop) {
    return (
      <div className={className} aria-hidden="true">
        <div className="relative mx-auto h-40 w-40">
          <div className="absolute inset-0 rounded-full bg-accent/80 shadow-[0_20px_40px_-12px_rgba(30,46,69,0.45)]" />
          <div className="absolute inset-x-6 bottom-2 h-6 rounded-[100%] bg-primary/20 blur-md" />
        </div>
      </div>
    )
  }

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.6, 4.4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene reduced={reduced} scroll={scroll} />
      </Canvas>
    </div>
  )
}
