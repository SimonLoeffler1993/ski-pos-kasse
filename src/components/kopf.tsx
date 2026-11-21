// header.tsx
import { useState } from "react";
import { LogIn, LogOut, MonitorSmartphone, UserRound, Users } from "lucide-react";

import { APP_NAME } from "../config";
import { bedienerAbmelden } from "../lib/anmeldungactions";
import { useAnmeldungStore } from "../stores/useAnmeldungStore";
import KasseAnmeldenDialog from "./anmeldung/KasseAnmeldenDialog";

const KNOPF = "flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25";

export default function Kopf() {
    const benutzer = useAnmeldungStore((s) => s.benutzer);
    const geraetName = useAnmeldungStore((s) => s.geraetName);
    const dauerhaft = useAnmeldungStore((s) => s.dauerhaft);
    const [dialog, setDialog] = useState(false);
    const darfAnmelden = Boolean(benutzer?.rechte?.includes("*") || benutzer?.rechte?.includes("geraete.anmelden"));

    return (
        <header className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-medium">{APP_NAME}</h1>
            {benutzer ? (
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 text-sm">
                        <UserRound className="size-4" />
                        <span className="font-medium">{benutzer.anzeigename}</span>
                        {geraetName && dauerhaft && <span className="text-green-100">· {geraetName}</span>}
                    </span>
                    {!dauerhaft && darfAnmelden && (
                        <button type="button" onClick={() => setDialog(true)} className={KNOPF}
                            title="Kasse dauerhaft anmelden: danach Bedienerauswahl mit PIN">
                            <MonitorSmartphone className="size-4" /> Kasse anmelden
                        </button>
                    )}
                    <button type="button" onClick={() => bedienerAbmelden()} className={KNOPF}>
                        {dauerhaft ? <><Users className="size-4" /> Wechseln</> : <><LogOut className="size-4" /> Abmelden</>}
                    </button>
                    {!dauerhaft && darfAnmelden && <KasseAnmeldenDialog key={String(dialog)} offen={dialog} onOffen={setDialog} />}
                </div>
            ) : (
                <a href="#anmelden" className={KNOPF}>
                    <LogIn className="size-4" /> Anmelden
                </a>
            )}
        </header>
    );
}
