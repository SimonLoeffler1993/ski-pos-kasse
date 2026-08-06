// header.tsx
import { APP_NAME } from "../config";

export default function Kopf() {
    return (
        <header className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-medium">{APP_NAME}</h1>
        </header>
    );
}