import type { ReactNode } from "react";

import { APP_NAME } from "../../config";

export default function AnmeldeRahmen({ titel, untertitel, children }: { titel: string; untertitel?: string; children: ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col bg-slate-100">
            <div className="bg-green-500 p-4 text-white shadow-sm">
                <h1 className="px-4 text-lg font-medium">{APP_NAME}</h1>
            </div>
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-sm">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">{titel}</h2>
                        {untertitel && <p className="text-sm text-slate-500">{untertitel}</p>}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
