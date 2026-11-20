import { useState } from "react";

import { bedienerAbmelden, passwortAendern } from "../../lib/anmeldungactions";
import { useAnmeldungStore } from "../../stores/useAnmeldungStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AnmeldeRahmen from "./AnmeldeRahmen";

/** Nach dem Startpasswort bzw. Zurücksetzen durch einen Admin muss das Passwort geändert werden. */
export default function PasswortAendern() {
    const benutzer = useAnmeldungStore((s) => s.benutzer);
    const [werte, setWerte] = useState({ alt: "", neu: "", wiederholung: "" });
    const [fehler, setFehler] = useState<string | null>(null);
    const [laeuft, setLaeuft] = useState(false);

    const absenden = async (e: React.FormEvent) => {
        e.preventDefault();
        if (werte.neu !== werte.wiederholung) {
            setFehler("Die neuen Passwörter stimmen nicht überein.");
            return;
        }
        setLaeuft(true);
        setFehler(null);
        try {
            await passwortAendern(benutzer?.hat_passwort ? werte.alt : null, werte.neu);
        } catch (err) {
            setFehler(err instanceof Error ? err.message : "Passwort konnte nicht gespeichert werden.");
        } finally {
            setLaeuft(false);
        }
    };

    return (
        <AnmeldeRahmen titel={`Hallo ${benutzer?.anzeigename ?? ""}`} untertitel="Bitte zuerst ein eigenes Passwort festlegen">
            {fehler && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{fehler}</p>}
            <form onSubmit={absenden} className="space-y-3">
                {benutzer?.hat_passwort && (
                    <label className="block space-y-1 text-sm font-medium">
                        <span>Aktuelles Passwort</span>
                        <Input className="h-11" type="password" autoComplete="current-password" required
                            value={werte.alt} onChange={(e) => setWerte({ ...werte, alt: e.target.value })} />
                    </label>
                )}
                <label className="block space-y-1 text-sm font-medium">
                    <span>Neues Passwort</span>
                    <Input className="h-11" type="password" autoComplete="new-password" required
                        value={werte.neu} onChange={(e) => setWerte({ ...werte, neu: e.target.value })} />
                </label>
                <label className="block space-y-1 text-sm font-medium">
                    <span>Wiederholen</span>
                    <Input className="h-11" type="password" autoComplete="new-password" required
                        value={werte.wiederholung} onChange={(e) => setWerte({ ...werte, wiederholung: e.target.value })} />
                </label>
                <Button type="submit" className="h-12 w-full text-base" disabled={laeuft}>Speichern</Button>
            </form>
            <Button variant="ghost" className="w-full" onClick={() => bedienerAbmelden()}>Abbrechen</Button>
        </AnmeldeRahmen>
    );
}
