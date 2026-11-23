
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sun, Moon, Layers3, LogOut } from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Navbar() {
    const navigate = useNavigate();

    const { user, isAuthenticated, isAdmin, logout } = useAuth();

    const [theme, setTheme] = useState(
        () => localStorage.getItem("civiclens-theme") || "light"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("civiclens-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(current =>
            current === "dark" ? "light" : "dark"
        );
    };

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <span className="logo-mark">
                    <Layers3 size={17} strokeWidth={1.8} />
                </span>
                CivicLens
            </Link>

            <div className="nav-links">
                <NavLink to="/" end>
                    Home
                </NavLink>

                {isAuthenticated && (
                    <NavLink to="/issues">
                        Explore Issues
                    </NavLink>
                )}

                {isAuthenticated && !isAdmin && (
                    <NavLink to="/report">
                        Report
                    </NavLink>
                )}

                {!isAuthenticated && (
                    <>
                        <NavLink to="/login">
                            Login
                        </NavLink>

                        <NavLink to="/register">
                            Register
                        </NavLink>
                    </>
                )}

                {isAuthenticated && (
                    <button
                        type="button"
                        className="theme-toggle"
                        onClick={handleLogout}
                        title={`Logout ${user?.name || ""}`}
                        aria-label="Logout"
                    >
                        <LogOut size={17} />
                    </button>
                )}

                <button
                    type="button"
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    title="Toggle appearance"
                >
                    {theme === "dark"
                        ? <Sun size={17} />
                        : <Moon size={17} />
                    }
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
