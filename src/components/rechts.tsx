// rechts.tsx
import ArtikelListe from "./artikel/artikelliste";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

export default function Rechts() {
    const kategorien = [
        { id: "ski", name: "Ski", akzent: "data-active:after:bg-sky-500", hintergrund: "bg-sky-100" },
        { id: "schuhe", name: "Schuhe", akzent: "data-active:after:bg-amber-500", hintergrund: "bg-amber-100" },
        { id: "zubehoer", name: "Zubehör", akzent: "data-active:after:bg-emerald-500", hintergrund: "bg-emerald-100" },
    ] as const;
    return (

        <Tabs defaultValue={kategorien[0].id} className="h-full flex flex-col">

            <TabsList variant="line" className="h-14 gap-6 px-1">
                {kategorien.map((kategorie) => (
                    <TabsTrigger
                        key={kategorie.id}
                        value={kategorie.id}
                        className={`min-w-[120px] px-6 py-3 text-base font-semibold transition-colors after:top-[-6px] after:bottom-auto after:h-[3px] after:rounded-full ${kategorie.akzent}`}
                    >
                        {kategorie.name}
                    </TabsTrigger>
                ))}
            </TabsList>

            {kategorien.map((kategorie) => (
                <TabsContent
                    key={kategorie.id}
                    value={kategorie.id}
                    className={`flex-1 min-h-0 overflow-y-auto ${kategorie.hintergrund}`}
                >
                    <ArtikelListe kategorie={kategorie.id} />
                </TabsContent>
            ))}
        </Tabs>
    )
}