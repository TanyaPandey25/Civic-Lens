
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, LockKeyhole } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setMessage("");

            const response = await axios.post(`${API}/auth/login`, {
                email,
                password
            });

            const { user, token } = response.data;

            // Save the logged-in user and authentication token
            login(user, token);

            // Redirect to Home after successful login
            navigate("/", { replace: true });

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to login. Please check your connection and try again."
            );
        } finally {
            setSubmitting(false);
        }
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

                    <p className="eyebrow">WELCOME BACK</p>

                    <h2>Good to see you.</h2>

                    <p>Sign in to continue to CivicLens.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="login-email">
                        College email address
                    </label>

                    <input
                        id="login-email"
                        type="email"
                        placeholder="you@bmsce.ac.in"
                        autoComplete="username"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
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
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="primary-button full-width"
                        disabled={submitting}
                    >
                        {submitting ? "Logging in..." : "Login"}

                        {!submitting && <ArrowRight size={15} />}
                    </button>
                </form>

                {message && (
                    <p className="error-message" role="alert">
                        {message}
                    </p>
                )}

                <p className="auth-switch">
                    New to CivicLens?
                    <Link to="/register"> Sign Up</Link>
                </p>
            </section>
        </main>
    );
}

export default Login;
