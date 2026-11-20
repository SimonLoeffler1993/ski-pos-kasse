import { useEffect, useState } from "react";
import { Delete } from "lucide-react";

import { cn } from "@/lib/utils";

const TASTEN = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const taste = "h-16 w-16 rounded-xl border bg-white text-2xl font-semibold shadow-sm active:bg-slate-100 disabled:opacity-50";

/** Großes Ziffernfeld für die Kasse, auch per Tastatur bedienbar. */
export default function PinFeld({ onFertig, sperren = false }: { onFertig: (pin: string) => void; sperren?: boolean }) {
    const [pin, setPin] = useState("");
    const fertig = (wert: string) => {
        if (wert.length >= 4 && !sperren) {
            onFertig(wert);
            setPin("");
        }
    };

    useEffect(() => {
        const beiTaste = (e: KeyboardEvent) => {
            if (sperren) return;
            if (/^\d$/.test(e.key)) setPin((alt) => (alt.length < 8 ? alt + e.key : alt));
            else if (e.key === "Backspace") setPin((alt) => alt.slice(0, -1));
            else if (e.key === "Enter") document.getElementById("pin-ok")?.click();
        };
        window.addEventListener("keydown", beiTaste);
        return () => window.removeEventListener("keydown", beiTaste);
    }, [sperren]);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex h-6 gap-3">
                {Array.from({ length: Math.max(4, pin.length) }).map((_, i) => (
                    <span key={i} className={cn("h-4 w-4 rounded-full border-2 border-green-600", i < pin.length && "bg-green-600")} />
                ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
                {TASTEN.map((t) => (
                    <button key={t} type="button" className={taste} disabled={sperren} onClick={() => setPin((a) => (a.length < 8 ? a + t : a))}>{t}</button>
                ))}
                <button type="button" className={taste} disabled={sperren || !pin} onClick={() => setPin((a) => a.slice(0, -1))} aria-label="Ziffer löschen">
                    <Delete className="mx-auto size-6" />
                </button>
                <button type="button" className={taste} disabled={sperren} onClick={() => setPin((a) => (a.length < 8 ? a + "0" : a))}>0</button>
                <button id="pin-ok" type="button" className={cn(taste, "bg-green-600 text-white active:bg-green-700")} disabled={sperren || pin.length < 4} onClick={() => fertig(pin)}>OK</button>
            </div>
        </div>
    );
}
