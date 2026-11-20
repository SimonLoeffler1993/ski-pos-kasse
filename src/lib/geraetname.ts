// Name dieser Kasse: zuletzt verwendeter Name als Vorschlag, für OIDC kurz in der sessionStorage

export const GERAET_NAME = "kasse-geraet-name";

export function gemerkterGeraetName(): string {
    try {
        return localStorage.getItem(GERAET_NAME) ?? "Kasse";
    } catch {
        return "Kasse";
    }
}

/** Vor dem Sprung zum OIDC-Anbieter gemerkter Name, wird beim Lesen entfernt. */
export function gemerkterOidcGeraetName(): string | undefined {
    try {
        const name = sessionStorage.getItem(GERAET_NAME) ?? undefined;
        sessionStorage.removeItem(GERAET_NAME);
        return name;
    } catch {
        return undefined;
    }
}
