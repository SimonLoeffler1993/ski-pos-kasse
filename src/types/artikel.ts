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
});

export type KassenArtikel = z.infer<typeof KassenArtikelSchema>;
export type KassenArtikelListe = KassenArtikel[];

export type KassenKategorie = "Auftrag" | "Verleih" | "Handware";;