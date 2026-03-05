import { useBuildingStore } from '../store/buildingStore'
import { BLOCK_TYPES } from '../constants/blockTypes'

/**
 * Thin HUD bar overlaid on the canvas showing the currently selected block
 * and a quick-deselect button. Rendered as a DOM element on top of the canvas.
 */
export default function Toolbar() {
  const { selectedType, setSelectedType } = useBuildingStore()

  if (!selectedType) return null

  const bt = BLOCK_TYPES[selectedType]

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(10, 16, 28, 0.88)',
        border: '1px solid #2979b5',
        borderRadius: '8px',
        padding: '8px 18px',
        color: '#d0e8ff',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backdropFilter: 'blur(6px)',
        pointerEvents: 'auto',
        userSelect: 'none',
        zIndex: 10,
      }}
    >
      {/* Colour swatch */}
      <span
        style={{
          width: '14px',
          height: '14px',
          background: bt.color,
          borderRadius: '2px',
          opacity: bt.transparent ? 0.7 : 1,
          border: '1px solid rgba(255,255,255,0.2)',
          flexShrink: 0,
        }}
      />
      <span>
        Placing <strong style={{ color: '#7ec8e3' }}>{bt.name}</strong> — click
        grid to place &nbsp;|&nbsp; <kbd style={kbdStyle}>Esc</kbd> to deselect
      </span>
      <button
        onClick={() => setSelectedType(null)}
        style={{
          background: 'transparent',
          border: '1px solid #2a4a6a',
          borderRadius: '4px',
          color: '#5a8aaa',
          cursor: 'pointer',
          fontSize: '11px',
          padding: '2px 7px',
        }}
      >
        ✕
      </button>
    </div>
  )
}

const kbdStyle = {
  display: 'inline-block',
  padding: '1px 5px',
  background: '#1a2a3a',
  border: '1px solid #2a4a6a',
  borderRadius: '3px',
  fontSize: '11px',
  fontFamily: 'monospace',
}
