function Register() {
    return (
        <main className="form-page">
            <div className="form-container">
                <p className="eyebrow">
                    CREATE ACCOUNT
                </p>

                <h1>Join CivicLens</h1>

                <form>
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Your name"
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Create a password"
                    />

                    <button
                        type="button"
                        className="primary-button full-width"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </main>
    );
}

export default Register;