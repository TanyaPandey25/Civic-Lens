
import { useEffect, useRef, useState } from "react";

function Home() {
    const [count, setCount] = useState(null);
    const [displayCount, setDisplayCount] = useState(0);

    const displayedCountRef = useRef(0);

    // Fetch actual report count from MongoDB through the backend
    useEffect(() => {
        let isMounted = true;

        const fetchReportCount = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/issues"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch reports");
                }

                const data = await response.json();

                // Read the reports from the API response
                const reports = Array.isArray(data)
                    ? data
                    : data.issues || data.data || [];

                if (isMounted && Array.isArray(reports)) {
                    setCount(reports.length);
                }
            } catch (error) {
                console.error("Report count error:", error);
            }
        };

        fetchReportCount();

        // Refresh count every 10 seconds
        const interval = setInterval(fetchReportCount, 10000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    // Animate the count from zero on initial page load
    useEffect(() => {
        if (count === null) return;

        const start = displayedCountRef.current;
        const difference = count - start;
        const duration = 2000;
        const startTime = performance.now();

        let animationFrame;

        const animate = (currentTime) => {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const easedProgress =
                1 - Math.pow(1 - progress, 4);

            const currentNumber = Math.round(
                start + difference * easedProgress
            );

            displayedCountRef.current = currentNumber;
            setDisplayCount(currentNumber);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [count]);

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

                    {/* Animated Report Counter */}
                    <div className="report-counter">
                        <div className="counter-icon">
                            <span></span>
                        </div>

                        <div className="counter-content">
                            <span className="counter-label">
                                CAMPUS IMPACT
                            </span>

                            <div className="counter-number">
                                {count === null ? "—" : displayCount}
                                <span className="counter-plus">+</span>
                            </div>

                            <p className="counter-description">
                                Reports submitted by students
                            </p>
                        </div>

                        <div className="counter-live">
                            <span className="live-dot"></span>
                            LIVE COUNT
                        </div>
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
