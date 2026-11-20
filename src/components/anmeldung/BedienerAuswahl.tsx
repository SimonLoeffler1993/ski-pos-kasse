import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, LogOut, UserRound } from "lucide-react";

import { geraetAbmelden, holeKacheln, pinAnmelden, type AuthStatus, type Kachel } from "../../lib/anmeldungactions";
import { useAnmeldungStore } from "../../stores/useAnmeldungStore";
import { Button } from "../ui/button";
import AnmeldeFormular from "./AnmeldeFormular";
import AnmeldeRahmen from "./AnmeldeRahmen";
import PinFeld from "./PinFeld";

/** Bedienerwechsel: Passwort als Standard, Kacheln mit PIN für alle, die sich eine PIN festgelegt haben. */
export default function BedienerAuswahl({ status }: { status: AuthStatus | undefined }) {
    const geraetName = useAnmeldungStore((s) => s.geraetName);
    const { data: kacheln = [] } = useQuery({ queryKey: ["kacheln"], queryFn: holeKacheln, staleTime: 0 });
    const [gewaehlt, setGewaehlt] = useState<Kachel | null>(null);
    const [fehler, setFehler] = useState<string | null>(null);
    const [laeuft, setLaeuft] = useState(false);

    const mitPin = async (pin: string) => {
        if (!gewaehlt) return;
        setLaeuft(true);
        setFehler(null);
        try {
            await pinAnmelden(gewaehlt.id, pin);
        } catch (err) {
            setFehler(err instanceof Error ? err.message : "Anmeldung fehlgeschlagen.");
        } finally {
            setLaeuft(false);
        }
    };

    if (gewaehlt) {
        return (
            <AnmeldeRahmen titel={gewaehlt.anzeigename} untertitel="PIN eingeben">
                <Button variant="ghost" onClick={() => { setGewaehlt(null); setFehler(null); }}><ArrowLeft /> Andere Person</Button>
                {fehler && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{fehler}</p>}
                <PinFeld onFertig={mitPin} sperren={laeuft} />
            </AnmeldeRahmen>
        );
    }

    return (
        <AnmeldeRahmen titel="Wer kassiert?" untertitel={geraetName ? `Kasse: ${geraetName}` : undefined}>
            {kacheln.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {kacheln.map((k) => (
                        <button key={k.id} type="button" onClick={() => setGewaehlt(k)}
                            className="flex h-20 flex-col items-center justify-center gap-1 rounded-xl border bg-white shadow-sm active:bg-slate-100">
                            <UserRound className="size-6 text-green-600" />
                            <span className="max-w-full truncate px-2 text-sm font-medium">{k.anzeigename}</span>
                        </button>
                    ))}
                </div>
            )}
            <AnmeldeFormular status={status} geraetAngemeldet />
            <div className="flex justify-end border-t pt-3">
                <Button variant="ghost" size="sm" onClick={() => window.confirm("Diese Kasse abmelden?") && geraetAbmelden()}>
                    <LogOut /> Kasse abmelden
                </Button>
            </div>
        </AnmeldeRahmen>
    );
}
