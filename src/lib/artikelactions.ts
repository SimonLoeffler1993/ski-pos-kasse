import { API_URL } from "../config";
import type { KassenArtikelListe, KassenKategorie  } from "../types/artikel";
import { KassenArtikelSchema } from "../types/artikel";



export async function getArtikels(kategorie: KassenKategorie) {
    const response = await fetch(`${API_URL}/api/v1/kasse/artikels?artikelkategorie=${kategorie}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching artikel with ID ${kategorie}: ${response.statusText}`);
    }

    const data = await response.json();
    return KassenArtikelSchema.array().parse(data) as KassenArtikelListe;
}