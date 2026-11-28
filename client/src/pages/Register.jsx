
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ArrowRight,
    UserRoundPlus,
    Eye,
    EyeOff
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        const collegeEmailRegex = /^[^\s@]+@bmsce\.ac\.in$/i;

        if (!collegeEmailRegex.test(email.trim())) {
            setMessage("Please use your BMSCE email address.");
            return;
        }

        if (password.length < 8) {
            setMessage("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            setSubmitting(true);

            const response = await axios.post(`${API}/auth/register`, {
                name,
                email,
                password
            });

            const { user, token } = response.data;

            login(user, token);

            navigate("/", { replace: true });

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="auth-page">

            <aside className="auth-aside">

                <p className="eyebrow">
                    BE PART OF THE CHANGE
                </p>

                <h1>
                    Your campus.
                    Your voice.
                    <span> Your impact.</span>
                </h1>

                <p>
                    Join a community that believes
                    everyday campus problems deserve
                    attention and action.
                </p>

                <span className="auth-decoration">
                    EVERY CONCERN COUNTS.
                </span>

            </aside>

            <section className="auth-content">

                <div className="auth-heading">

                    <UserRoundPlus size={21} />

                    <p className="eyebrow">
                        CREATE YOUR ACCOUNT
                    </p>

                    <h2>Let's get started.</h2>

                    <p>
                        Create an account to join CivicLens.
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    <label htmlFor="register-name">
                        Full name
                    </label>

                    <input
                        id="register-name"
                        type="text"
                        placeholder="Your name"
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />

                    <label htmlFor="register-email">
                        BMSCE email address
                    </label>

                    <input
                        id="register-email"
                        type="email"
                        placeholder="you@bmsce.ac.in"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label htmlFor="register-password">
                        Password
                    </label>

                    <div className="password-field">
                        <input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            autoComplete="new-password"
                            minLength={8}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <label htmlFor="register-confirm-password">
                        Confirm password
                    </label>

                    <div className="password-field">
                        <input
                            id="register-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter your password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="primary-button full-width"
                        disabled={submitting}
                    >
                        {submitting ? "Creating account..." : "Create account"}
                        {!submitting && <ArrowRight size={15} />}
                    </button>

                </form>

                {message && (
                    <p className="error-message" role="alert">
                        {message}
                    </p>
                )}

                <p className="auth-switch">
                    Already have an account?
                    <Link to="/login"> Login</Link>
                </p>

            </section>

        </main>
    );
}

export default Register;
