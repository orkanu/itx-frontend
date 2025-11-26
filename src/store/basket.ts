import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type BasketState = {
  count: number
  add: (n: number) => void
  set: (n: number) => void
}
// Persist basket count across page reloads in localStorage
const useBasketStore = create<BasketState>(
  persist(
    (set) => ({
      count: 0,
      add: (n: number) => set((s) => ({ count: s.count + n })),
    }),
    { name: 'basket-count' }
  )
)

export default useBasketStore
