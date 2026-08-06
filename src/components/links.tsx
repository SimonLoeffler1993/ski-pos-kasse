import BezahlButton from "./warenkorb/bezahlbutton";
import Preisanzeige from "./warenkorb/preisanzeige";
import WarenkorbListe from "./warenkorb/warenkorbliste";

export default function Links() {
    return (
        <div className="links flex flex-col h-full">
            <Preisanzeige gesamt={123.45} />
            <WarenkorbListe />
            <BezahlButton />
        </div>
    )
}