import { Link, NavLink } from "react-router-dom";
import { HomeIcon, PawIcon, UserPlusIcon, UsersIcon } from "./icons.tsx";
import "../index.css"

const navItems = [
    { to: "/", label: "Panel", icon: HomeIcon, end: true },
    { to: "/verCliente", label: "Clientes", icon: UsersIcon, end: false },
    { to: "/crearCliente", label: "Nuevo registro", icon: UserPlusIcon, end: false },
];

const Navbar = () => {
    return(
        <nav className="navbar">
            <Link to="/" className="navbar-brand" aria-label="Asty Petshop Manager, ir al panel">
                <span className="brand-mark">
                    <PawIcon/>
                </span>
                <span className="brand-copy">
                    <strong>Asty</strong>
                    <small>Petshop manager</small>
                </span>
            </Link>

            <p className="navbar-section-title">Menú</p>

            <ul className="navbar-links">
                {navItems.map(item => {
                    const Icon = item.icon;

                    return (
                        <li className="item-list" key={item.to}>
                            <NavLink
                                to={item.to}
                                end={item.end}
                                className={({isActive}) => isActive ? "active" : ""}
                            >
                                <Icon/>
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>

            <div className="navbar-footer">
                <span className="navbar-footer-icon">
                    <PawIcon/>
                </span>
                <p>Cuida a tus clientes y a sus mascotas, todo desde un mismo lugar.</p>
            </div>
        </nav>
    )
}

export default Navbar;
