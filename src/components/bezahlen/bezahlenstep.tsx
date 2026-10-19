import { DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

import type { Zahlungsart } from "./zahlart";
import { useWarenkorbStore, useWarenkorbTotalPreis } from "../../stores/useWarenkorbStore";
import { useBezahlen } from "../../hooks/useBezahlen";
import Rueckgeld from "./rueckgeld";
import Zahlart from "./zahlart";
import type { BezahlenResponse } from "../../types/bezahlen";


type BezahlSchrittProps = {
    onBezahlt: (data: BezahlenResponse) => void;
    OnBusyChange: (isBusy: boolean) => void;
};

export default function BezahlSchritt({ onBezahlt, OnBusyChange }: BezahlSchrittProps) {
    const [zahlungsart, setZahlungsart] = useState<Zahlungsart>("bar");
    const totalPreis = useWarenkorbTotalPreis();
    const artikels = useWarenkorbStore((state) => state.items);
    const clearWarenkorb = useWarenkorbStore((state) => state.clearCart);
    const artikelList = Object.values(artikels);
    const { mutate, isPending, isError, error, reset } = useBezahlen();

    useEffect(() => {
        OnBusyChange(isPending);
    }, [isPending, OnBusyChange]);

    function handleBezahlungBestaetigen() {
        // TODO: Bon erstellen / Auftrag abschließen, zahlungsart + ggf. gegebenNum übergeben
        console.log("Bezahlung bestätigt", zahlungsart);
        console.log("Artikel in Warenkorb:", artikels);

        mutate({
            artikels: artikelList,
            ueberweisung: zahlungsart === "ueberweisung",
            karte: zahlungsart === "ec",
            bar: zahlungsart === "bar"
        }, {
            onSuccess: (data) => {
                console.log("Bezahlung erfolgreich:", data);
                clearWarenkorb();
                onBezahlt(data);
                reset();
            },
            onError: (error) => {
                console.error("Fehler beim Bezahlen:", error);
            }
        });

    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Bezahlen</DialogTitle>
            </DialogHeader>

            {isError && (
                <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700" role="alert">
                    <span className="font-medium">Fehler:</span> {error instanceof Error ? error.message : "Unbekannter Fehler"}
                </div>
            )}

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
                    disabled={isPending || artikelList.length === 0}
                >
                    Zahlung bestätigen
                </Button>
                <DialogClose render={
                    <Button disabled={isPending} className="h-12 w-full rounded-xl bg-slate-200 px-4 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-300">
                        Abbrechen
                    </Button>
                } />
            </DialogFooter>
        </>
    )
}