import { useQuery } from "@tanstack/react-query";

import { kassenArtikelsOptions } from "../../hooks/useAuftragArtikelOptions";
import ArtikelKarte from "./artikelkarte";
import type { KassenKategorie } from "../../types/artikel";

type ArtikelgridProps = {
    kategorie: KassenKategorie;
};

export default function ArtikelListe({ kategorie }: ArtikelgridProps) {

    const { data, isPending, isError } = useQuery(kassenArtikelsOptions(kategorie as KassenKategorie));

    console.log("Kategorie:", kategorie);
    console.log("Artikel:", data);

    if (isPending) {
        return <h2>Lade Artikel...</h2>;
    }

    if (isError) {
        return <h2>Fehler beim Laden der Artikel.</h2>;
    }

    if (!data || data.length === 0) {
        return <h2>Keine Artikel gefunden.</h2>;
    }

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {data?.map((artikel) => (
                <ArtikelKarte
                    key={artikel.id}
                    artikel={artikel}
                />
            ))}             
        </div>
    );
}