// artikel/artikelkarte.tsx
import { Card } from "../ui/card";

type ArtikelKarteProps = {
    name: string;
    preis: number;
    onHinzufuegen: () => void;
};

export default function ArtikelKarte({ name, preis, onHinzufuegen }: ArtikelKarteProps) {
    return (
        <Card
            onClick={onHinzufuegen}
            className="p-4 cursor-pointer bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-md hover:border-primary transition-all select-none"
        >
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">
                {preis.toFixed(2)} €
            </p>
        </Card>
    );
}