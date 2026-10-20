import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { KassenArtikel } from '../types/artikel';

// Aufträge und Verleihe können die gleiche ID haben, daher Kategorie im Schlüssel
export const warenkorbKey = (artikel: KassenArtikel) =>
    `${artikel.service ? "auftrag" : artikel.verleih ? "verleih" : "artikel"}-${artikel.id}`;

type WarenkorbItems = Record<string, KassenArtikel>;

type WarenkorbStore = {
    items: WarenkorbItems;
    addItem: (artikel: KassenArtikel) => void;
    removeItem: (key: string) => void;
    clearCart: () => void;
};

export const useWarenkorbStore = create<WarenkorbStore>()(
    immer((set) => ({
        items: {},
        addItem: (artikel) => set((state) => {
            state.items[warenkorbKey(artikel)] = artikel;
        }),
        removeItem: (key) => set((state) => {
            delete state.items[key];
        }),
        clearCart: () => set((state) => {
            state.items = {};
        }),
    }))
);

export const useWarenkorbTotalPreis = () =>
    useWarenkorbStore((state) =>
        Object.values(state.items).reduce((summe, item) => summe + item.gesamtpreis, 0)
    );