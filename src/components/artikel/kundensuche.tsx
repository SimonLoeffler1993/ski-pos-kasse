import { Search, X } from "lucide-react";

import { Input } from "../ui/input";

type KundenSucheProps = {
    wert: string;
    onChange: (wert: string) => void;
};

// Suche nach Kunde oder Nummer, wirkt auf Skiservice und Verleih
export default function KundenSuche({ wert, onChange }: KundenSucheProps) {
    return (
        <div className="relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
                type="search"
                value={wert}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Kunde oder Nummer…"
                aria-label="Nach Kunde oder Nummer suchen"
                maxLength={100}
                className="h-11 bg-white pl-10 pr-10 text-base md:text-base [&::-webkit-search-cancel-button]:appearance-none"
            />
            {wert && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    aria-label="Suche löschen"
                    className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
