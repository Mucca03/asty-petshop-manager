import { Routes, Route } from "react-router-dom";
import {Dashboard, TestGetClients, Navbar, TestPost, TestGet} from "./components/index.ts";
import "./index.css"

const App = () => {
    return (
        <div className="layout">
            <Navbar/>
            <main className="content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/crearCliente" element={<TestPost />} />
                    <Route path="/verClienteAdmin" element={<TestGet />} />
                    <Route path="/verCliente" element={<TestGetClients />} />
                </Routes>
            </main>
        </div>
    )
}
export default App
