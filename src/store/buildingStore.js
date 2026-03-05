import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBuildingStore = create(
  persist(
    (set, get) => ({
      blocks: [],
      selectedType: null,

      addBlock: (block) =>
        set((state) => ({ blocks: [...state.blocks, block] })),

      removeBlock: (id) =>
        set((state) => ({ blocks: state.blocks.filter((b) => b.id !== id) })),

      clearAll: () => set({ blocks: [] }),

      setSelectedType: (type) => set({ selectedType: type }),
    }),
    {
      name: 'construction-sandbox-v1',
      partialize: (state) => ({ blocks: state.blocks }),
    }
  )
)
