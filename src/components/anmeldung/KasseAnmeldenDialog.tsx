import { useState } from "react";
import { KeyRound, MonitorSmartphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { holeStatus, kasseDauerhaftAnmelden, kasseOidcUrl } from "../../lib/anmeldungactions";
import { useAnmeldungStore } from "../../stores/useAnmeldungStore";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

/**
 * "Kasse anmelden": macht die persönliche Anmeldung an dieser Kasse dauerhaft (Recht geraete.anmelden).
 * Bestätigt mit dem Passwort, Benutzer ohne Passwort über den OIDC-Anbieter.
 */
export default function KasseAnmeldenDialog({ offen, onOffen }: { offen: boolean; onOffen: (offen: boolean) => void }) {
    const benutzer = useAnmeldungStore((s) => s.benutzer);
    const geraetName = useAnmeldungStore((s) => s.geraetName);
    const { data: status } = useQuery({ queryKey: ["authStatus"], queryFn: holeStatus, staleTime: 30_000 });
    const [name, setName] = useState(geraetName ?? "");
    const [passwort, setPasswort] = useState("");
    const [fehler, setFehler] = useState<string | null>(null);
    const [laeuft, setLaeuft] = useState(false);
    const mitPasswort = benutzer?.hat_passwort ?? true;
    const oidcText = status?.oidc.aktiv ? status.oidc.button_text : null;

    const absenden = async (e: React.FormEvent) => {
        e.preventDefault();
        setLaeuft(true);
        setFehler(null);
        try {
            await kasseDauerhaftAnmelden(passwort, name);
            onOffen(false);
        } catch (err) {
            setFehler(err instanceof Error ? err.message : "Die Kasse konnte nicht angemeldet werden.");
            setPasswort("");
        } finally {
            setLaeuft(false);
        }
    };

    const mitAnbieter = async () => {
        setLaeuft(true);
        setFehler(null);
        try {
            window.location.href = await kasseOidcUrl(name);
        } catch (err) {
            setFehler(err instanceof Error ? err.message : "Bestätigung nicht möglich.");
            setLaeuft(false);
        }
    };

    return (
        <Dialog open={offen} onOpenChange={onOffen}>
            <DialogContent className="max-w-md">
                <form onSubmit={absenden} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><MonitorSmartphone className="size-5" /> Kasse anmelden</DialogTitle>
                        <DialogDescription>
                            Die Kasse bleibt danach angemeldet. Nach dem Abmelden oder zu langer Pause erscheint die
                            Bedienerauswahl, dort melden sich die Mitarbeiter mit Passwort oder PIN an.
                        </DialogDescription>
                    </DialogHeader>
                    {fehler && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{fehler}</p>}
                    <label className="block space-y-1 text-sm font-medium">
                        <span>Name der Kasse (optional)</span>
                        <Input className="h-11" maxLength={100} placeholder="z.B. Kasse vorne" value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </label>
                    {mitPasswort ? (
                        <label className="block space-y-1 text-sm font-medium">
                            <span>Dein Passwort zur Bestätigung</span>
                            <Input className="h-11" type="password" autoComplete="current-password" required
                                value={passwort} onChange={(e) => setPasswort(e.target.value)} />
                        </label>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {oidcText
                                ? "Dein Konto hat kein Passwort. Zur Bestätigung meldest du dich kurz erneut beim Anbieter an."
                                : "Dein Konto hat kein Passwort. Lege im Center unter „Mein Konto“ eines fest, um die Kasse anzumelden."}
                        </p>
                    )}
                    <DialogFooter>
                        {mitPasswort ? (
                            <Button type="submit" className="h-11" disabled={laeuft || !passwort}>
                                {laeuft ? "Wird angemeldet…" : "Kasse anmelden"}
                            </Button>
                        ) : oidcText && (
                            <Button type="button" className="h-11" disabled={laeuft} onClick={mitAnbieter}><KeyRound /> {oidcText}</Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
