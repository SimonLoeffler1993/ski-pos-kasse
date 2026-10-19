import { API_URL } from "../config";
import { BezahlenResponseSchema, type Bezahlen, type BezahlenResponse } from "../types/bezahlen";

export async function bezahlen(bezahlenData: Bezahlen): Promise<BezahlenResponse> {
    const response = await fetch(`${API_URL}/api/v1/kasse/bezahlen`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bezahlenData),
    });

    if (!response.ok) {
        throw new Error(`Fehler beim Bezahlen: ${response.statusText}`);
    }

    const data = await response.json();
    const parsedData = BezahlenResponseSchema.safeParse(data);
    
    if (!parsedData.success) {
        throw new Error(`Fehler beim Parsen der Bezahlen-Antwort: ${parsedData.error.message}`);
    }

    return parsedData.data;
}