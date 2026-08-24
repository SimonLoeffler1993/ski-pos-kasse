import { useWarenkorbTotalPreis } from "../../stores/useWarenkorbStore";

// warenkorb/preisanzeige.tsx
export default function Preisanzeige() {
    
    const totalPreis = useWarenkorbTotalPreis();

    return (
        <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3 shadow-sm">
            <span className="text-sm font-medium text-emerald-900/70">Gesamt</span>
            <span className="text-xl font-semibold text-emerald-900">
                {totalPreis.toFixed(2)} €
            </span>
        </div>
    )
}