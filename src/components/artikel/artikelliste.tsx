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
        return <p>Lade Artikel...</p>;
    }

    if (isError) {
        return <p>Fehler beim Laden der Artikel.</p>;
    }

    if (!data || data.length === 0) {
        return <p>Keine Artikel gefunden.</p>;
    }

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            <p>{kategorie}</p>
            {data?.map((artikel) => (
                <ArtikelKarte
                    key={artikel.id}
                    name={artikel.kundenname}
                    preis={artikel.gesamtpreis}
                    onHinzufuegen={() => {}}
                />
            ))}             
        </div>
    );
}