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
    bezahldatum: z.string().optional()
});

export type BezahlenResponse = z.infer<typeof BezahlenResponseSchema>;