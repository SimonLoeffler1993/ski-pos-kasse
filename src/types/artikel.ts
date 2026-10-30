import { z } from "zod";

export const KasseEinzelArtikelSchema = z.object({
  id: z.number().int(),
  bezeichnung: z.string(),
  preis: z.number(),
});

export type KasseEinzelArtikel = z.infer<typeof KasseEinzelArtikelSchema>;

export const KassenArtikelSchema = z.object({
  id: z.number().int(),
  kundenname: z.string(),
  artikelname: z.string(),
  gesamtpreis: z.number(),
  artikel: z.array(KasseEinzelArtikelSchema),
  service: z.boolean().optional().default(false),
  verleih: z.boolean().optional().default(false),
  handware: z.boolean().optional().default(false),
  // Verkaufte Menge, nur bei Handware änderbar
  menge: z.number().int().min(1).optional().default(1),
  // Anzahl des Handwarenartikels, nur als Hinweis
  bestand: z.number().int().nullish(),
});

export type KassenArtikel = z.infer<typeof KassenArtikelSchema>;
export type KassenArtikelListe = KassenArtikel[];

export type KassenKategorie = "Auftrag" | "Verleih" | "Handware";;