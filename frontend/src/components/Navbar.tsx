import { Link } from "react-router-dom";

const Navbar = () => {
    return(
        <nav className="navbar">
            <div className="navbar-center">
                <ul className="nav-links">
                    <li>
                        <Link to="/crearCliente">Products</Link>
                    </li>
                    <li>
                        <Link to="/verCliente">About Us</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;