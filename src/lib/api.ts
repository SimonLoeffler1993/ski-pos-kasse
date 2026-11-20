import { API_URL } from "../config";
import { useAnmeldungStore } from "../stores/useAnmeldungStore";

export class ApiFehler extends Error {
    status: number;
    detail: string | null;
    constructor(status: number, detail: string | null, nachricht: string) {
        super(nachricht);
        this.status = status;
        this.detail = detail;
    }
}

type Optionen = {
    // Nur das Geräte-Token schicken (Bedienerauswahl, PIN, Anmeldung am angemeldeten Gerät)
    nurGeraet?: boolean;
};

/**
 * fetch an die API mit der Anmeldung als Bearer-Header. pfad ohne /api/v1, z.B. "/kasse/bezahlen".
 * Bei 401 wird die abgelaufene Sitzung vergessen; die Kasse zeigt dann von selbst wieder die Anmeldung.
 */
export async function apiFetch(pfad: string, init: RequestInit = {}, optionen: Optionen = {}): Promise<Response> {
    const { geraetToken, bedienerToken, bedienerVergessen, allesVergessen } = useAnmeldungStore.getState();
    const kopf = new Headers(init.headers);
    const token = optionen.nurGeraet ? geraetToken : bedienerToken ?? geraetToken;
    if (token) kopf.set("Authorization", `Bearer ${token}`);
    if (init.body && !kopf.has("Content-Type")) kopf.set("Content-Type", "application/json");

    const response = await fetch(`${API_URL}/api/v1${pfad}`, { ...init, headers: kopf });
    if (response.status === 401) {
        const detail = await response.clone().json().then((d) => d?.detail).catch(() => null);
        if (detail === "bediener_noetig") bedienerVergessen();
        else if (detail === "anmeldung_noetig") allesVergessen();
    }
    return response;
}

/** Fehlertext der API (detail) oder ein Standardtext. */
export async function fehlerAus(response: Response, standard: string): Promise<ApiFehler> {
    const daten = await response.json().catch(() => null);
    const detail = typeof daten?.detail === "string" ? daten.detail : null;
    return new ApiFehler(response.status, detail, detail ?? standard);
}
