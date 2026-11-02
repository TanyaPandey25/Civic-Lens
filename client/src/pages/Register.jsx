
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, UserRoundPlus } from "lucide-react";

function Register() {
    const [message, setMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        setMessage(
            "Account creation is not connected to the authentication backend yet."
        );
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
                        required
                    />

                    <label htmlFor="register-email">
                        Email address
                    </label>

                    <input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="register-password">
                        Password
                    </label>

                    <input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />

                    <button
                        type="submit"
                        className="primary-button full-width"
                    >
                        Create account
                        <ArrowRight size={15} />
                    </button>

                </form>

                {message && (
                    <p className="error-message" role="status">
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
