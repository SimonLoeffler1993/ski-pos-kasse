import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { KassenArtikel } from '../types/artikel';

// Aufträge und Verleihe können die gleiche ID haben, daher Kategorie im Schlüssel
export const warenkorbKey = (artikel: KassenArtikel) =>
    `${artikel.service ? "auftrag" : artikel.verleih ? "verleih" : artikel.handware ? "handware" : "artikel"}-${artikel.id}`;

type WarenkorbItems = Record<string, KassenArtikel>;

type WarenkorbStore = {
    items: WarenkorbItems;
    addItem: (artikel: KassenArtikel) => void;
    removeItem: (key: string) => void;
    // Menge eines Handwarenartikels, unter 1 wird er entfernt
    setMenge: (key: string, menge: number) => void;
    clearCart: () => void;
};

export const useWarenkorbStore = create<WarenkorbStore>()(
    immer((set) => ({
        items: {},
        addItem: (artikel) => set((state) => {
            const key = warenkorbKey(artikel);
            // Handware erneut antippen erhöht die Menge
            if (artikel.handware && state.items[key]) {
                state.items[key].menge += 1;
                return;
            }
            state.items[key] = { ...artikel, menge: 1 };
        }),
        setMenge: (key, menge) => set((state) => {
            if (!state.items[key]) return;
            if (menge < 1) {
                delete state.items[key];
            } else {
                state.items[key].menge = menge;
            }
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
        Object.values(state.items).reduce((summe, item) => summe + item.gesamtpreis * item.menge, 0)
    );