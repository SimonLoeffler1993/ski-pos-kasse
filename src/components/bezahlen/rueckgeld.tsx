import { useState } from "react";
import { useWarenkorbTotalPreis } from "../../stores/useWarenkorbStore";

export default function Rueckgeld() {
    const totalPreis = useWarenkorbTotalPreis();
    const [gegeben, setGegeben] = useState<string>("");

    const gegebenNum = parseFloat(gegeben.replace(",", ".")) || 0;
    const rueckgeld = gegebenNum - totalPreis;

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-bold">Rückgeld</h2>

            <p className="text-lg">
                Zu zahlen: <span className="font-semibold">{totalPreis.toFixed(2)} €</span>
            </p>

            <p className="text-lg">Gegeben</p>
            <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={gegeben}
                onChange={(e) => setGegeben(e.target.value)}
                placeholder="Betrag eingeben"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-lg focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
            />

            {gegeben !== "" && (
                <p
                    className={`text-xl font-bold ${
                        rueckgeld < 0 ? "text-red-600" : "text-emerald-600"
                    }`}
                >
                    {rueckgeld < 0
                        ? `Fehlbetrag: ${Math.abs(rueckgeld).toFixed(2)} €`
                        : `Rückgeld: ${rueckgeld.toFixed(2)} €`}
                </p>
            )}
        </div>
    );
}