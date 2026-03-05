import { useRef } from 'react'
import { useBox } from '@react-three/cannon'
import { BLOCK_TYPES } from '../constants/blockTypes'
import { useBuildingStore } from '../store/buildingStore'

/**
 * A single placed block in the scene.
 *
 * Physics: static Cannon.js box body (mass=0) — won't fall but participates
 * in the physics world so dynamic objects (future feature) can collide with it.
 *
 * Removal: Alt+Click removes the block.
 * When the user is in "build mode" (selectedType !== null) this block doesn't
 * intercept pointer events so clicks go through to the ground plane.
 */
export default function PlacedBlock({ id, type, position }) {
  const blockType = BLOCK_TYPES[type]
  const removeBlock = useBuildingStore((s) => s.removeBlock)
  const selectedType = useBuildingStore((s) => s.selectedType)

  const isBuilding = !!selectedType

  // Cannon.js static body — args are full dimensions (W, H, D)
  const [ref] = useBox(() => ({
    mass: 0,
    type: 'Static',
    position,
    args: blockType.size,
  }))

  const handlePointerDown = (e) => {
    if (isBuilding) return // let clicks fall through to the ground
    if (e.altKey) {
      e.stopPropagation()
      removeBlock(id)
    }
  }

  const isCone = blockType.geometryType === 'cone'

  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      // Disable raycasting entirely while in build mode so the ground
      // plane underneath can receive the pointer events cleanly.
      raycast={isBuilding ? () => null : undefined}
      onPointerDown={handlePointerDown}
    >
      {isCone ? (
        <coneGeometry
          args={[
            blockType.size[0] / 2,
            blockType.size[1],
            blockType.coneSegments ?? 4,
          ]}
        />
      ) : (
        <boxGeometry args={blockType.size} />
      )}
      <meshStandardMaterial
        color={blockType.color}
        transparent={!!blockType.transparent}
        opacity={blockType.transparent ? (blockType.opacity ?? 0.55) : 1}
        roughness={blockType.transparent ? 0.05 : 0.75}
        metalness={blockType.transparent ? 0.1 : 0.0}
        envMapIntensity={blockType.transparent ? 1.0 : 0.3}
      />
    </mesh>
  )
}
