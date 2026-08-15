import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { KassenArtikel } from '../types/artikel';

type WarenkorbItems = Record<number, KassenArtikel>;

type WarenkorbStore = {
    items: WarenkorbItems;
    addItem: (artikel: KassenArtikel) => void;
    removeItem: (itemId: number) => void;
    clearCart: () => void;
};

export const useWarenkorbStore = create<WarenkorbStore>()(
    immer((set) => ({
        items: {},
        addItem: (artikel) => set((state) => {
            state.items[artikel.id] = artikel;
        }),
        removeItem: (itemId) => set((state) => {
            delete state.items[itemId];
        }),
        clearCart: () => set((state) => {
            state.items = {};
        }),
    }))
);