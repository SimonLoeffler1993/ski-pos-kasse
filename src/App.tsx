import './App.css'
import Kopf from './components/kopf'
import Links from './components/links'
import Rechts from './components/rechts'

function App() {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
            <div className="bg-green-500 text-white p-4 shadow-sm">
                <Kopf />
            </div>

            <div className="grid flex-1 min-h-0 grid-cols-[360px_minmax(0,1fr)] gap-4 p-4">
                <div className="min-h-0 overflow-hidden">
                    <Links />
                </div>

                <div className="min-h-0 overflow-hidden">
                    <Rechts />
                </div>
            </div>
        </div>
    )
}

export default App