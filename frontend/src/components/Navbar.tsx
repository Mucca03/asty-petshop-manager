import { Link } from "react-router-dom";

const Navbar = () => {
    return(
        <nav className="navbar">
            <div className="navbar-center">
                <ul className="nav-links">
                    <li>
                        <Link to="/crearCliente">Crear Cliente</Link>
                    </li>
                    <li>
                        <Link to="/verCliente">Ver Cliente</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;