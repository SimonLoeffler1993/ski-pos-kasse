import BezahlButton from "./warenkorb/bezahlbutton";
import Preisanzeige from "./warenkorb/preisanzeige";
import WarenkorbListe from "./warenkorb/warenkorbliste";

export default function Links() {
    return (
        <div className="links flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <Preisanzeige gesamt={123.45} />

            <div className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-xl bg-slate-50 p-2">
                <WarenkorbListe />
            </div>

            <div className="mt-4 flex-shrink-0">
                <BezahlButton />
            </div>
        </div>
    )
}