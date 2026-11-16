
import { useEffect, useRef, useState } from "react";
import {
    ArrowUpRight,
    MapPin,
    Check,
    ClipboardList,
    CircleCheck,
    Activity
} from "lucide-react";

const API = "http://localhost:5000/api";

const STATUSES = [
    "Reported",
    "Under Investigation",
    "Action Taken",
    "Resolved"
];

const PROCESS_STAGES = [
    {
        number: "01",
        label: "THE FIRST SIGNAL",
        title: "Notice it. Report it.",
        description:
            "Every improvement begins when someone speaks up. Share what happened and where."
    },
    {
        number: "02",
        label: "SEE THE BIGGER PICTURE",
        title: "Understand the pattern.",
        description:
            "Individual reports help reveal recurring concerns and areas that need attention."
    },
    {
        number: "03",
        label: "MOVE TOWARDS CHANGE",
        title: "Turn insight into action.",
        description:
            "Follow each concern as it moves through the campus resolution process."
    },
    {
        number: "04",
        label: "A BETTER CAMPUS",
        title: "Make progress visible.",
        description:
            "Every resolved issue is a step towards a safer, better-maintained campus."
    }
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
    const resolvedCount = statusCounts["Resolved"];

    const latestIssue = [...issues].sort(
        (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
    )[0];

    const currentStage = latestIssue
        ? STATUSES.indexOf(latestIssue.status)
        : -1;

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

            {/* CAMPUS PULSE */}

            <section
                className="campus-pulse"
                aria-labelledby="pulse-title"
            >

                <div className="pulse-heading">

                    <p className="eyebrow">
                        CAMPUS PULSE / THE JOURNEY
                    </p>

                    <h2 id="pulse-title">
                        Every report moves
                        <span> campus forward.</span>
                    </h2>

                    <p>
                        From the first observation to a visible
                        resolution. Small actions create meaningful
                        change across campus.
                    </p>

                </div>

                <div className="pulse-layout">

                    {/* CONNECTED PROCESS */}

                    <div className="pulse-timeline">

                        {PROCESS_STAGES.map((stage, index) => {
                            const completed =
                                currentStage > index;

                            const active =
                                currentStage === index;

                            return (
                                <article
                                    className={`pulse-stage ${
                                        completed ? "is-completed" : ""
                                    }`}
                                >

                                    <div className="pulse-stage-marker">
                                        <span className="pulse-stage-number">
                                            {completed ? (
                                                <Check size={15} />
                                            ) : (
                                                stage.number
                                            )}
                                        </span>
                                    </div>

                                    <div className="pulse-stage-content">

                                        <div className="pulse-stage-meta">
                                            <span>{stage.label}</span>

                                            {active && (
                                                <span className="pulse-current-label">
                                                    LATEST ISSUE HERE
                                                </span>
                                            )}
                                        </div>

                                        <h3>{stage.title}</h3>

                                        <p>{stage.description}</p>

                                    </div>

                                </article>
                            );
                        })}

                    </div>

                    {/* LIVE CAMPUS SNAPSHOT */}

                    <aside className="pulse-side">

                        <div className="pulse-live-card">

                            <div className="pulse-card-header">

                                <div className="pulse-card-heading">
                                    <Activity size={16} />
                                    <span>LIVE CAMPUS SNAPSHOT</span>
                                </div>

                                <span className="pulse-live-indicator">
                                    <span className="live-dot"></span>
                                    LIVE
                                </span>

                            </div>

                            <div className="pulse-total">

                                <span className="pulse-stat-label">
                                    TOTAL REPORTED ISSUES
                                </span>

                                <div>
                                    {totalIssues.toString().padStart(2, "0")}
                                    <span> reports</span>
                                </div>

                            </div>

                            <div className="pulse-stat-grid">

                                <div className="pulse-stat">
                                    <span className="pulse-stat-label">
                                        RESOLVED
                                    </span>

                                    <strong>{resolvedCount}</strong>
                                </div>

                                <div className="pulse-stat">
                                    <span className="pulse-stat-label">
                                        IN PROGRESS
                                    </span>

                                    <strong>
                                        {statusCounts["Under Investigation"] +
                                            statusCounts["Action Taken"]}
                                    </strong>
                                </div>

                            </div>

                            <div className="pulse-latest">

                                <div className="pulse-latest-heading">
                                    <span>RECENT CAMPUS CONCERN</span>
                                    <ArrowUpRight size={16} />
                                </div>

                                {latestIssue ? (
                                    <>
                                        <h3>{latestIssue.title}</h3>

                                        <p className="pulse-latest-location">
                                            <MapPin size={13} />
                                            {latestIssue.location || "Campus location"}
                                        </p>

                                        <div className="pulse-latest-status">
                                            <span className="pulse-status-dot"></span>
                                            {latestIssue.status}
                                        </div>
                                    </>
                                ) : (
                                    <div className="pulse-empty">
                                        <CircleCheck size={22} />

                                        <p>
                                            No reports yet. Your first
                                            report can start the change.
                                        </p>
                                    </div>
                                )}

                            </div>

                            <div className="pulse-card-footer">
                                <span>COMMUNITY-DRIVEN CHANGE</span>
                                <span>CIVICLENS</span>
                            </div>

                        </div>

                        <p className="pulse-side-note">
                            Every voice matters.
                            <span> Every report counts.</span>
                        </p>

                    </aside>

                </div>

            </section>

        </main>
    );
}

export default Home;
