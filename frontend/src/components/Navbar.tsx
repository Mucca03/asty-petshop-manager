import { Link } from "react-router-dom";
import "../index.css"

const Navbar = () => {

    return(
        <nav className="navbar">
                <ul>
                    <li className="item-list">
                        <Link to="/crearCliente">Crear Cliente</Link>
                    </li>
                    <li className="item-list">
                        <Link to="/verCliente">Ver Cliente</Link>
                    </li>
                </ul>
        </nav>
    )
}

export default Navbar;