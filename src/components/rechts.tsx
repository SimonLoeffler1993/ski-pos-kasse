// rechts.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import ArtikelListe from "./artikel/artikelliste";
import KundenSuche from "./artikel/kundensuche";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { kassenArtikelsOptions } from "../hooks/useAuftragArtikelOptions";
import { sichtbareArtikel } from "../lib/kundensuche";
import { useWarenkorbSchluessel } from "../stores/useWarenkorbStore";
import type { KassenKategorie } from "../types/artikel";

// id geht als artikelkategorie an die API, name ist die Beschriftung
const KATEGORIEN = [
    { id: "Auftrag", name: "Skiservice", akzent: "data-active:after:bg-sky-500", hintergrund: "bg-sky-100" },
    { id: "Verleih", name: "Verleih", akzent: "data-active:after:bg-amber-500", hintergrund: "bg-amber-100" },
    { id: "Handware", name: "Handware", akzent: "data-active:after:bg-emerald-500", hintergrund: "bg-emerald-100" },
] as const satisfies readonly { id: KassenKategorie; name: string; akzent: string; hintergrund: string }[];

// Treffer der Suche in einem Tab, die Daten kommen aus dem Cache der Liste
function useTreffer(kategorie: KassenKategorie, suche: string, imWarenkorb: Set<string>) {
    const { data } = useQuery(kassenArtikelsOptions(kategorie));
    return data ? sichtbareArtikel(data, suche, imWarenkorb).length : null;
}

export default function Rechts() {
    const [aktiv, setAktiv] = useState<KassenKategorie>(KATEGORIEN[0].id);
    // Suche nach Kunde oder Nummer, gilt für Skiservice und Verleih
    const [suche, setSuche] = useState("");
    const imWarenkorb = useWarenkorbSchluessel();
    const sucht = suche.trim() !== "";
    const treffer: Partial<Record<KassenKategorie, number | null>> = {
        Auftrag: useTreffer("Auftrag", suche, imWarenkorb),
        Verleih: useTreffer("Verleih", suche, imWarenkorb),
    };

    return (

        <Tabs
            value={aktiv}
            onValueChange={(wert) => setAktiv(wert as KassenKategorie)}
            className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white"
        >

            <div className="flex shrink-0 items-center justify-between gap-4 pr-3">
                <TabsList variant="line" className="h-14 shrink-0 gap-6 px-1">
                    {KATEGORIEN.map((kategorie) => {
                        const anzahl = treffer[kategorie.id];
                        return (
                            <TabsTrigger
                                key={kategorie.id}
                                value={kategorie.id}
                                className={`min-w-[120px] px-6 py-3 text-base font-semibold transition-colors after:top-[-6px] after:bottom-auto after:h-[3px] after:rounded-full ${kategorie.akzent}`}
                            >
                                {kategorie.name}
                                {sucht && anzahl != null && (
                                    <span className={`ml-1 font-normal ${anzahl === 0 ? "text-slate-400" : "text-slate-600"}`}>· {anzahl}</span>
                                )}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
                {/* Bei Handware steht in kundenname die Kategorie, dort keine Suche */}
                {aktiv !== "Handware" && <KundenSuche wert={suche} onChange={setSuche} />}
            </div>

            {KATEGORIEN.map((kategorie) => (
                <TabsContent
                    key={kategorie.id}
                    value={kategorie.id}
                    className={`min-h-0 flex-1 overflow-y-auto ${kategorie.hintergrund}`}
                >
                    <ArtikelListe kategorie={kategorie.id} suche={kategorie.id === "Handware" ? "" : suche} />
                </TabsContent>
            ))}
        </Tabs>
    )
}
