import { create } from 'zustand'
import { db } from '../firebase'
import { ref, onValue, set as dbSet, remove } from 'firebase/database'

const blocksRef = ref(db, 'blocks')

export const useBuildingStore = create((set, get) => ({
  blocks: [],
  selectedType: null,

  // Call once on app mount — keeps all clients in sync via Firebase
  subscribe: () => {
    const unsub = onValue(blocksRef, (snapshot) => {
      const data = snapshot.val()
      const blocks = data
        ? Object.values(data)
        : []
      set({ blocks })
    })
    return unsub
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
