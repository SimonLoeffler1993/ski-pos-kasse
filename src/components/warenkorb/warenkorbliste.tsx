// warenkorb/warenkorb.tsx
export default function WarenkorbListe() {
    return (
        <div className="flex min-h-[200px] flex-col gap-2">
            <div className="rounded-lg border border-dashed border-slate-200 bg-white p-3 text-sm text-slate-500">
                Warenkorb leer
            </div>
            <div className="rounded-lg border border-dashed border-slate-200 bg-white p-3 text-sm text-slate-500">
                Artikel erscheinen hier
            </div>
            {/* später: warenkorbItems.map(item => <WarenkorbItem ... />) */}
        </div>
    )
}