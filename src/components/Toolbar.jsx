import { useBuildingStore } from '../store/buildingStore'
import { BLOCK_TYPES } from '../constants/blockTypes'

const barStyle = {
  position: 'absolute',
  bottom: '18px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(10, 16, 28, 0.88)',
  borderRadius: '8px',
  padding: '10px 18px',
  color: '#d0e8ff',
  fontSize: '13px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backdropFilter: 'blur(6px)',
  pointerEvents: 'auto',
  userSelect: 'none',
  zIndex: 10,
  whiteSpace: 'nowrap',
}

const xBtn = {
  background: 'transparent',
  border: '1px solid #2a4a6a',
  borderRadius: '4px',
  color: '#5a8aaa',
  cursor: 'pointer',
  fontSize: '14px',
  padding: '4px 10px',
}

export default function Toolbar() {
  const { selectedType, setSelectedType, deleteMode, toggleDeleteMode } = useBuildingStore()

  if (deleteMode) {
    return (
      <div style={{ ...barStyle, border: '1px solid #7a3a00' }}>
        <span>🗑</span>
        <span>Delete Mode — tap any block to remove it</span>
        <button style={{ ...xBtn, borderColor: '#5a3010', color: '#cc7733' }} onClick={toggleDeleteMode}>
          ✕ Done
        </button>
      </div>
    )
  }

  if (!selectedType) return null

  const bt = BLOCK_TYPES[selectedType]

  return (
    <div style={{ ...barStyle, border: '1px solid #2979b5' }}>
      <span
        style={{
          width: '14px',
          height: '14px',
          background: bt.color,
          borderRadius: '2px',
          opacity: bt.transparent ? 0.7 : 1,
          border: '1px solid rgba(255,255,255,0.2)',
          flexShrink: 0,
          display: 'inline-block',
        }}
      />
      <span>
        Placing <strong style={{ color: '#7ec8e3' }}>{bt.name}</strong> — tap grid to place
      </span>
      <button style={xBtn} onClick={() => setSelectedType(null)}>
        ✕
      </button>
    </div>
  )
}
