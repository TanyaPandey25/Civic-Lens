function Login() {
    return (
        <main className="form-page">
            <div className="form-container">
                <p className="eyebrow">WELCOME BACK</p>

                <h1>Login to CivicLens</h1>

                <form>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                    />

                    <button
                        type="button"
                        className="primary-button full-width"
                    >
                        Login
                    </button>
                </form>
            </div>
        </main>
    );
}

export default Login;