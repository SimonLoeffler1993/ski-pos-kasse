import { useState } from "react";
import { KeyRound, LogIn } from "lucide-react";

import { anmelden, oidcStartUrl, type AuthStatus } from "../../lib/anmeldungactions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


/** Benutzername + Passwort (Standard), dazu der OIDC-Button, wenn eingerichtet. */
export default function AnmeldeFormular({ status, fehler: anfangsFehler }: {
    status: AuthStatus | undefined;
    fehler?: string | null;
}) {
    const [benutzername, setBenutzername] = useState("");
    const [passwort, setPasswort] = useState("");
    const [fehler, setFehler] = useState<string | null>(anfangsFehler ?? null);
    const [laeuft, setLaeuft] = useState(false);

    const absenden = async (e: React.FormEvent) => {
        e.preventDefault();
        setLaeuft(true);
        setFehler(null);
        try {
            await anmelden(benutzername.trim(), passwort);
        } catch (err) {
            setFehler(err instanceof Error ? err.message : "Anmeldung fehlgeschlagen.");
            setPasswort("");
        } finally {
            setLaeuft(false);
        }
    };

    const oidc = () => {
        window.location.href = oidcStartUrl();
    };

    return (
        <div className="space-y-4">
            {fehler && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{fehler}</p>}
            <form onSubmit={absenden} className="space-y-3">
                <label className="block space-y-1 text-sm font-medium">
                    <span>Benutzername</span>
                    <Input className="h-11" autoComplete="username" autoCapitalize="none" value={benutzername}
                        onChange={(e) => setBenutzername(e.target.value)} required autoFocus />
                </label>
                <label className="block space-y-1 text-sm font-medium">
                    <span>Passwort</span>
                    <Input className="h-11" type="password" autoComplete="current-password" value={passwort}
                        onChange={(e) => setPasswort(e.target.value)} required />
                </label>
                <Button type="submit" className="h-12 w-full text-base" disabled={laeuft || !benutzername || !passwort}>
                    <LogIn /> {laeuft ? "Anmelden…" : "Anmelden"}
                </Button>
            </form>
            {status?.oidc.aktiv && (
                <Button type="button" variant="outline" className="h-12 w-full text-base" onClick={oidc}>
                    <KeyRound /> {status.oidc.button_text}
                </Button>
            )}
        </div>
    );
}
