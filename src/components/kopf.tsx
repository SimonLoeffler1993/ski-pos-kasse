// header.tsx
import { LogIn, UserRound, Users } from "lucide-react";

import { APP_NAME } from "../config";
import { bedienerAbmelden } from "../lib/anmeldungactions";
import { useAnmeldungStore } from "../stores/useAnmeldungStore";

export default function Kopf() {
    const benutzer = useAnmeldungStore((s) => s.benutzer);
    const geraetName = useAnmeldungStore((s) => s.geraetName);

    return (
        <header className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-medium">{APP_NAME}</h1>
            {benutzer ? (
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 text-sm">
                        <UserRound className="size-4" />
                        <span className="font-medium">{benutzer.anzeigename}</span>
                        {geraetName && <span className="text-green-100">· {geraetName}</span>}
                    </span>
                    <button type="button" onClick={() => bedienerAbmelden()}
                        className="flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25">
                        <Users className="size-4" /> Wechseln
                    </button>
                </div>
            ) : (
                <a href="#anmelden" className="flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25">
                    <LogIn className="size-4" /> Anmelden
                </a>
            )}
        </header>
    );
}
