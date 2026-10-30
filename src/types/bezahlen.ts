import { z } from "zod";
import { KassenArtikelSchema } from "./artikel";

export const BezahlenSchema = z.object({
    artikels: z.array(KassenArtikelSchema),
    ueberweisung: z.boolean().default(false),
    karte: z.boolean().default(false),
    bar: z.boolean().default(false)
});

export type Bezahlen = z.infer<typeof BezahlenSchema>;

export const BezahlenResponseSchema = z.object({
    success: z.boolean(),
    quittung_id: z.number().int(),
    bezahldatum: z.string().optional(),
    // Angezeigte Nummer, z.B. "26/27Q12"
    quittung_nummer: z.string().nullish(),
    // E-Mail Adressen der Kunden als Vorschlag für den Mailversand
    emails: z.array(z.string()).default([])
});

export type BezahlenResponse = z.infer<typeof BezahlenResponseSchema>;

export const QuittungMailErgebnisSchema = z.object({
    gesendet: z.array(z.string()),
    fehlgeschlagen: z.array(z.string())
});

export type QuittungMailErgebnis = z.infer<typeof QuittungMailErgebnisSchema>;
