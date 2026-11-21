import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Anmeldung der Kasse. Die Kasse ist eine reine Browser-App: die Tokens liegen im localStorage.
// Die Bedienersitzung läuft in der API nach Inaktivität ab, die Gerätesitzung kann ein Admin im Center widerrufen.

export type KassenBenutzer = {
    id: number;
    anzeigename: string;
    // Rechte aus Gruppen -> Rollen, "*" = alle
    rechte: string[];
    passwort_aendern: boolean;
    hat_passwort: boolean;
};

export type AnmeldeAntwort = {
    geraet_token: string | null;
    bediener_token: string;
    benutzer: KassenBenutzer;
    geraet: { id: number; name: string; art: string; bediener_timeout_minuten: number };
};

type AnmeldungStore = {
    geraetToken: string | null;
    bedienerToken: string | null;
    benutzer: KassenBenutzer | null;
    geraetName: string | null;
    timeoutMinuten: number;
    sitzungUebernehmen: (antwort: AnmeldeAntwort) => void;
    benutzerAktualisieren: (benutzer: KassenBenutzer) => void;
    bedienerVergessen: () => void;
    allesVergessen: () => void;
};

export const useAnmeldungStore = create<AnmeldungStore>()(
    persist(
        (set) => ({
            geraetToken: null,
            bedienerToken: null,
            benutzer: null,
            geraetName: null,
            timeoutMinuten: 0,
            sitzungUebernehmen: (antwort) => set((state) => ({
                // Ohne neues Geräte-Token bleibt das vorhandene gültig (nur Bedienerwechsel)
                geraetToken: antwort.geraet_token ?? state.geraetToken,
                bedienerToken: antwort.bediener_token,
                benutzer: antwort.benutzer,
                geraetName: antwort.geraet.name,
                timeoutMinuten: antwort.geraet.bediener_timeout_minuten,
            })),
            benutzerAktualisieren: (benutzer) => set({ benutzer }),
            bedienerVergessen: () => set({ bedienerToken: null, benutzer: null }),
            allesVergessen: () => set({ geraetToken: null, bedienerToken: null, benutzer: null, geraetName: null }),
        }),
        { name: 'kasse-anmeldung' },
    ),
);
