
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sun, Moon, Layers3 } from "lucide-react";

function Navbar() {
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

                <NavLink to="/issues">
                    Explore Issues
                </NavLink>

                <NavLink to="/report">
                    Report
                </NavLink>

                <NavLink to="/login">
                    Login
                </NavLink>

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
