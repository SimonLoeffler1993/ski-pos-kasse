import './App.css'
import Kopf from './components/kopf'
import Links from './components/links'
import Rechts from './components/rechts'

function App() {
    return (
        <div className="flex flex-col h-screen">
            <div className="bg-green-500 text-white p-4">
                <Kopf />
            </div>
            <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
                <div className="text-white p-4 col-span-1 flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto">
                        <Links />
                    </div>
                </div>
                <div className="text-white p-4 col-span-2">
                    <Rechts />
                </div>
            </div>
        </div>
    )
}

export default App