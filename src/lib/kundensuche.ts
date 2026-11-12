import { warenkorbKey } from "../stores/useWarenkorbStore";
import type { KassenArtikel } from "../types/artikel";

const klein = (text: string) => text.toLocaleLowerCase("de");

// Hintere Zahl der Nummer, z.B. 12 aus "25/26SV12"
function laufendeNummer(artikelname: string): number | null {
    const treffer = /(\d+)$/.exec(artikelname.trim());
    return treffer ? Number(treffer[1]) : null;
}

/**
 * Suche nach Kunde oder Nummer.
 * Nur Ziffern: die hintere Zahl der Nummer muss genau passen (Saison und Kürzel sind vorgegeben).
 * Sonst muss jedes Wort im Kundennamen oder in der Nummer vorkommen.
 */
export function passtZuSuche(artikel: KassenArtikel, suche: string): boolean {
    const text = suche.trim();
    if (text === "") return true;

    if (/^\d+$/.test(text)) {
        return laufendeNummer(artikel.artikelname) === Number(text);
    }

    const heuhaufen = klein(`${artikel.kundenname} ${artikel.artikelname}`);
    return klein(text)
        .split(/\s+/)
        .every((wort) => heuhaufen.includes(wort));
}

// Artikel für die Liste: Treffer der Suche, ohne Aufträge und Verleihe, die schon im Warenkorb liegen.
// Handware bleibt sichtbar, erneutes Antippen erhöht die Menge.
export function sichtbareArtikel(liste: KassenArtikel[], suche: string, imWarenkorb: Set<string>): KassenArtikel[] {
    return liste.filter(
        (artikel) => (artikel.handware || !imWarenkorb.has(warenkorbKey(artikel))) && passtZuSuche(artikel, suche),
    );
}
