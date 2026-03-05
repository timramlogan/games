import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Central state for the construction sandbox.
 *
 * Persisted keys (via zustand/middleware/persist + localStorage):
 *   - blocks: all placed blocks
 *
 * Transient keys (reset on page load):
 *   - selectedType: currently active block type id
 */
export const useBuildingStore = create(
  persist(
    (set, get) => ({
      // ── Persisted ───────────────────────────────────────────────────────
      blocks: [], // [{ id, type, position: [x,y,z] }]

      // ── Transient ───────────────────────────────────────────────────────
      selectedType: null,

      // ── Actions ─────────────────────────────────────────────────────────
      addBlock: (block) =>
        set((state) => ({ blocks: [...state.blocks, block] })),

      removeBlock: (id) =>
        set((state) => ({ blocks: state.blocks.filter((b) => b.id !== id) })),

      clearAll: () => set({ blocks: [] }),

      setSelectedType: (type) => set({ selectedType: type }),
    }),
    {
      name: 'construction-sandbox-v1',
      // Only persist blocks, not selectedType
      partialize: (state) => ({ blocks: state.blocks }),
    }
  )
)
