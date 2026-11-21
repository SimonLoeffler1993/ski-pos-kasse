import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { bedienerAbmelden, fehlerText, holeStatus, oidcEinloesen, pruefeSitzung } from "../../lib/anmeldungactions";
import { gemerkterOidcGeraetName } from "../../lib/geraetname";
import { useAnmeldungStore } from "../../stores/useAnmeldungStore";
import AnmeldeFormular from "./AnmeldeFormular";
import AnmeldeRahmen from "./AnmeldeRahmen";
import BedienerAuswahl from "./BedienerAuswahl";
import PasswortAendern from "./PasswortAendern";
import KeineBerechtigung from "./KeineBerechtigung";

const AKTIVITAET = ["pointerdown", "keydown", "touchstart", "wheel"] as const;

/** Im Übergang ohne Pflicht: "Anmelden" in der Kopfzeile öffnet die Anmeldung über #anmelden. */
function useAnmeldenGewuenscht(): boolean {
    const [gewuenscht, setGewuenscht] = useState(() => window.location.hash === "#anmelden");
    useEffect(() => {
        const beiWechsel = () => setGewuenscht(window.location.hash === "#anmelden");
        window.addEventListener("hashchange", beiWechsel);
        return () => window.removeEventListener("hashchange", beiWechsel);
    }, []);
    return gewuenscht;
}

/** Rückkehr von der OIDC-Anmeldung: ?code= einlösen bzw. ?fehler= anzeigen, danach die URL säubern. */
function useOidcRueckkehr(): string | null {
    // ?fehler= gleich beim ersten Rendern lesen
    const [fehler, setFehler] = useState<string | null>(() => {
        const code = new URLSearchParams(window.location.search).get("fehler");
        return code ? fehlerText(code) : null;
    });
    const erledigt = useRef(false);
    useEffect(() => {
        if (erledigt.current) return;
        erledigt.current = true;
        const parameter = new URLSearchParams(window.location.search);
        const code = parameter.get("code");
        if (!code && !parameter.get("fehler")) return;
        window.history.replaceState(null, "", window.location.pathname);
        if (code) {
            oidcEinloesen(code, gemerkterOidcGeraetName())
                .catch((err: unknown) => setFehler(err instanceof Error ? err.message : "Anmeldung fehlgeschlagen."));
        }
    }, []);
    return fehler;
}

/**
 * Zeigt die Kasse nur mit Anmeldung bzw., solange die Anmeldung nicht erzwungen ist, auch ohne.
 * Ein angemeldetes Gerät verlangt immer einen Bediener. Nach Inaktivität zurück zur Bedienerauswahl.
 */
export default function AnmeldeSperre({ children }: { children: ReactNode }) {
    const { geraetToken, bedienerToken, benutzer, timeoutMinuten } = useAnmeldungStore();
    const queryClient = useQueryClient();
    const oidcFehler = useOidcRueckkehr();
    const anmeldenGewuenscht = useAnmeldenGewuenscht();
    const { data: status, isPending } = useQuery({ queryKey: ["authStatus"], queryFn: holeStatus, staleTime: 30_000, refetchInterval: 60_000 });

    // Sitzung regelmäßig prüfen: im Center abgemeldet oder in der API abgelaufen (ein 401 vergisst sie)
    useQuery({ queryKey: ["sitzung", bedienerToken], queryFn: pruefeSitzung, enabled: Boolean(bedienerToken), refetchInterval: 60_000, staleTime: 0 });

    // Beim Bedienerwechsel keine Daten des vorherigen Bedieners weiterverwenden
    useEffect(() => {
        queryClient.invalidateQueries({ predicate: (q) => !["authStatus", "sitzung", "kacheln"].includes(String(q.queryKey[0])) });
    }, [bedienerToken, queryClient]);

    // Nach dem Anmelden das #anmelden aus der Adresse nehmen
    useEffect(() => {
        if (bedienerToken && window.location.hash === "#anmelden") window.history.replaceState(null, "", window.location.pathname);
    }, [bedienerToken]);

    // Inaktivität: nach der eingestellten Zeit zurück zur Bedienerauswahl (0 = nie)
    useEffect(() => {
        if (!bedienerToken || !timeoutMinuten) return;
        let letzte = Date.now();
        const aktiv = () => { letzte = Date.now(); };
        AKTIVITAET.forEach((art) => window.addEventListener(art, aktiv, { passive: true }));
        const timer = window.setInterval(() => {
            if (Date.now() - letzte >= timeoutMinuten * 60_000) void bedienerAbmelden();
        }, 5_000);
        return () => {
            window.clearInterval(timer);
            AKTIVITAET.forEach((art) => window.removeEventListener(art, aktiv));
        };
    }, [bedienerToken, timeoutMinuten]);

    if (bedienerToken && benutzer?.passwort_aendern) return <PasswortAendern />;
    if (bedienerToken && benutzer && !benutzer.rechte?.includes("*") && !benutzer.rechte?.includes("kasse.kassieren")) {
        return <KeineBerechtigung name={benutzer.anzeigename} />;
    }
    if (bedienerToken) return <>{children}</>;
    if (geraetToken) return <BedienerAuswahl status={status} />;
    if (isPending) return <AnmeldeRahmen titel="Verbinde…">{null}</AnmeldeRahmen>;
    // Kasse ohne Anmeldung: im Übergang bzw. wenn die Gruppe "Ohne Anmeldung" kassieren darf
    const gastRechte = status?.ohne_anmeldung.rechte ?? [];
    const ohneAnmeldungErlaubt = !status?.anmeldung_erzwungen || gastRechte.includes("*") || gastRechte.includes("kasse.kassieren");
    if (!ohneAnmeldungErlaubt || oidcFehler || anmeldenGewuenscht) {
        return (
            <AnmeldeRahmen titel="Anmelden" untertitel="Einmal anmelden, danach bleibt die Kasse angemeldet">
                <AnmeldeFormular status={status} geraetAngemeldet={false} fehler={oidcFehler} />
            </AnmeldeRahmen>
        );
    }
    // Ohne Anmeldung nutzbar (Übergang bzw. Kassenrecht der Gruppe "Ohne Anmeldung")
    return <>{children}</>;
}
