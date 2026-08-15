import { useWarenkorbStore } from '../../stores/useWarenkorbStore';

export default function WarenkorbListe() {
    const items = useWarenkorbStore((state) => state.items);
    const removeItem = useWarenkorbStore((state) => state.removeItem);
    const itemList = Object.values(items);

    if (itemList.length === 0) {
        return (
            <div className="flex min-h-[200px] flex-col gap-2">
                <div className="rounded-lg border border-dashed border-slate-200 bg-white p-3 text-sm text-slate-500">
                    Warenkorb leer
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[200px] flex-col gap-2">
            {itemList.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm"
                >
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{item.artikelname}</span>
                        <span className="text-slate-500">{item.kundenname}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-800">
                            {item.gesamtpreis.toFixed(2)} €
                        </span>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="rounded-md border border-slate-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                        >
                            Entfernen
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}