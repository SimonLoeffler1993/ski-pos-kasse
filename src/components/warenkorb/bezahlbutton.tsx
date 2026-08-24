import { useState } from "react";
import Rueckgeld from "../bezahlen/rueckgeld";
import Zahlart, { type Zahlungsart } from "../bezahlen/zahlart";
import { useWarenkorbTotalPreis } from "../../stores/useWarenkorbStore";
import { Button } from "../ui/button";
import { Dialog, DialogPortal, DialogTrigger, DialogOverlay, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../ui/dialog";

export default function BezahlButton() {
    const [zahlungsart, setZahlungsart] = useState<Zahlungsart>("bar");
    const totalPreis = useWarenkorbTotalPreis();

    function handleBezahlungBestaetigen() {
        // TODO: Bon erstellen / Auftrag abschließen, zahlungsart + ggf. gegebenNum übergeben
    }

    return (
        <Dialog>
            <DialogTrigger render={
                <Button className="h-12 w-full rounded-xl bg-emerald-500 px-4 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-600">
                    Bezahlen
                </Button>
            } />
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Bezahlen</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-5">
                        <div className="flex items-baseline justify-between rounded-xl bg-slate-900 px-5 py-4">
                            <span className="text-sm font-medium text-slate-300">Gesamtbetrag</span>
                            <span className="text-3xl font-bold tabular-nums text-white">
                                {totalPreis.toFixed(2)} €
                            </span>
                        </div>

                        <Zahlart zahlungsart={zahlungsart} onZahlungsartChange={setZahlungsart} />

                        {zahlungsart === "bar" && <Rueckgeld />}
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:flex-col">
                        <Button
                            onClick={handleBezahlungBestaetigen}
                            className="h-12 w-full rounded-xl bg-emerald-500 px-4 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                        >
                            Zahlung bestätigen
                        </Button>
                        <DialogClose render={
                            <Button className="h-12 w-full rounded-xl bg-slate-200 px-4 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-300">
                                Abbrechen
                            </Button>
                        } />
                    </DialogFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}