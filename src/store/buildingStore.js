import { create } from 'zustand'
import { db } from '../firebase'
import { ref, onValue, set as dbSet, remove } from 'firebase/database'

const blocksRef = ref(db, 'blocks')

export const useBuildingStore = create((set) => ({
  blocks: [],
  selectedType: null,

  // Call once on app mount — Firebase pushes updates to all connected clients
  subscribe: () => {
    return onValue(blocksRef, (snapshot) => {
      const data = snapshot.val()
      set({ blocks: data ? Object.values(data) : [] })
    })
  },

  addBlock: (block) => {
    dbSet(ref(db, `blocks/${block.id}`), block)
  },

  removeBlock: (id) => {
    remove(ref(db, `blocks/${id}`))
  },

  clearAll: () => {
    dbSet(blocksRef, null)
  },

  setSelectedType: (type) => set({ selectedType: type }),
}))
