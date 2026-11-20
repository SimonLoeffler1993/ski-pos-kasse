import { z } from "zod";

import { API_URL } from "../config";
import { useAnmeldungStore, type AnmeldeAntwort, type KassenBenutzer } from "../stores/useAnmeldungStore";
import { apiFetch, fehlerAus } from "./api";

export const AuthStatusSchema = z.object({
    einrichtung_noetig: z.boolean(),
    anmeldung_erzwungen: z.boolean(),
    pin_erlaubt: z.boolean(),
    oidc: z.object({ aktiv: z.boolean(), anbieter: z.string(), button_text: z.string() }),
});
export type AuthStatus = z.infer<typeof AuthStatusSchema>;

export type Kachel = { id: number; anzeigename: string };

// Fehlercodes der API als Text
const TEXTE: Record<string, string> = {
    falsche_anmeldedaten: "Benutzername, Passwort oder PIN ist falsch.",
    freigabe_ausstehend: "Dein Konto wartet auf die Freigabe durch einen Admin.",
    gesperrt: "Dein Konto ist deaktiviert.",
    pin_aus: "Die Anmeldung mit PIN ist ausgeschaltet.",
    code_ungueltig: "Die Anmeldung ist abgelaufen. Bitte erneut versuchen.",
    abgebrochen: "Die Anmeldung beim Anbieter wurde abgebrochen.",
    oidc_aus: "Die Anmeldung über den Anbieter ist ausgeschaltet.",
    mandant_nicht_erlaubt: "Konten dieser Organisation sind nicht zugelassen.",
    anbieter_nicht_erreichbar: "Der Anmelde-Anbieter ist nicht erreichbar.",
    passwort_falsch: "Das aktuelle Passwort ist falsch.",
    oidc: "Die Anmeldung über den Anbieter ist fehlgeschlagen.",
};

export function fehlerText(code: string | null | undefined, gesperrtBis?: string | null): string {
    if (!code) return "";
    if (code === "gesperrt_bis") {
        const zeit = gesperrtBis ? new Date(gesperrtBis).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) : null;
        return zeit ? `Zu viele Fehlversuche. Gesperrt bis ${zeit} Uhr.` : "Zu viele Fehlversuche. Bitte später erneut versuchen.";
    }
    return TEXTE[code] ?? code;
}

async function anmeldeAntwort(response: Response): Promise<KassenBenutzer> {
    if (!response.ok) {
        const fehler = await fehlerAus(response, "Anmeldung fehlgeschlagen.");
        throw new Error(fehlerText(fehler.detail, response.headers.get("X-Gesperrt-Bis")) || fehler.message);
    }
    const daten = (await response.json()) as AnmeldeAntwort;
    useAnmeldungStore.getState().sitzungUebernehmen(daten);
    return daten.benutzer;
}

export async function holeStatus(): Promise<AuthStatus> {
    const response = await fetch(`${API_URL}/api/v1/auth/status`);
    if (!response.ok) throw new Error("Server nicht erreichbar.");
    return AuthStatusSchema.parse(await response.json());
}

export async function anmelden(benutzername: string, passwort: string, geraetName?: string): Promise<KassenBenutzer> {
    const { geraetToken, geraetName: bisherigerName } = useAnmeldungStore.getState();
    const response = await apiFetch("/auth/anmelden", {
        method: "POST",
        body: JSON.stringify({ benutzername, passwort, geraet_name: geraetName || null, geraet_art: "kasse" }),
    }, { nurGeraet: true });
    if (response.status === 401 && geraetToken) {
        const detail = await response.clone().json().then((d) => d?.detail).catch(() => null);
        if (detail === "anmeldung_noetig") {
            // Gerätesitzung ungültig (z.B. im Center abgemeldet): als neues Gerät anmelden
            return anmelden(benutzername, passwort, bisherigerName ?? "Kasse");
        }
    }
    return anmeldeAntwort(response);
}

export async function holeKacheln(): Promise<Kachel[]> {
    const response = await apiFetch("/auth/kacheln", {}, { nurGeraet: true });
    if (!response.ok) return [];
    return (await response.json()) as Kachel[];
}

export async function pinAnmelden(benutzerId: number, pin: string): Promise<KassenBenutzer> {
    const response = await apiFetch("/auth/pin", { method: "POST", body: JSON.stringify({ benutzer_id: benutzerId, pin }) }, { nurGeraet: true });
    return anmeldeAntwort(response);
}

export async function oidcEinloesen(code: string, geraetName?: string): Promise<KassenBenutzer> {
    const response = await apiFetch("/auth/oidc/einloesen", {
        method: "POST",
        body: JSON.stringify({ code, geraet_name: geraetName || null, geraet_art: "kasse" }),
    }, { nurGeraet: true });
    return anmeldeAntwort(response);
}

/** Startet die OIDC-Anmeldung; die API kommt mit ?code= bzw. ?fehler= auf die Kasse zurück. */
export function oidcStartUrl(): string {
    const ziel = `${window.location.origin}/`;
    return `${API_URL}/api/v1/auth/oidc/start?ziel=${encodeURIComponent(ziel)}`;
}

export async function bedienerAbmelden(): Promise<void> {
    await apiFetch("/auth/bediener/abmelden", { method: "POST" }).catch(() => null);
    useAnmeldungStore.getState().bedienerVergessen();
}

export async function geraetAbmelden(): Promise<void> {
    await apiFetch("/auth/abmelden", { method: "POST" }, { nurGeraet: true }).catch(() => null);
    useAnmeldungStore.getState().allesVergessen();
}

/** Prüft die Sitzung (ein 401 vergisst sie in apiFetch). */
export async function pruefeSitzung(): Promise<boolean> {
    const response = await apiFetch("/auth/ich");
    if (!response.ok) return false;
    const daten = await response.json();
    if (daten?.benutzer) useAnmeldungStore.getState().benutzerAktualisieren(daten.benutzer);
    return Boolean(daten?.benutzer);
}

export async function passwortAendern(alt: string | null, neu: string): Promise<void> {
    const response = await apiFetch("/auth/ich/passwort", { method: "PUT", body: JSON.stringify({ alt, neu }) });
    if (!response.ok) {
        const fehler = await fehlerAus(response, "Passwort konnte nicht gespeichert werden.");
        throw new Error(fehlerText(fehler.detail) || fehler.message);
    }
    useAnmeldungStore.getState().benutzerAktualisieren(await response.json());
}

/** Ticket für einen Link ohne Header (PDF). Ohne Bediener null. */
export async function holeTicket(pfad: string): Promise<string | null> {
    if (!useAnmeldungStore.getState().bedienerToken) return null;
    const response = await apiFetch("/auth/ticket", { method: "POST", body: JSON.stringify({ pfad }) });
    if (!response.ok) return null;
    return (await response.json())?.ticket ?? null;
}
