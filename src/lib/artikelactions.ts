import { apiFetch } from "./api";
import type { KassenArtikelListe, KassenKategorie } from "../types/artikel";
import { KassenArtikelSchema } from "../types/artikel";



export async function getArtikels(kategorie: KassenKategorie) {
    const response = await apiFetch(`/kasse/artikels?artikelkategorie=${kategorie}`);

    if (!response.ok) {
        throw new Error(`Fehler beim Abrufen der Artikel für Kategorie ${kategorie}: ${response.statusText}`);
    }

    const data = await response.json();
    return KassenArtikelSchema.array().parse(data) as KassenArtikelListe;
}