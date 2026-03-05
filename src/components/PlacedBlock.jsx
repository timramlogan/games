import { useBox } from '@react-three/cannon'
import { BLOCK_TYPES } from '../constants/blockTypes'
import { useBuildingStore } from '../store/buildingStore'

export default function PlacedBlock({ id, type, position }) {
  const blockType = BLOCK_TYPES[type]
  const removeBlock = useBuildingStore((s) => s.removeBlock)
  const selectedType = useBuildingStore((s) => s.selectedType)
  const deleteMode = useBuildingStore((s) => s.deleteMode)

  const isBuilding = !!selectedType

  const [ref] = useBox(() => ({
    mass: 0,
    type: 'Static',
    position,
    args: blockType.size,
  }))

  const handlePointerDown = (e) => {
    if (isBuilding) return
    if (e.altKey || deleteMode) {
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
