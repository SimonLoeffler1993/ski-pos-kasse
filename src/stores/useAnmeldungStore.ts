import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Anmeldung der Kasse. Die Kasse ist eine reine Browser-App: die Tokens liegen im localStorage.
// Eine normale Anmeldung ist persönlich; erst "Kasse anmelden" (Recht geraete.anmelden) macht das Gerät dauerhaft.
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
    geraet: KassenGeraet;
};

// dauerhaft = über "Kasse anmelden" (Bedienerauswahl, PIN); sonst persönliche Anmeldung, die mit dem Bediener endet
export type KassenGeraet = { id: number; name: string; art: string; bediener_timeout_minuten: number; dauerhaft?: boolean };

type AnmeldungStore = {
    geraetToken: string | null;
    bedienerToken: string | null;
    benutzer: KassenBenutzer | null;
    geraetName: string | null;
    // Fehlt bei alten gespeicherten Sitzungen: die waren immer dauerhaft
    dauerhaft: boolean;
    timeoutMinuten: number;
    sitzungUebernehmen: (antwort: AnmeldeAntwort) => void;
    benutzerAktualisieren: (benutzer: KassenBenutzer) => void;
    geraetAktualisieren: (geraet: KassenGeraet) => void;
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
            dauerhaft: true,
            timeoutMinuten: 0,
            sitzungUebernehmen: (antwort) => set((state) => ({
                // Ohne neues Geräte-Token bleibt das vorhandene gültig (nur Bedienerwechsel)
                geraetToken: antwort.geraet_token ?? state.geraetToken,
                bedienerToken: antwort.bediener_token,
                benutzer: antwort.benutzer,
                geraetName: antwort.geraet.name,
                dauerhaft: antwort.geraet.dauerhaft ?? true,
                timeoutMinuten: antwort.geraet.bediener_timeout_minuten,
            })),
            benutzerAktualisieren: (benutzer) => set({ benutzer }),
            geraetAktualisieren: (geraet) => set({
                geraetName: geraet.name, dauerhaft: geraet.dauerhaft ?? true, timeoutMinuten: geraet.bediener_timeout_minuten,
            }),
            bedienerVergessen: () => set({ bedienerToken: null, benutzer: null }),
            allesVergessen: () => set({ geraetToken: null, bedienerToken: null, benutzer: null, geraetName: null, dauerhaft: true }),
        }),
        { name: 'kasse-anmeldung' },
    ),
);
