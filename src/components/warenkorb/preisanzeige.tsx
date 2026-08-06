// warenkorb/preisanzeige.tsx
export default function Preisanzeige({ gesamt }: { gesamt: number }) {
    return (
        <div className="flex justify-between items-center px-2 py-3 border-b">
            <span className="text-sm text-muted-foreground">Gesamt</span>
            <span className="text-xl font-medium">
                {gesamt.toFixed(2)} €
            </span>
        </div>
    )
}