import { useQuery } from "@tanstack/react-query";

import { kassenArtikelsOptions } from "../../hooks/useAuftragArtikelOptions";
import ArtikelKarte from "./artikelkarte";
import type { KassenArtikel, KassenKategorie } from "../../types/artikel";

type ArtikelgridProps = {
    kategorie: KassenKategorie;
};

type Gruppe = { name: string; artikel: KassenArtikel[] };

// Handware nach Kategorie (steht in kundenname), alphabetisch, ohne Kategorie am Schluss
function nachKategorie(artikel: KassenArtikel[]): Gruppe[] {
    const gruppen = new Map<string, KassenArtikel[]>();
    for (const a of artikel) {
        const name = a.kundenname.trim();
        gruppen.set(name, [...(gruppen.get(name) ?? []), a]);
    }
    return [...gruppen.entries()]
        .sort(([a], [b]) => (a === "" ? 1 : b === "" ? -1 : a.localeCompare(b, "de")))
        .map(([name, liste]) => ({
            name: name || "Ohne Kategorie",
            artikel: [...liste].sort((x, y) => x.artikelname.localeCompare(y.artikelname, "de")),
        }));
}

function Raster({ artikel }: { artikel: KassenArtikel[] }) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {artikel.map((a) => (
                <ArtikelKarte key={a.id} artikel={a} />
            ))}
        </div>
    );
}

export default function ArtikelListe({ kategorie }: ArtikelgridProps) {

    const { data, isPending, isError } = useQuery(kassenArtikelsOptions(kategorie as KassenKategorie));

    if (isPending) {
        return <h2>Lade Artikel...</h2>;
    }

    if (isError) {
        return <h2>Fehler beim Laden der Artikel.</h2>;
    }

    if (!data || data.length === 0) {
        return <h2>Keine Artikel gefunden.</h2>;
    }

    if (kategorie !== "Handware") {
        return (
            <div className="p-4">
                <Raster artikel={data} />
            </div>
        );
    }

    const gruppen = nachKategorie(data);
    // Nur Artikel ohne Kategorie: keine Überschrift
    const mitUeberschrift = !(gruppen.length === 1 && gruppen[0].name === "Ohne Kategorie");

    return (
        <div className="flex flex-col gap-6 p-4">
            {gruppen.map((gruppe) => (
                <section key={gruppe.name} className="flex flex-col gap-3">
                    {mitUeberschrift && (
                        <h3 className="flex items-baseline gap-2 border-b border-emerald-200 pb-1 text-base font-semibold text-slate-700">
                            {gruppe.name}
                            <span className="text-sm font-normal text-slate-500">· {gruppe.artikel.length}</span>
                        </h3>
                    )}
                    <Raster artikel={gruppe.artikel} />
                </section>
            ))}
        </div>
    );
}
