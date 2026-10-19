import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogPortal, DialogTrigger, DialogOverlay, DialogContent} from "../ui/dialog";
import BezahlSchritt from "../bezahlen/bezahlenstep";
import type { BezahlenResponse } from "../../types/bezahlen";
import QuittungsSchritt from "../bezahlen/quittungsstep";

export default function BezahlButton() {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [schritt, setSchritt] = useState<"bezahlen" | "quittung">("bezahlen");
    const [bezahlData, setBezahlData] = useState<BezahlenResponse | null>(null);

    function handleOpenChange(nextOpen: boolean) {
        if (busy) return; // Dialog öffnen/verlassen verhindern, solange Bezahlt wird
        setOpen(nextOpen);
    }
    

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={
                <Button className="h-12 w-full rounded-xl bg-emerald-500 px-4 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-600">
                    Bezahlen
                </Button>
            } />
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="max-w-md">
                    {schritt === "bezahlen" ? ( <BezahlSchritt onBezahlt={(data) => {
                        setBezahlData(data);
                        setSchritt("quittung");
                    }} OnBusyChange={setBusy} />
                    ) : (
                    <QuittungsSchritt bezahlData={bezahlData!} onFertig={() => setOpen(false)} />
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}