import { useState, useCallback } from 'react'
import { Grid } from '@react-three/drei'
import { usePlane } from '@react-three/cannon'
import { v4 as uuidv4 } from 'uuid'
import { useBuildingStore } from '../store/buildingStore'
import { BLOCK_TYPES } from '../constants/blockTypes'

const GRID_SIZE = 100

/**
 * Ground component:
 *  - Invisible Cannon.js static plane for physics collisions
 *  - Visible grass-coloured plane with event handlers for block placement
 *  - @react-three/drei <Grid> overlay for the 1-unit cell grid
 *  - Semi-transparent ghost preview of the block-to-be-placed
 */
export default function Ground() {
  const { selectedType, addBlock, blocks } = useBuildingStore()
  const [hoverCell, setHoverCell] = useState(null) // [x, z] integers

  // ── Cannon physics plane (invisible) ──────────────────────────────────────
  // We attach the cannon ref to a separate invisible mesh so the physics body
  // exists independently of the visible/interactive ground mesh.
  const [physicsRef] = usePlane(() => ({
    type: 'Static',
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }))

  // ── Height-map helper ─────────────────────────────────────────────────────
  // Returns the Y coordinate of the top surface of the tallest block at (x,z).
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

  // ── Event helpers ─────────────────────────────────────────────────────────
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
    // Only update state when the cell actually changes (avoids unnecessary re-renders)
    setHoverCell((prev) =>
      prev && prev[0] === x && prev[1] === z ? prev : [x, z]
    )
  }

  const handlePointerLeave = () => setHoverCell(null)

  const handlePointerDown = (e) => {
    if (e.button !== 0 || !selectedType) return
    e.stopPropagation()
    const { x, z } = snapToGrid(e.point)
    const bt = BLOCK_TYPES[selectedType]
    const y = getHeightAt(x, z) + bt.size[1] / 2
    addBlock({ id: uuidv4(), type: selectedType, position: [x, y, z] })
  }

  // ── Ghost preview geometry ─────────────────────────────────────────────
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
      {/* ── Invisible physics ground ────────────────────────────────────── */}
      <mesh ref={physicsRef} visible={false}>
        <planeGeometry args={[GRID_SIZE * 2, GRID_SIZE * 2]} />
        <meshBasicMaterial />
      </mesh>

      {/* ── Visible interactive ground ──────────────────────────────────── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshStandardMaterial color="#2d5a1b" roughness={0.9} />
      </mesh>

      {/* ── Grid overlay ────────────────────────────────────────────────── */}
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

      {/* ── Ghost placement preview ─────────────────────────────────────── */}
      {ghost}
    </>
  )
}
