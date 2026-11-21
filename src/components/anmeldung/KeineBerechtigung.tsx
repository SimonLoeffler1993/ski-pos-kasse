import { Users } from "lucide-react";

import { bedienerAbmelden } from "../../lib/anmeldungactions";
import { Button } from "../ui/button";
import AnmeldeRahmen from "./AnmeldeRahmen";

/** Angemeldet, aber ohne das Recht kasse.kassieren (Gruppen und Rollen im Center unter Verwalten → Benutzer). */
export default function KeineBerechtigung({ name }: { name: string }) {
    return (
        <AnmeldeRahmen titel={`Hallo ${name}`} untertitel="Keine Berechtigung zum Kassieren">
            <p className="text-center text-sm text-slate-500">
                Deinen Gruppen fehlt das Recht „Kasse bedienen“. Ein Admin kann es im Center unter Verwalten → Benutzer vergeben.
            </p>
            <Button className="h-12 w-full text-base" onClick={() => bedienerAbmelden()}>
                <Users /> Wechseln
            </Button>
        </AnmeldeRahmen>
    );
}
