import { Link } from "react-router-dom";

function Navbar() {
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
            </div>
        </nav>
    );
}

export default Navbar;