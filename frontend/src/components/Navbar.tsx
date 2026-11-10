import { Link, NavLink } from "react-router-dom";
import { HomeIcon, PawIcon, UserPlusIcon, UsersIcon } from "./icons.tsx";
import { useTheme } from "../hooks/useTheme.ts";
import "../index.css"

const navGroups = [
    {
        title: "Menú",
        items: [
            { to: "/", label: "Panel", icon: HomeIcon, end: true },
            { to: "/crearCliente", label: "Nuevo registro", icon: UserPlusIcon, end: false },
            { to: "/verCliente", label: "Clientes", icon: UsersIcon, end: false },
        ],
    },
    {
        title: "Admin",
        items: [
            { to: "/verClienteAdmin", label: "Clientes Admin", icon: UsersIcon, end: false },
        ],
    },
];

const Navbar = () => {
    const { theme, setTheme } = useTheme();

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

            {navGroups.map(group => (
                <div className="navbar-group" key={group.title}>
                    <p className="navbar-section-title">{group.title}</p>

                    <ul className="navbar-links">
                        {group.items.map(item => {
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
                </div>
            ))}

            <div className="navbar-theme">
                <span className="navbar-theme-label">Tema</span>
                <div className="theme-options" role="group" aria-label="Tema de la interfaz">
                    <button
                        type="button"
                        className={`theme-option${theme === "base" ? " active" : ""}`}
                        onClick={() => setTheme("base")}
                        aria-pressed={theme === "base"}
                    >
                        <span className="theme-swatch theme-swatch-base" aria-hidden="true"/>
                        Base
                    </button>
                    <button
                        type="button"
                        className={`theme-option${theme === "dracula" ? " active" : ""}`}
                        onClick={() => setTheme("dracula")}
                        aria-pressed={theme === "dracula"}
                    >
                        <span className="theme-swatch theme-swatch-dracula" aria-hidden="true"/>
                        Drácula
                    </button>
                </div>
            </div>

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
