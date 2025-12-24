import { Routes, Route } from "react-router-dom";
import {TestGetClients, Navbar ,TestGet,TestPost} from "./components/index.ts";
import "./index.css"

const App = () => {
    return (
        <div className="layout">
            <Navbar/>
            <main className="content">
                <Routes>
                    <Route path="/crearCliente" element={<TestPost />} />
                    <Route path="/verCliente" element={<TestGetClients />} />
                </Routes>
            </main>
        </div>
    )
}
export default App
