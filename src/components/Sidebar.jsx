import { useState, useEffect } from 'react'
import { BLOCK_TYPES, CATEGORIES, CATEGORY_ICONS } from '../constants/blockTypes'
import { useBuildingStore } from '../store/buildingStore'

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return mobile
}

const S = {
  header: {
    padding: '14px 16px',
    background: '#0c0c18',
    borderBottom: '1px solid #1e2a3a',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#4fc3f7',
    letterSpacing: '0.5px',
  },
  headerSub: {
    marginTop: '3px',
    fontSize: '11px',
    color: '#5a6a7a',
    lineHeight: '1.4',
  },
  catBtn: (open) => ({
    width: '100%',
    padding: '11px 16px',
    background: open ? '#1a2540' : '#111827',
    color: open ? '#7ec8e3' : '#8a9bb0',
    border: 'none',
    borderBottom: '1px solid #1e2a3a',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
  }),
  catList: {
    padding: '6px 8px 10px',
    background: '#0e1420',
    borderBottom: '1px solid #1a2535',
  },
  blockBtn: (selected) => ({
    width: '100%',
    padding: '10px 10px',
    marginBottom: '4px',
    background: selected ? '#173050' : '#151e2d',
    color: selected ? '#e8f4fd' : '#aabbcc',
    border: `1px solid ${selected ? '#2979b5' : '#1e2d40'}`,
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    transition: 'background 0.12s, border-color 0.12s',
  }),
  swatch: (color, transparent) => ({
    width: '16px',
    height: '16px',
    background: color,
    borderRadius: '2px',
    flexShrink: 0,
    opacity: transparent ? 0.75 : 1,
    border: transparent ? '1px solid rgba(135,206,235,0.6)' : '1px solid rgba(0,0,0,0.2)',
  }),
  footer: {
    marginTop: 'auto',
    padding: '12px 14px',
    background: '#0c0c18',
    borderTop: '1px solid #1e2a3a',
    fontSize: '11px',
    color: '#4a6070',
    lineHeight: '1.7',
    flexShrink: 0,
  },
  clearBtn: {
    marginTop: '10px',
    width: '100%',
    padding: '10px',
    background: '#3a1010',
    color: '#ff7070',
    border: '1px solid #5a1515',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  deleteModeBtn: (active) => ({
    marginTop: '8px',
    width: '100%',
    padding: '10px',
    background: active ? '#3a1a00' : '#1a2030',
    color: active ? '#ff9944' : '#6a8aaa',
    border: `1px solid ${active ? '#7a3a00' : '#2a3a5a'}`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  }),
  blockCount: {
    marginTop: '6px',
    fontSize: '11px',
    color: '#3a6a4a',
  },
}

export default function Sidebar() {
  const { selectedType, setSelectedType, clearAll, blocks, deleteMode, toggleDeleteMode } = useBuildingStore()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  const [expanded, setExpanded] = useState({
    Foundation: true,
    Walls: false,
    Roofing: false,
    Windows: false,
  })

  const blocksByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = Object.values(BLOCK_TYPES).filter((b) => b.category === cat)
    return acc
  }, {})

  const toggleCategory = (cat) =>
    setExpanded((e) => ({ ...e, [cat]: !e[cat] }))

  const handleSelectBlock = (id) => {
    setSelectedType(selectedType === id ? null : id)
    if (isMobile) setOpen(false)
  }

  const panelStyle = isMobile
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '80vw',
        maxWidth: '300px',
        height: '100%',
        background: '#13131f',
        color: '#e0e0e0',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #1e2a3a',
        zIndex: 200,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
      }
    : {
        width: '240px',
        height: '100vh',
        background: '#13131f',
        color: '#e0e0e0',
        overflowY: 'auto',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #1e2a3a',
      }

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            position: 'fixed',
            top: '12px',
            left: '12px',
            zIndex: 300,
            width: '44px',
            height: '44px',
            background: 'rgba(10,16,28,0.92)',
            border: '1px solid #2979b5',
            borderRadius: '8px',
            color: '#7ec8e3',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {open ? '✕' : '☰'}
        </button>
      )}

      {/* Backdrop on mobile */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 199,
          }}
        />
      )}

      {/* Sidebar panel */}
      <div style={panelStyle}>
        <div style={S.header}>
          <div style={S.headerTitle}>TristanCraft</div>
          <div style={S.headerSub}>
            {isMobile
              ? 'Tap a block, then tap the ground to place it.'
              : 'Click a block to select it, then click the grid to place it.'}
          </div>
        </div>

        {CATEGORIES.map((cat) => (
          <div key={cat}>
            <button style={S.catBtn(expanded[cat])} onClick={() => toggleCategory(cat)}>
              <span>{CATEGORY_ICONS[cat]}</span>
              <span style={{ flex: 1 }}>{cat}</span>
              <span style={{ fontSize: '10px' }}>{expanded[cat] ? '▲' : '▼'}</span>
            </button>

            {expanded[cat] && (
              <div style={S.catList}>
                {blocksByCategory[cat].map((block) => (
                  <button
                    key={block.id}
                    style={S.blockBtn(selectedType === block.id)}
                    onClick={() => handleSelectBlock(block.id)}
                  >
                    <span style={S.swatch(block.color, block.transparent)} />
                    <span>{block.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={S.footer}>
          {isMobile ? (
            <>
              <div>Drag to orbit &nbsp;|&nbsp; Pinch to zoom</div>
              <div>Tap a block type, then tap the ground</div>
            </>
          ) : (
            <>
              <div><b style={{ color: '#6a9ab0' }}>Esc</b> — deselect block</div>
              <div><b style={{ color: '#6a9ab0' }}>Alt + Click</b> — remove block</div>
              <div><b style={{ color: '#6a9ab0' }}>Orbit</b> — drag / scroll to navigate</div>
            </>
          )}
          <div style={S.blockCount}>
            {blocks.length} block{blocks.length !== 1 ? 's' : ''} placed
          </div>
          <button style={S.deleteModeBtn(deleteMode)} onClick={toggleDeleteMode}>
            {deleteMode ? '🗑 Delete Mode ON — tap block to remove' : '🗑 Delete Mode'}
          </button>
          <button
            style={S.clearBtn}
            onClick={() => {
              if (window.confirm('Clear all blocks?')) clearAll()
            }}
          >
            Clear All
          </button>
        </div>
      </div>
    </>
  )
}
