// size: [width, height, depth]  — full dimensions in world units
// geometryType: 'box' | 'cone'  — Three.js geometry to use

export const BLOCK_TYPES = {
  // ── Foundation ───────────────────────────────────────────────────────────
  foundation_slab: {
    id: 'foundation_slab',
    name: 'Foundation Slab',
    category: 'Foundation',
    size: [1, 0.3, 1],
    color: '#8B7355',
    geometryType: 'box',
  },
  foundation_beam: {
    id: 'foundation_beam',
    name: 'Foundation Beam',
    category: 'Foundation',
    size: [1, 0.2, 1],
    color: '#6B5B45',
    geometryType: 'box',
  },

  // ── Walls ─────────────────────────────────────────────────────────────────
  wall_standard: {
    id: 'wall_standard',
    name: 'Standard Wall',
    category: 'Walls',
    size: [1, 2.5, 0.22],
    color: '#D2B48C',
    geometryType: 'box',
  },
  wall_thick: {
    id: 'wall_thick',
    name: 'Thick Wall',
    category: 'Walls',
    size: [1, 2.5, 0.45],
    color: '#C4A882',
    geometryType: 'box',
  },
  wall_pillar: {
    id: 'wall_pillar',
    name: 'Mansion Pillar',
    category: 'Walls',
    size: [0.38, 3, 0.38],
    color: '#F0EDE0',
    geometryType: 'box',
  },

  // ── Roofing ───────────────────────────────────────────────────────────────
  roof_flat: {
    id: 'roof_flat',
    name: 'Flat Roof Slab',
    category: 'Roofing',
    size: [1, 0.18, 1],
    color: '#7D6347',
    geometryType: 'box',
  },
  roof_peaked: {
    id: 'roof_peaked',
    name: 'Peaked Roof',
    category: 'Roofing',
    size: [1, 1.2, 1],
    color: '#8B2020',
    geometryType: 'cone',
    coneSegments: 4, // square-base pyramid
  },
  roof_tile: {
    id: 'roof_tile',
    name: 'Roof Tile',
    category: 'Roofing',
    size: [1, 0.12, 1],
    color: '#A0522D',
    geometryType: 'box',
  },

  // ── Windows ───────────────────────────────────────────────────────────────
  window_standard: {
    id: 'window_standard',
    name: 'Glass Window',
    category: 'Windows',
    size: [0.85, 0.85, 0.08],
    color: '#87CEEB',
    geometryType: 'box',
    transparent: true,
    opacity: 0.55,
  },
  window_tall: {
    id: 'window_tall',
    name: 'Tall Window',
    category: 'Windows',
    size: [0.7, 1.6, 0.08],
    color: '#9BD3E8',
    geometryType: 'box',
    transparent: true,
    opacity: 0.55,
  },
  window_arch: {
    id: 'window_arch',
    name: 'Arched Pane',
    category: 'Windows',
    size: [0.85, 1.2, 0.06],
    color: '#B0E0FF',
    geometryType: 'box',
    transparent: true,
    opacity: 0.5,
  },
}

export const CATEGORIES = ['Foundation', 'Walls', 'Roofing', 'Windows']

export const CATEGORY_ICONS = {
  Foundation: '🏗',
  Walls: '🧱',
  Roofing: '🏠',
  Windows: '🪟',
}
