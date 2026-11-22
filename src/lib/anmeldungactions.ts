import { z } from "zod";

import { API_URL } from "../config";
import { useAnmeldungStore, type AnmeldeAntwort, type KassenBenutzer, type KassenGeraet } from "../stores/useAnmeldungStore";
import { apiFetch, fehlerAus } from "./api";

export const AuthStatusSchema = z.object({
    einrichtung_noetig: z.boolean(),
    anmeldung_erzwungen: z.boolean(),
    pin_erlaubt: z.boolean(),
    oidc: z.object({ aktiv: z.boolean(), anbieter: z.string(), button_text: z.string() }),
    // Was ohne Anmeldung erlaubt ist (Gruppe "Ohne Anmeldung", im Übergang alles)
    ohne_anmeldung: z.object({ lesen: z.boolean(), rechte: z.array(z.string()) })
        .default({ lesen: true, rechte: ["*"] }),
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
    passwort_falsch: "Das Passwort ist falsch.",
    oidc: "Die Anmeldung über den Anbieter ist fehlgeschlagen.",
    kein_recht_geraet: "Du darfst keine Geräte anmelden (Recht „Gerät anmelden“ fehlt).",
    bereits_dauerhaft: "Diese Kasse ist schon angemeldet.",
    oidc_bestaetigen: "Dein Konto hat kein Passwort: bitte über den Anbieter bestätigen.",
    oidc_anderer_benutzer: "Beim Anbieter wurde ein anderes Konto angemeldet. Die Kasse wurde nicht angemeldet.",
    oidc_nicht_frisch: "Der Anbieter hat nicht neu nach dem Passwort gefragt. Bitte erneut versuchen.",
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

export async function anmelden(benutzername: string, passwort: string): Promise<KassenBenutzer> {
    const { geraetToken } = useAnmeldungStore.getState();
    // Name der Gerätesitzung vergibt die API ("Kasse (Name)"), geändert wird er bei "Kasse anmelden"
    const response = await apiFetch("/auth/anmelden", {
        method: "POST",
        body: JSON.stringify({ benutzername, passwort, geraet_name: null, geraet_art: "kasse" }),
    }, { nurGeraet: true });
    if (response.status === 401 && geraetToken) {
        const detail = await response.clone().json().then((d) => d?.detail).catch(() => null);
        if (detail === "anmeldung_noetig") {
            // Gerätesitzung ungültig (z.B. im Center abgemeldet; apiFetch hat sie vergessen): neu anmelden
            return anmelden(benutzername, passwort);
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

export async function oidcEinloesen(code: string): Promise<KassenBenutzer> {
    const response = await apiFetch("/auth/oidc/einloesen", {
        method: "POST",
        body: JSON.stringify({ code, geraet_name: null, geraet_art: "kasse" }),
    }, { nurGeraet: true });
    return anmeldeAntwort(response);
}

/** Startet die OIDC-Anmeldung; die API kommt mit ?code= bzw. ?fehler= auf die Kasse zurück. */
export function oidcStartUrl(): string {
    const ziel = `${window.location.origin}/`;
    return `${API_URL}/api/v1/auth/oidc/start?ziel=${encodeURIComponent(ziel)}`;
}

/** Bediener abmelden. Eine persönliche Anmeldung endet dabei ganz (dann wieder das Anmeldeformular). */
export async function bedienerAbmelden(): Promise<void> {
    const response = await apiFetch("/auth/bediener/abmelden", { method: "POST" }).catch(() => null);
    const daten = response?.ok ? await response.json().catch(() => null) : null;
    const { dauerhaft, bedienerVergessen, allesVergessen } = useAnmeldungStore.getState();
    if (daten?.geraet_abgemeldet || !dauerhaft) allesVergessen();
    else bedienerVergessen();
}

async function geraetAntwort(response: Response, standard: string): Promise<KassenGeraet> {
    if (!response.ok) {
        const fehler = await fehlerAus(response, standard);
        throw new Error(fehlerText(fehler.detail, response.headers.get("X-Gesperrt-Bis")) || fehler.message);
    }
    const geraet = (await response.json()) as KassenGeraet;
    useAnmeldungStore.getState().geraetAktualisieren(geraet);
    return geraet;
}

/** "Kasse anmelden": macht diese Kasse dauerhaft angemeldet (Recht geraete.anmelden, Passwort erneut). */
export async function kasseDauerhaftAnmelden(passwort: string, name: string): Promise<KassenGeraet> {
    const response = await apiFetch("/auth/geraet/anmelden", {
        method: "POST",
        body: JSON.stringify({ passwort, name: name.trim() || null }),
    });
    return geraetAntwort(response, "Die Kasse konnte nicht angemeldet werden.");
}

/** Wie kasseDauerhaftAnmelden, bestätigt über den OIDC-Anbieter; zurück mit ?geraet_angemeldet=1 bzw. ?fehler=. */
export async function kasseOidcUrl(name: string): Promise<string> {
    const response = await apiFetch("/auth/geraet/oidc", {
        method: "POST",
        body: JSON.stringify({ ziel: `${window.location.origin}/`, name: name.trim() || null }),
    });
    if (!response.ok) {
        const fehler = await fehlerAus(response, "Bestätigung nicht möglich.");
        throw new Error(fehlerText(fehler.detail) || fehler.message);
    }
    return (await response.json()).url;
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
    if (daten?.geraet) useAnmeldungStore.getState().geraetAktualisieren(daten.geraet);
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

/** Ticket für einen Link ohne Header (PDF), auch ohne Anmeldung (Kasse über die Gruppe "Ohne Anmeldung"). */
export async function holeTicket(pfad: string): Promise<string | null> {
    const response = await apiFetch("/auth/ticket", { method: "POST", body: JSON.stringify({ pfad }) });
    if (!response.ok) return null;
    return (await response.json())?.ticket ?? null;
}
