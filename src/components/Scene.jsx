import { useEffect } from 'react'
import { OrbitControls, Sky, ContactShadows } from '@react-three/drei'
import { useBuildingStore } from '../store/buildingStore'
import Ground from './Ground'
import PlacedBlock from './PlacedBlock'

/**
 * Main 3D scene.
 *
 * Contains:
 *  - OrbitControls (drag to orbit, scroll to zoom, right-drag to pan)
 *  - Lighting rig (directional sun + ambient + hemisphere)
 *  - Sky dome
 *  - Ground plane + grid
 *  - All placed blocks
 *  - Escape-key handler for deselecting the active block type
 */
export default function Scene() {
  const blocks = useBuildingStore((s) => s.blocks)
  const setSelectedType = useBuildingStore((s) => s.setSelectedType)

  // Escape → deselect active block type
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedType(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSelectedType])

  return (
    <>
      {/* ── Camera controls ─────────────────────────────────────────────── */}
      <OrbitControls
        makeDefault
        // Prevent orbiting from accidentally triggering block placement;
        // damping makes the camera feel smoother.
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={120}
        maxPolarAngle={Math.PI / 2 - 0.02} // don't go below ground
      />

      {/* ── Lighting ────────────────────────────────────────────────────── */}
      <ambientLight intensity={0.45} />
      <hemisphereLight
        skyColor="#87CEEB"
        groundColor="#2D5A1B"
        intensity={0.5}
      />
      <directionalLight
        position={[30, 50, 20]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />

      {/* ── Sky ─────────────────────────────────────────────────────────── */}
      <Sky
        sunPosition={[100, 30, 100]}
        turbidity={8}
        rayleigh={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* ── Ground + grid + ghost preview ───────────────────────────────── */}
      <Ground />

      {/* ── Soft contact shadows under the entire build area ────────────── */}
      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.25}
        scale={50}
        blur={2}
        far={10}
      />

      {/* ── Placed blocks ───────────────────────────────────────────────── */}
      {blocks.map((block) => (
        <PlacedBlock key={block.id} {...block} />
      ))}
    </>
  )
}
