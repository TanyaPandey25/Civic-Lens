
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    ArrowUpRight,
    MapPin,
    Image as ImageIcon,
    Check,
    ClipboardList,
    ChartNoAxesColumn,
    CircleCheck,
    FileText
} from "lucide-react";

const API = "http://localhost:5000/api";

const STATUSES = [
    "Reported",
    "Under Investigation",
    "Action Taken",
    "Resolved"
];

function Home() {
    const [issues, setIssues] = useState([]);
    const [count, setCount] = useState(null);
    const [displayCount, setDisplayCount] = useState(0);

    const displayedCountRef = useRef(0);

    useEffect(() => {
        let isMounted = true;

        const fetchIssues = async () => {
            try {
                const response = await fetch(`${API}/issues`);

                if (!response.ok) {
                    throw new Error("Failed to fetch reports");
                }

                const data = await response.json();

                const reports = Array.isArray(data.issues)
                    ? data.issues
                    : [];

                if (isMounted) {
                    setIssues(reports);
                    setCount(reports.length);
                }
            } catch (error) {
                console.error("Report count error:", error);
            }
        };

        fetchIssues();

        const interval = setInterval(fetchIssues, 10000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (count === null) return;

        const start = displayedCountRef.current;
        const difference = count - start;
        const duration = 1200;
        const startTime = performance.now();

        let animationFrame;

        const animate = (currentTime) => {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const eased = 1 - Math.pow(1 - progress, 4);

            const currentNumber = Math.round(
                start + difference * eased
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

    const statusCounts = STATUSES.reduce((result, status) => {
        result[status] = issues.filter(
            issue => issue.status === status
        ).length;

        return result;
    }, {});

    const totalIssues = issues.length;

    const maxStatusCount = Math.max(
        ...Object.values(statusCounts),
        1
    );

    const latestIssue = [...issues].sort(
        (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
    )[0];

    const currentStage = latestIssue
        ? STATUSES.indexOf(latestIssue.status)
        : -1;

    const resolvedCount = statusCounts["Resolved"];

    return (
        <main>

            {/* HERO */}

            <section className="hero">
                <div className="hero-content">

                    <p className="eyebrow">
                        A BETTER CAMPUS STARTS HERE
                    </p>

                    <h1>
                        Make campus problems
                        <span> visible.</span>
                    </h1>

                    <p className="hero-text">
                        The leaking ceiling. The broken lights.
                        The problems everyone notices but nobody
                        knows where to report.

                        CivicLens gives every campus concern
                        a place to be heard and tracked.
                    </p>

                    <div className="hero-buttons">
                        <Link
                            to="/report"
                            className="primary-button"
                        >
                            Report a problem
                            <ArrowRight size={15} />
                        </Link>

                        <Link
                            to="/issues"
                            className="secondary-button"
                        >
                            Explore reports
                            <ArrowUpRight size={15} />
                        </Link>
                    </div>

                    <div className="report-counter">

                        <div className="counter-icon">
                            <ClipboardList size={22} color="#9AB9A5" />
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
                            LIVE
                        </div>

                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}

            <section className="how-section">

                <div className="section-heading">
                    <p className="eyebrow">
                        THE PROCESS
                    </p>

                    <h2>
                        From experience to action.
                    </h2>

                    <p>
                        A simple process that makes campus
                        concerns easier to communicate,
                        understand and resolve.
                    </p>
                </div>

                <div className="steps">

                    {/* 01 — DESCRIBE */}

                    <article className="step visual-step">

                        <div className="step-heading">
                            <span>01</span>
                            <span className="step-indicator">
                                REPORTING
                            </span>
                        </div>

                        <h3>Describe</h3>

                        <p>
                            Tell us what happened and where.
                            Add a photograph if it helps.
                        </p>

                        <div className="step-visual describe-visual">

                            <div className="demo-window">

                                <div className="demo-window-top">
                                    <span></span>
                                    <span></span>
                                    <span></span>

                                    <small>NEW REPORT</small>
                                </div>

                                <div className="demo-form">

                                    <div className="demo-form-label">
                                        DESCRIBE THE ISSUE
                                    </div>

                                    <div className="typing-line">
                                        Broken lights in the corridor
                                    </div>

                                    <div className="demo-form-label">
                                        LOCATION
                                    </div>

                                    <div className="demo-input">
                                        <MapPin size={10} />
                                        CSE Block, 2nd Floor
                                    </div>

                                    <div className="demo-form-label">
                                        ATTACH PHOTOGRAPH
                                    </div>

                                    <div className="demo-upload">

                                        <div className="demo-photo">
                                            <ImageIcon size={15} />
                                        </div>

                                        <div>
                                            <strong>
                                                campus-issue.jpg
                                            </strong>

                                            <small>
                                                Photograph attached
                                            </small>
                                        </div>

                                        <Check
                                            size={14}
                                            color="#427B62"
                                        />
                                    </div>

                                    <div className="demo-submit">
                                        Report submitted
                                        <Check size={12} />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </article>

                    {/* 02 — UNDERSTAND */}

                    <article className="step visual-step">

                        <div className="step-heading">
                            <span>02</span>
                            <span className="step-indicator live-indicator">
                                LIVE ANALYTICS
                            </span>
                        </div>

                        <h3>Understand</h3>

                        <p>
                            Identify patterns across reported
                            campus problems.
                        </p>

                        <div className="step-visual analytics-visual">

                            <div className="analytics-top">
                                <div>
                                    <small>TOTAL REPORTS</small>
                                    <strong>{totalIssues}</strong>
                                </div>

                                <span className="analytics-live-dot">
                                    LIVE
                                </span>
                            </div>

                            <div className="analytics-bars">

                                {STATUSES.map((status, index) => (
                                    <div
                                        className="analytics-row"
                                        key={status}
                                    >
                                        <div className="analytics-label">

                                            <span
                                                className={`status-dot status-dot-${index}`}
                                            />

                                            <span>{status}</span>

                                            <strong>
                                                {statusCounts[status]}
                                            </strong>
                                        </div>

                                        <div className="analytics-track">
                                            <div
                                                className={`analytics-fill analytics-fill-${index}`}
                                                style={{
                                                    width: `${
                                                        (statusCounts[status] /
                                                        maxStatusCount) * 100
                                                    }%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}

                            </div>

                            <div className="analytics-footer">
                                <span>ISSUE DISTRIBUTION</span>
                                <span>Updates every 10 sec</span>
                            </div>
                        </div>
                    </article>

                    {/* 03 — TRACK */}

                    <article className="step visual-step">

                        <div className="step-heading">
                            <span>03</span>
                            <span className="step-indicator live-indicator">
                                LIVE STATUS
                            </span>
                        </div>

                        <h3>Track</h3>

                        <p>
                            Follow reported issues through
                            every stage of progress.
                        </p>

                        <div className="step-visual track-visual">

                            <div className="track-ticket">

                                <div>
                                    <small>
                                        LATEST REPORTED ISSUE
                                    </small>

                                    <strong>
                                        {latestIssue
                                            ? latestIssue.title
                                            : "Waiting for a report"}
                                    </strong>
                                </div>

                                <ArrowUpRight
                                    size={17}
                                    color="#286A64"
                                />
                            </div>

                            <div className="track-location">
                                <MapPin size={11} />
                                {latestIssue?.location || "Campus location"}
                            </div>

                            <div className="track-timeline">

                                {STATUSES.map((status, index) => {
                                    const completed =
                                        currentStage >= index;

                                    return (
                                        <div
                                            className={`track-stage ${
                                                completed ? "completed" : ""
                                            } ${
                                                currentStage === index
                                                    ? "active"
                                                    : ""
                                            }`}
                                            key={status}
                                        >
                                            <span className="track-stage-dot">
                                                {completed && (
                                                    <Check size={9} />
                                                )}
                                            </span>

                                            <span>{status}</span>
                                        </div>
                                    );
                                })}

                            </div>

                            <div className="track-footer">
                                {latestIssue
                                    ? `Current status: ${latestIssue.status}`
                                    : "Submit an issue to see its progress"}
                            </div>
                        </div>
                    </article>

                    {/* 04 — RESOLVE */}

                    <article className="step visual-step">

                        <div className="step-heading">
                            <span>04</span>
                            <span className="step-indicator">
                                CAMPUS IMPACT
                            </span>
                        </div>

                        <h3>Resolve</h3>

                        <p>
                            Track progress and see how many
                            reported problems have been resolved.
                        </p>

                        <div className="step-visual resolve-visual">

                            <div className="resolve-circle">

                                <svg
                                    viewBox="0 0 100 100"
                                    className="resolve-ring"
                                >
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="43"
                                        className="resolve-ring-bg"
                                    />

                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="43"
                                        className="resolve-ring-progress"
                                    />
                                </svg>

                                <CircleCheck
                                    size={35}
                                    color="#286A64"
                                    strokeWidth={1.5}
                                />
                            </div>

                            <strong>
                                Progress matters.
                            </strong>

                            <div className="resolve-stat">
                                <span>Issues resolved</span>
                                <strong>{resolvedCount}</strong>
                            </div>

                            <div className="resolve-caption">
                                Every resolved issue makes
                                campus a better place.
                            </div>
                        </div>
                    </article>

                </div>
            </section>

        </main>
    );
}

export default Home;
