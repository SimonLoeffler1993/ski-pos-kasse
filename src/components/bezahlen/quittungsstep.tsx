import { useState } from "react";
import { CheckCircle2, Mail, Printer, Receipt, Send, Users } from "lucide-react";
import type { BezahlenResponse } from "../../types/bezahlen";
import { Button } from "../ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { API_URL } from "../../config";
import { useQuittungMail } from "../../hooks/useQuittungMail";

type QuittungsSchrittProps = {
    bezahlData: BezahlenResponse;
    onFertig: () => void;
    // onBusyChange: (isBusy: boolean) => void;
};

const emailGueltig = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

const grosserButton = "h-12 w-full rounded-xl px-4 text-base font-semibold shadow-sm transition";

export default function QuittungsSchritt({ bezahlData, onFertig}: QuittungsSchrittProps) {
    const vorschlaege = bezahlData.emails;
    const [mailOffen, setMailOffen] = useState(false);
    // Bei genau einem Vorschlag ist die Adresse schon eingetragen
    const [email, setEmail] = useState(vorschlaege.length === 1 ? vorschlaege[0] : "");
    const { mutate, data: ergebnis, isPending, isError, error } = useQuittungMail();

    function handleQuittung() {
        const quittungUrl = `${API_URL}/api/v1/quittungen/quittung/${bezahlData.quittung_id}/pdf`
        window.open(quittungUrl, "_blank", "noopener,noreferrer");
        onFertig()
    }

    function senden(emails: string[]) {
        mutate({ quittungId: bezahlData.quittung_id, emails });
    }

    function handleAnAlle() {
        // Eine zusätzlich eingetippte Adresse geht mit
        senden(emailGueltig(email) ? [...vorschlaege, email.trim()] : vorschlaege);
    }

    return (
        <>
            <DialogHeader className="items-center text-center sm:text-center">
                <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="size-9 text-emerald-600" />
                </div>
                <DialogTitle className="text-2xl">Zahlung erfolgreich</DialogTitle>
                <DialogDescription>
                    Die Zahlung wurde verbucht.
                </DialogDescription>
            </DialogHeader>

            <div className="flex items-baseline justify-between rounded-xl bg-slate-900 px-5 py-4">
                <span className="text-sm font-medium text-slate-300">Quittung Nr.</span>
                <span className="text-2xl font-bold tabular-nums text-white">
                    {bezahlData.quittung_nummer ?? bezahlData.quittung_id}
                </span>
            </div>

            {ergebnis ? (
                <>
                    <div className="flex flex-col gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm">
                        <p className="font-medium text-emerald-800">Quittung gesendet an:</p>
                        {ergebnis.gesendet.map((adresse) => (
                            <p key={adresse} className="text-emerald-700">{adresse}</p>
                        ))}
                        {ergebnis.fehlgeschlagen.length > 0 && (
                            <>
                                <p className="mt-2 font-medium text-red-700">Nicht gesendet an:</p>
                                {ergebnis.fehlgeschlagen.map((adresse) => (
                                    <p key={adresse} className="text-red-600">{adresse}</p>
                                ))}
                            </>
                        )}
                    </div>
                    <DialogFooter className="flex-col gap-2 sm:flex-col">
                        <Button onClick={onFertig} className={`${grosserButton} bg-emerald-500 text-white hover:bg-emerald-600`}>
                            Fertig
                        </Button>
                    </DialogFooter>
                </>
            ) : mailOffen ? (
                <>
                    <div className="flex flex-col gap-3">
                        <input
                            type="email"
                            inputMode="email"
                            autoComplete="off"
                            placeholder="E-Mail Adresse"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isPending}
                            className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-base outline-none focus:border-emerald-500"
                        />
                        {vorschlaege.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-slate-500">Adressen aus dem Warenkorb</span>
                                {vorschlaege.map((adresse) => (
                                    <button
                                        key={adresse}
                                        type="button"
                                        onClick={() => setEmail(adresse)}
                                        disabled={isPending}
                                        className={`flex h-11 items-center gap-2 truncate rounded-xl border-2 px-4 text-left text-sm font-medium transition ${email.trim().toLowerCase() === adresse.toLowerCase()
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <Mail className="size-4 shrink-0" />
                                        <span className="truncate">{adresse}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        {isError && (
                            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700" role="alert">
                                {error instanceof Error ? error.message : "Unbekannter Fehler"}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:flex-col">
                        <Button
                            onClick={() => senden([email.trim()])}
                            disabled={isPending || !emailGueltig(email)}
                            className={`${grosserButton} bg-emerald-500 text-white hover:bg-emerald-600`}
                        >
                            <Send className="size-5" />
                            {isPending ? "Wird gesendet..." : "Senden"}
                        </Button>
                        {vorschlaege.length > 1 && (
                            <Button
                                onClick={handleAnAlle}
                                disabled={isPending}
                                className={`${grosserButton} bg-sky-500 text-white hover:bg-sky-600`}
                            >
                                <Users className="size-5" />
                                An alle senden ({vorschlaege.length})
                            </Button>
                        )}
                        <Button
                            onClick={handleQuittung}
                            disabled={isPending}
                            className={`${grosserButton} bg-slate-200 text-slate-700 hover:bg-slate-300`}
                        >
                            <Printer className="size-5" />
                            Doch drucken
                        </Button>
                    </DialogFooter>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <Receipt className="size-5 shrink-0 text-slate-500" />
                        <p className="text-base font-medium text-slate-700">
                            Wird eine Quittung benötigt?
                        </p>
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:flex-col">
                        <Button
                            onClick={handleQuittung}
                            className={`${grosserButton} bg-emerald-500 text-white hover:bg-emerald-600`}
                        >
                            <Printer className="size-5" />
                            Ja, Quittung drucken
                        </Button>
                        <Button
                            onClick={() => setMailOffen(true)}
                            className={`${grosserButton} bg-sky-500 text-white hover:bg-sky-600`}
                        >
                            <Mail className="size-5" />
                            Per E-Mail senden
                        </Button>
                        <Button
                            onClick={onFertig}
                            className={`${grosserButton} bg-slate-200 text-slate-700 hover:bg-slate-300`}
                        >
                            Nein, danke
                        </Button>
                    </DialogFooter>
                </>
            )}
        </>
    );
}
