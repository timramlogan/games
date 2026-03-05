import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const TYPES = {
  cow:     { body: '#5C4033', legs: '#4a3028', speed: 1.4, bW: 1.0, bH: 0.7, bD: 1.4, hS: 0.65, lH: 0.55, lW: 0.22 },
  pig:     { body: '#F4A0A0', legs: '#e08888', speed: 1.9, bW: 0.85, bH: 0.6, bD: 1.1, hS: 0.6,  lH: 0.42, lW: 0.2  },
  sheep:   { body: '#D8D8D8', legs: '#9a8870', speed: 1.2, bW: 1.0, bH: 0.8, bD: 1.3, hS: 0.58, lH: 0.5,  lW: 0.2  },
  chicken: { body: '#FFFFFF', legs: '#E8C040', speed: 2.6, bW: 0.45, bH: 0.42, bD: 0.6, hS: 0.3, lH: 0.32, lW: 0.1  },
}

const BOUNDS = 44

function randomTarget() {
  return [
    (Math.random() - 0.5) * BOUNDS * 2,
    (Math.random() - 0.5) * BOUNDS * 2,
  ]
}

export default function Animal({ type = 'cow', startPosition = [0, 0, 0] }) {
  const cfg = TYPES[type]
  const groupRef = useRef()
  const target = useRef(randomTarget())
  const idle = useRef(false)
  const idleTime = useRef(0)
  const legT = useRef(Math.random() * Math.PI * 2)

  const flRef = useRef()
  const frRef = useRef()
  const blRef = useRef()
  const brRef = useRef()

  useFrame((_, delta) => {
    const g = groupRef.current
    if (!g) return

    if (idle.current) {
      idleTime.current -= delta
      if (idleTime.current <= 0) {
        idle.current = false
        target.current = randomTarget()
      }
      return
    }

    const [tx, tz] = target.current
    const dx = tx - g.position.x
    const dz = tz - g.position.z
    const dist = Math.sqrt(dx * dx + dz * dz)

    if (dist < 0.6) {
      idle.current = true
      idleTime.current = 1.5 + Math.random() * 3.5
      ;[flRef, frRef, blRef, brRef].forEach(r => { if (r.current) r.current.rotation.x = 0 })
      return
    }

    g.position.x += (dx / dist) * cfg.speed * delta
    g.position.z += (dz / dist) * cfg.speed * delta
    g.rotation.y = Math.atan2(dx, dz)

    legT.current += delta * cfg.speed * 4
    const sw = Math.sin(legT.current) * 0.55
    if (flRef.current) flRef.current.rotation.x =  sw
    if (frRef.current) frRef.current.rotation.x = -sw
    if (blRef.current) blRef.current.rotation.x = -sw
    if (brRef.current) brRef.current.rotation.x =  sw
  })

  const { bW, bH, bD, hS, lH, lW, body, legs } = cfg
  const bodyY  = lH + bH / 2
  const legPivotY = lH
  const xOff  = (bW / 2 - lW / 2) * 0.85
  const zOff  = (bD / 2 - lW)     * 0.75

  return (
    <group ref={groupRef} position={[startPosition[0], 0, startPosition[2]]}>
      {/* Body */}
      <mesh position={[0, bodyY, 0]} castShadow>
        <boxGeometry args={[bW, bH, bD]} />
        <meshStandardMaterial color={body} />
      </mesh>

      {/* Head */}
      <mesh position={[0, lH + bH + hS * 0.35, bD / 2]} castShadow>
        <boxGeometry args={[hS, hS, hS]} />
        <meshStandardMaterial color={body} />
      </mesh>

      {/* Front-left leg */}
      <group ref={flRef} position={[-xOff, legPivotY, zOff]}>
        <mesh position={[0, -lH / 2, 0]} castShadow>
          <boxGeometry args={[lW, lH, lW]} />
          <meshStandardMaterial color={legs} />
        </mesh>
      </group>

      {/* Front-right leg */}
      <group ref={frRef} position={[xOff, legPivotY, zOff]}>
        <mesh position={[0, -lH / 2, 0]} castShadow>
          <boxGeometry args={[lW, lH, lW]} />
          <meshStandardMaterial color={legs} />
        </mesh>
      </group>

      {/* Back-left leg */}
      <group ref={blRef} position={[-xOff, legPivotY, -zOff]}>
        <mesh position={[0, -lH / 2, 0]} castShadow>
          <boxGeometry args={[lW, lH, lW]} />
          <meshStandardMaterial color={legs} />
        </mesh>
      </group>

      {/* Back-right leg */}
      <group ref={brRef} position={[xOff, legPivotY, -zOff]}>
        <mesh position={[0, -lH / 2, 0]} castShadow>
          <boxGeometry args={[lW, lH, lW]} />
          <meshStandardMaterial color={legs} />
        </mesh>
      </group>
    </group>
  )
}
