import { Link } from "react-router-dom";

function Home() {
    return (
        <main>
            <section className="hero">
                <div className="hero-content">
                    <p className="eyebrow">
                        CAMPUS ISSUE REPORTING
                    </p>

                    <h1>
                        Make campus problems
                        <span> visible.</span>
                    </h1>

                    <p className="hero-text">
                        Report everyday campus problems,
                        track their progress, and help create
                        a better campus for everyone.
                    </p>

                    <div className="hero-buttons">
                        <Link
                            to="/report"
                            className="primary-button"
                        >
                            Report an Issue
                        </Link>

                        <Link
                            to="/issues"
                            className="secondary-button"
                        >
                            Browse Issues
                        </Link>
                    </div>
                </div>
            </section>

            <section className="how-section">
                <div className="section-heading">
                    <p className="eyebrow">HOW IT WORKS</p>

                    <h2>
                        From experience to action.
                    </h2>
                </div>

                <div className="steps">
                    <div className="step">
                        <span>01</span>
                        <h3>Describe</h3>
                        <p>
                            Tell CivicLens what happened
                            in your own words.
                        </p>
                    </div>

                    <div className="step">
                        <span>02</span>
                        <h3>Understand</h3>
                        <p>
                            The problem is structured
                            into useful information.
                        </p>
                    </div>

                    <div className="step">
                        <span>03</span>
                        <h3>Track</h3>
                        <p>
                            Follow the issue from reporting
                            to resolution.
                        </p>
                    </div>

                    <div className="step">
                        <span>04</span>
                        <h3>Resolve</h3>
                        <p>
                            Verify whether the problem
                            was actually fixed.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;