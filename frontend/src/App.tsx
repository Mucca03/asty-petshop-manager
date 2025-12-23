import { Routes, Route } from "react-router-dom";
import {TestGetClients, Navbar ,TestGet,TestPost} from "./components/index.ts";

const App = () => {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/crearCliente" element={<TestPost />} />
                <Route path="/verCliente" element={<TestGetClients />} />
            </Routes>
        </>
        )
}
export default App
