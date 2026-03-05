import { useState } from 'react'
import { BLOCK_TYPES, CATEGORIES, CATEGORY_ICONS } from '../constants/blockTypes'
import { useBuildingStore } from '../store/buildingStore'

const S = {
  root: {
    width: '240px',
    height: '100vh',
    background: '#13131f',
    color: '#e0e0e0',
    overflowY: 'auto',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #1e2a3a',
  },
  header: {
    padding: '14px 16px',
    background: '#0c0c18',
    borderBottom: '1px solid #1e2a3a',
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
    padding: '9px 16px',
    background: open ? '#1a2540' : '#111827',
    color: open ? '#7ec8e3' : '#8a9bb0',
    border: 'none',
    borderBottom: '1px solid #1e2a3a',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '12px',
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
    padding: '7px 10px',
    marginBottom: '3px',
    background: selected ? '#173050' : '#151e2d',
    color: selected ? '#e8f4fd' : '#aabbcc',
    border: `1px solid ${selected ? '#2979b5' : '#1e2d40'}`,
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    transition: 'background 0.12s, border-color 0.12s',
  }),
  swatch: (color, transparent) => ({
    width: '14px',
    height: '14px',
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
  },
  clearBtn: {
    marginTop: '10px',
    width: '100%',
    padding: '7px',
    background: '#3a1010',
    color: '#ff7070',
    border: '1px solid #5a1515',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '600',
  },
  blockCount: {
    marginTop: '6px',
    fontSize: '11px',
    color: '#3a6a4a',
  },
}

export default function Sidebar() {
  const { selectedType, setSelectedType, clearAll, blocks } = useBuildingStore()
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

  const handleSelectBlock = (id) =>
    setSelectedType(selectedType === id ? null : id)

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.headerTitle}>Construction Sandbox</div>
        <div style={S.headerSub}>
          Click a block to select it, then click the grid to place it.
        </div>
      </div>

      {/* Categories */}
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

      {/* Footer */}
      <div style={S.footer}>
        <div>
          <b style={{ color: '#6a9ab0' }}>Esc</b> — deselect block
        </div>
        <div>
          <b style={{ color: '#6a9ab0' }}>Alt + Click</b> — remove block
        </div>
        <div>
          <b style={{ color: '#6a9ab0' }}>Orbit</b> — drag / scroll to navigate
        </div>
        <div style={S.blockCount}>
          {blocks.length} block{blocks.length !== 1 ? 's' : ''} placed (auto-saved)
        </div>
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
  )
}
