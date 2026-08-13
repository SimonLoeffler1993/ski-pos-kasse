import { queryOptions } from "@tanstack/react-query";
import { getArtikels } from "../lib/artikelactions";
import type { KassenKategorie  } from "../types/artikel";

export const kassenArtikelsOptions = (kategorie: KassenKategorie) => queryOptions({
    queryKey: ["kassenArtikels", kategorie],
    queryFn: () => getArtikels(kategorie),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 5,
})