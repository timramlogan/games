import { useState, useCallback, useRef } from 'react'
import { Grid } from '@react-three/drei'
import { usePlane } from '@react-three/cannon'
import { v4 as uuidv4 } from 'uuid'
import { useBuildingStore } from '../store/buildingStore'
import { BLOCK_TYPES } from '../constants/blockTypes'

const GRID_SIZE = 100

export default function Ground() {
  const { selectedType, addBlock, blocks } = useBuildingStore()
  const [hoverCell, setHoverCell] = useState(null)
  const downData = useRef(null)

  const [physicsRef] = usePlane(() => ({
    type: 'Static',
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }))

  const getHeightAt = useCallback(
    (x, z) => {
      let maxTop = 0
      for (const block of blocks) {
        const bx = Math.round(block.position[0])
        const bz = Math.round(block.position[2])
        if (bx === x && bz === z) {
          const bt = BLOCK_TYPES[block.type]
          const top = block.position[1] + bt.size[1] / 2
          if (top > maxTop) maxTop = top
        }
      }
      return maxTop
    },
    [blocks]
  )

  const snapToGrid = (point) => ({
    x: Math.round(point.x),
    z: Math.round(point.z),
  })

  const handlePointerMove = (e) => {
    if (!selectedType) {
      if (hoverCell) setHoverCell(null)
      return
    }
    e.stopPropagation()
    const { x, z } = snapToGrid(e.point)
    setHoverCell((prev) =>
      prev && prev[0] === x && prev[1] === z ? prev : [x, z]
    )
  }

  const handlePointerLeave = () => setHoverCell(null)

  // Store the pointer-down data so we can check movement on pointer-up.
  // This lets OrbitControls drag-to-orbit without accidentally placing blocks.
  const handlePointerDown = (e) => {
    if (!selectedType) return
    if (e.button !== 0 && e.pointerType !== 'touch') return
    e.stopPropagation()
    downData.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      point: e.point.clone(),
    }
  }

  const handlePointerUp = (e) => {
    if (!selectedType || !downData.current) return
    const d = downData.current
    downData.current = null
    const moved = Math.hypot(e.clientX - d.clientX, e.clientY - d.clientY)
    if (moved > 8) return // was a drag (orbit), not a tap
    const { x, z } = snapToGrid(d.point)
    const bt = BLOCK_TYPES[selectedType]
    const y = getHeightAt(x, z) + bt.size[1] / 2
    addBlock({ id: uuidv4(), type: selectedType, position: [x, y, z] })
  }

  let ghost = null
  if (hoverCell && selectedType) {
    const [cx, cz] = hoverCell
    const bt = BLOCK_TYPES[selectedType]
    const gy = getHeightAt(cx, cz) + bt.size[1] / 2
    const isCone = bt.geometryType === 'cone'
    ghost = (
      <mesh position={[cx, gy, cz]}>
        {isCone ? (
          <coneGeometry args={[bt.size[0] / 2, bt.size[1], bt.coneSegments ?? 4]} />
        ) : (
          <boxGeometry args={bt.size} />
        )}
        <meshStandardMaterial
          color={bt.color}
          transparent
          opacity={0.38}
          depthWrite={false}
        />
      </mesh>
    )
  }

  return (
    <>
      <mesh ref={physicsRef} visible={false}>
        <planeGeometry args={[GRID_SIZE * 2, GRID_SIZE * 2]} />
        <meshBasicMaterial />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshStandardMaterial color="#2d5a1b" roughness={0.9} />
      </mesh>

      <Grid
        args={[GRID_SIZE, GRID_SIZE]}
        position={[0, 0.002, 0]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#3d7a2b"
        sectionSize={10}
        sectionThickness={0.9}
        sectionColor="#1e4a15"
        fadeDistance={70}
        fadeStrength={1.2}
        infiniteGrid={false}
      />

      {ghost}
    </>
  )
}
