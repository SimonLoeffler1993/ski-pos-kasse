// artikel/artikelkarte.tsx
import type { KassenArtikel } from "../../types/artikel";
import { Card } from "../ui/card";
import { useWarenkorbStore, warenkorbKey } from "../../stores/useWarenkorbStore";

type ArtikelKarteProps = {
    artikel: KassenArtikel;
};

export default function ArtikelKarte({ artikel }: ArtikelKarteProps) {
    const addItem = useWarenkorbStore((state) => state.addItem);
    // Menge im Warenkorb, als Badge auf der Karte
    const imWarenkorb = useWarenkorbStore((state) => state.items[warenkorbKey(artikel)]?.menge ?? 0);
    // TODO #1 : Aufklappen um die einzelenen Details zu sehen
    return (
        <Card
            onClick={() => addItem(artikel)}
            className="relative p-4 cursor-pointer bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-md hover:border-primary transition-all select-none"
        >
            {artikel.handware && imWarenkorb > 0 && (
                <span className="absolute bottom-3 right-3 flex min-w-7 items-center justify-center rounded-full bg-emerald-500 px-2 py-0.5 text-sm font-semibold text-white">
                    {imWarenkorb}×
                </span>
            )}
            {artikel.handware ? (
                <>
                    {/* Kategorie steht als Überschrift über der Gruppe */}
                    <p className="text-lg font-bold [overflow-wrap:break-word]">{artikel.artikelname}</p>
                </>
            ) : (
                <>
                    <p className="font-medium">{artikel.artikelname}</p>
                    <p className="text-lg font-bold">{artikel.kundenname}</p>
                </>
            )}
            <p className="text-md font-semibold">
                {artikel.gesamtpreis.toFixed(2)} €
            </p>
            {artikel.handware && artikel.bestand != null && (
                // Nur Hinweis, ein Verkauf ist immer möglich
                <p className={`text-sm ${artikel.bestand <= 0 ? "font-medium text-orange-600" : "text-slate-500"}`}>
                    Bestand: {artikel.bestand}
                </p>
            )}
        </Card>
    );
}
