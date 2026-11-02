
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

function Footer() {
    return (
        <footer className="footer">
            <p>
                © 2026 <strong>CivicLens</strong>
                {" "}· A better campus starts with being heard.
            </p>

            <Link to="/report">
                Report an issue
                <ArrowUpRight size={13} />
            </Link>
        </footer>
    );
}

export default Footer;
