
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";

function Login() {
    const [message, setMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage(
            "Login is not connected to the authentication backend yet."
        );
    };

    return (
        <main className="auth-page">

            <aside className="auth-aside">

                <p className="eyebrow">CIVICLENS COMMUNITY</p>

                <h1>
                    Better spaces
                    begin with
                    <span> shared voices.</span>
                </h1>

                <p>
                    Stay connected to the concerns,
                    conversations and improvements
                    shaping your campus.
                </p>

                <span className="auth-decoration">
                    A CAMPUS THAT LISTENS.
                </span>

            </aside>

            <section className="auth-content">

                <div className="auth-heading">
                    <LockKeyhole size={21} />

                    <p className="eyebrow">
                        WELCOME BACK
                    </p>

                    <h2>Good to see you.</h2>

                    <p>
                        Sign in to continue to CivicLens.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    <label htmlFor="login-email">
                        Email address
                    </label>

                    <input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="login-password">
                        Password
                    </label>

                    <input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                    />

                    <button
                        type="submit"
                        className="primary-button full-width"
                    >
                        Login
                        <ArrowRight size={15} />
                    </button>

                </form>

                {message && (
                    <p className="error-message" role="status">
                        {message}
                    </p>
                )}

                <p className="auth-switch">
                    New to CivicLens?
                    <Link to="/register"> Create an account</Link>
                </p>

            </section>

        </main>
    );
}

export default Login;
