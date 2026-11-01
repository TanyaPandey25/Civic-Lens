
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("civiclens-theme") || "dark";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";

        setTheme(newTheme);
        localStorage.setItem("civiclens-theme", newTheme);
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                CivicLens
            </Link>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/issues">Issues</Link>
                <Link to="/report">Report Issue</Link>
                <Link to="/login">Login</Link>

                <button
                    type="button"
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                    <span className="theme-icon">
                        {theme === "dark" ? "☀" : "☾"}
                    </span>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
