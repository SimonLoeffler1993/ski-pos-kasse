import { Banknote, CreditCard, Landmark } from "lucide-react";

export type Zahlungsart = "bar" | "ec" | "ueberweisung";

type ZahlartProps = {
    zahlungsart: Zahlungsart;
    onZahlungsartChange: (zahlungsart: Zahlungsart) => void;
};

export default function Zahlart({ zahlungsart, onZahlungsartChange }: ZahlartProps) {

    function handleZahlungsartBar() {
        onZahlungsartChange("bar");
    }

    function handleZahlungsartEc() {
        onZahlungsartChange("ec");
    }

    function handleZahlungsartUeberweisung() {
        onZahlungsartChange("ueberweisung");
    }

    return (
        <div className="grid grid-cols-3 gap-2">
            <button
                onClick={handleZahlungsartBar}
                className={`flex h-20 flex-col items-center justify-center gap-1.5 rounded-xl border-2 text-sm font-semibold transition ${zahlungsart === "bar"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                    }`}
            >
                <Banknote className="h-6 w-6" strokeWidth={2} />
                Bar
            </button>
            <button
                onClick={handleZahlungsartEc}
                className={`flex h-20 flex-col items-center justify-center gap-1.5 rounded-xl border-2 text-sm font-semibold transition ${zahlungsart === "ec"
                    ? "border-amber-400 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                    }`}
            >
                <CreditCard className="h-6 w-6" strokeWidth={2} />
                EC
            </button>
            <button
                onClick={handleZahlungsartUeberweisung}
                className={`flex h-20 flex-col items-center justify-center gap-1.5 rounded-xl border-2 text-xs font-medium transition ${zahlungsart === "ueberweisung"
                    ? "border-slate-400 bg-slate-100 text-slate-600"
                    : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50"
                    }`}
            >
                <Landmark className="h-5 w-5" strokeWidth={2} />
                Überweisung
            </button>
        </div>
    );
}