import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'

function Knot() {
  const ref = useRef<Mesh>(null)
  useFrame((_, delta) => {
    const m = ref.current
    if (!m) return
    m.rotation.x += delta * 0.22
    m.rotation.y += delta * 0.34
  })
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1.05, 0.34, 180, 26]} />
      <meshStandardMaterial
        color="#d4af37"
        metalness={0.92}
        roughness={0.16}
        emissive="#3a2b06"
        emissiveIntensity={0.55}
      />
    </mesh>
  )
}

function Rings() {
  const ref = useRef<Group>(null)
  useFrame((_, delta) => {
    const g = ref.current
    if (!g) return
    g.rotation.z += delta * 0.12
    g.rotation.x += delta * 0.05
  })
  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
        <torusGeometry args={[2.05, 0.02, 16, 120]} />
        <meshStandardMaterial color="#14b8a6" emissive="#0b5f57" emissiveIntensity={0.9} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, -0.4, 0.6]}>
        <torusGeometry args={[2.45, 0.014, 16, 120]} />
        <meshStandardMaterial color="#f0c26b" emissive="#6b5420" emissiveIntensity={0.8} metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
  )
}

function Satellites() {
  const group = useRef<Group>(null)
  const items = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2
        return {
          pos: [Math.cos(a) * 2.7, Math.sin(a * 1.7) * 1.1, Math.sin(a) * 2.7] as [number, number, number],
          size: 0.05 + (i % 3) * 0.028,
          gold: i % 2 === 0,
        }
      }),
    [],
  )
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y -= delta * 0.18
  })
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos}>
          <sphereGeometry args={[it.size, 16, 16]} />
          <meshStandardMaterial
            color={it.gold ? '#d4af37' : '#14b8a6'}
            emissive={it.gold ? '#4a3608' : '#0a3f3a'}
            emissiveIntensity={1.1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

function Core() {
  const ref = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08
  })
  return (
    <mesh ref={ref} scale={2.5}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#14b8a6"
        wireframe
        transparent
        opacity={0.28}
        emissive="#0b4f49"
        emissiveIntensity={0.6}
      />
    </mesh>
  )
}

export default function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 4, 5]} intensity={60} color="#f0c26b" />
      <pointLight position={[-5, -3, 2]} intensity={45} color="#14b8a6" />
      <Core />
      <Rings />
      <Knot />
      <Satellites />
    </Canvas>
  )
}
