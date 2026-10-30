import { useWarenkorbStore, warenkorbKey } from '../../stores/useWarenkorbStore';

export default function WarenkorbListe() {
    const items = useWarenkorbStore((state) => state.items);
    const removeItem = useWarenkorbStore((state) => state.removeItem);
    const setMenge = useWarenkorbStore((state) => state.setMenge);
    const clearCart = useWarenkorbStore((state) => state.clearCart);
    const itemList = Object.values(items);

    if (itemList.length === 0) {
        return (
            <div className="flex flex-col gap-2">
                <div className="rounded-lg border border-dashed border-slate-200 bg-white p-3 text-sm text-slate-500">
                    Warenkorb leer
                </div>
            </div>
        );
    }

    function handleAlleEntfernen() {
        clearCart();
    }

    // TODO wen Saisonverleih und Service gleiche ID haben können nicht beide im Warenkorb sein
    return (
        <div className="flex flex-col gap-2">
            <div className="sticky -top-2 z-10 -mx-2 -mt-2 flex justify-end bg-slate-50 px-2 pt-2 pb-1">
                <button
                    onClick={handleAlleEntfernen}
                    className="rounded-md border border-slate-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                    Alle entfernen
                </button>
            </div>

            {itemList.map((item) => {
                const key = warenkorbKey(item);
                return (
                    <div
                        key={key}
                        className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate font-medium text-slate-800">{item.artikelname}</span>
                                {item.kundenname && <span className="truncate text-slate-500">{item.kundenname}</span>}
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                                <span className="font-medium tabular-nums text-slate-800">
                                    {(item.gesamtpreis * item.menge).toFixed(2)} €
                                </span>
                                <button
                                    onClick={() => removeItem(key)}
                                    className="rounded-md border border-slate-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                                >
                                    Entfernen
                                </button>
                            </div>
                        </div>
                        {item.handware && (
                            // Menge nur bei Handware, große Buttons für das Tablet
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setMenge(key, item.menge - 1)}
                                    aria-label="Menge verringern"
                                    className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-lg font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    −
                                </button>
                                <span className="min-w-8 text-center text-base font-semibold tabular-nums">{item.menge}</span>
                                <button
                                    onClick={() => setMenge(key, item.menge + 1)}
                                    aria-label="Menge erhöhen"
                                    className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-lg font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    +
                                </button>
                                <span className="text-slate-500 tabular-nums">× {item.gesamtpreis.toFixed(2)} €</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}