import { apiFetch } from "./api";
import { BezahlenResponseSchema, QuittungMailErgebnisSchema, type Bezahlen, type BezahlenResponse, type QuittungMailErgebnis } from "../types/bezahlen";

export async function bezahlen(bezahlenData: Bezahlen): Promise<BezahlenResponse> {
    const response = await apiFetch("/kasse/bezahlen", {
        method: "POST",
        body: JSON.stringify(bezahlenData),
    });

    if (!response.ok) {
        // Fehlermeldung vom Backend anzeigen, z.B. "Auftrag ist bereits bezahlt"
        const fehler = await response.json().catch(() => null);
        throw new Error(`Fehler beim Bezahlen: ${fehler?.detail ?? response.statusText}`);
    }

    const data = await response.json();
    const parsedData = BezahlenResponseSchema.safeParse(data);
    
    if (!parsedData.success) {
        throw new Error(`Fehler beim Parsen der Bezahlen-Antwort: ${parsedData.error.message}`);
    }

    return parsedData.data;
}

export async function sendeQuittungMail({ quittungId, emails }: { quittungId: number; emails: string[] }): Promise<QuittungMailErgebnis> {
    const response = await apiFetch(`/quittungen/quittung/${quittungId}/mail`, {
        method: "POST",
        body: JSON.stringify({ emails }),
    });

    if (!response.ok) {
        const fehler = await response.json().catch(() => null);
        // Bei ungültiger Adresse liefert FastAPI eine Liste von Fehlern
        const detail = typeof fehler?.detail === "string" ? fehler.detail : response.status === 422 ? "Ungültige E-Mail Adresse" : response.statusText;
        throw new Error(`Fehler beim Senden der Quittung: ${detail}`);
    }

    return QuittungMailErgebnisSchema.parse(await response.json());
}
