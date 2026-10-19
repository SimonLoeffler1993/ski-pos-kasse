// artikel/artikelkarte.tsx
import type { KassenArtikel } from "../../types/artikel";
import { Card } from "../ui/card";
import { useWarenkorbStore } from "../../stores/useWarenkorbStore";

type ArtikelKarteProps = {
    artikel: KassenArtikel;
};

export default function ArtikelKarte({ artikel }: ArtikelKarteProps) {
    const addItem = useWarenkorbStore((state) => state.addItem);
    // TODO #1 : Aufklappen um die einzelenen Details zu sehen
    return (
        <Card
            onClick={() => addItem(artikel)}
            className="p-4 cursor-pointer bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-md hover:border-primary transition-all select-none"
        >
            <p className="font-medium">{artikel.artikelname}</p>
            <p className="text-lg font-bold">{artikel.kundenname}</p>
            <p className="text-md font-semibold">
                {artikel.gesamtpreis.toFixed(2)} €
            </p>
        </Card>
    );
}