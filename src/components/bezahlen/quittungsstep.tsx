import { CheckCircle2, Receipt } from "lucide-react";
import type { BezahlenResponse } from "../../types/bezahlen";
import { Button } from "../ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { API_URL } from "../../config";

type QuittungsSchrittProps = {
    bezahlData: BezahlenResponse;
    onFertig: () => void;
    // onBusyChange: (isBusy: boolean) => void;
};

export default function QuittungsSchritt({ bezahlData, onFertig}: QuittungsSchrittProps) {

    function handleQuittung() {
        const quittungUrl = `${API_URL}/api/v1/quittungen/quittung/${bezahlData.quittung_id}/pdf`
        window.open(quittungUrl, "_blank", "noopener,noreferrer");
        onFertig()
    }

    return (
        <>
            <DialogHeader className="items-center text-center sm:text-center">
                <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="size-9 text-emerald-600" />
                </div>
                <DialogTitle className="text-2xl">Zahlung erfolgreich</DialogTitle>
                <DialogDescription>
                    Die Zahlung wurde verbucht.
                </DialogDescription>
            </DialogHeader>

            {/* Optional: Betrag aus der Response anzeigen, Feldnamen anpassen
            <div className="flex items-baseline justify-between rounded-xl bg-slate-900 px-5 py-4">
                <span className="text-sm font-medium text-slate-300">Bezahlt</span>
                <span className="text-3xl font-bold tabular-nums text-white">
                    {bezahlData.gesamtpreis.toFixed(2)} €
                </span>
            </div>
            */}

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Receipt className="size-5 shrink-0 text-slate-500" />
                <p className="text-base font-medium text-slate-700">
                    Wird eine Quittung benötigt?
                </p>
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-col">
                <Button
                    onClick={handleQuittung}
                    className="h-12 w-full rounded-xl bg-emerald-500 px-4 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                >
                    Ja, Quittung abholen
                </Button>
                <Button
                    onClick={onFertig}
                    className="h-12 w-full rounded-xl bg-slate-200 px-4 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-300"
                >
                    Nein, danke
                </Button>
            </DialogFooter>
        </>
    );
}