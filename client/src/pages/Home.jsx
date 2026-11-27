
import { useEffect, useRef, useState, Suspense } from "react";
import {
    ArrowLeft,
    ArrowRight,
    ClipboardList,
    MapPin,
    Layers3,
    Search,
    Wrench,
    CircleCheck
} from "lucide-react";

import { Canvas } from "@react-three/fiber";
import { Model } from "../components/companions/PlumberModel";

const API = "https://civiclens-backend-oru7.onrender.com/api";

const STATUSES = [
    "Reported",
    "Under Investigation",
    "Action Taken",
    "Resolved"
];

const JOURNEY_CARDS = [
    {
        number: "01",
        label: "THE FIRST SIGNAL",
        title: "Notice it. Report it.",
        description:
            "Every improvement begins when someone speaks up. Give campus concerns a place to be heard.",
        icon: ClipboardList
    },
    {
        number: "02",
        label: "PINPOINT THE PROBLEM",
        title: "Know where it happens.",
        description:
            "Identify the exact locations where campus issues need attention.",
        icon: MapPin
    },
    {
        number: "03",
        label: "SEE THE BIGGER PICTURE",
        title: "Understand the pattern.",
        description:
            "Explore reported concerns and recognize recurring campus problems.",
        icon: Layers3
    },
    {
        number: "04",
        label: "MOVE TOWARDS CHANGE",
        title: "Prioritize what matters.",
        description:
            "Bring attention to reported concerns that need investigation and action.",
        icon: Search
    },
    {
        number: "05",
        label: "FOLLOW THE RESPONSE",
        title: "Track every update.",
        description:
            "Keep track of concerns as they move through the resolution process.",
        icon: Wrench
    },
    {
        number: "06",
        label: "A BETTER CAMPUS",
        title: "Make progress visible.",
        description:
            "Every resolved issue is a step towards a safer, better-maintained campus.",
        icon: CircleCheck
    }
];

// 3D PLUMBER COMPANION

function PlumberCompanion() {
    return (
        <div className="hero-companion">

            <div className="companion-model">
                <Canvas
                    camera={{
                        position: [0, 1.1, 4.5],
                        fov: 35
                    }}
                    gl={{
                        alpha: true,
                        antialias: true
                    }}
                >
                    <ambientLight intensity={1.5} />

                    <directionalLight
                        position={[3, 5, 4]}
                        intensity={2}
                    />

                    <Suspense fallback={null}>
                        <Model
                            animation="idle"
                            position={[0, -0.85, 0]}
                            scale={1}
                        />
                    </Suspense>
                </Canvas>
            </div>

            <div className="companion-thought">
                <span className="thought-label">
                    YOUR CAMPUS HELPER
                </span>

                <p>
                    Got a campus issue?
                    <br />
                    Let's get it fixed!
                </p>
            </div>

        </div>
    );
}

function Home() {
    const [issues, setIssues] = useState([]);
    const [count, setCount] = useState(null);
    const [displayCount, setDisplayCount] = useState(0);

    const displayedCountRef = useRef(0);
    const carouselRef = useRef(null);
    const isCarouselHovered = useRef(false);
    const manualPauseUntil = useRef(0);

    // Fetch live report data
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

    // Animate the live report counter
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

    // Automatically move the carousel continuously
    useEffect(() => {
        const carousel = carouselRef.current;

        if (!carousel) return;

        let animationFrame;
        let previousTime = 0;

        const moveCarousel = (currentTime) => {
            if (!previousTime) {
                previousTime = currentTime;
            }

            const delta = Math.min(
                currentTime - previousTime,
                40
            );

            previousTime = currentTime;

            const isManuallyPaused =
                currentTime < manualPauseUntil.current;

            if (
                !isCarouselHovered.current &&
                !isManuallyPaused
            ) {
                // Automatic movement speed: 25 pixels per second
                carousel.scrollLeft += delta * 0.025;
            }

            // Reset at the halfway point for a seamless loop
            const loopWidth = carousel.scrollWidth / 2;

            if (loopWidth > 0) {
                if (carousel.scrollLeft >= loopWidth) {
                    carousel.scrollLeft -= loopWidth;
                }

                if (carousel.scrollLeft < 0) {
                    carousel.scrollLeft += loopWidth;
                }
            }

            animationFrame = requestAnimationFrame(moveCarousel);
        };

        animationFrame = requestAnimationFrame(moveCarousel);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    // Manually move the carousel by one card
    const scrollCarousel = (direction) => {
        const carousel = carouselRef.current;

        if (!carousel) return;

        const card = carousel.querySelector(".journey-card");

        if (!card) return;

        const gap = window.innerWidth <= 700 ? 15 : 20;
        const cardWidth = card.offsetWidth + gap;
        const loopWidth = carousel.scrollWidth / 2;

        if (loopWidth <= 0) return;

        // Pause automatic movement briefly during manual navigation
        manualPauseUntil.current = performance.now() + 450;

        // Wrap to the duplicate set when moving backwards
        // from the beginning
        if (
            direction < 0 &&
            carousel.scrollLeft <= 1
        ) {
            carousel.scrollLeft = loopWidth;
        }

        // Move by exactly one card
        carousel.scrollLeft += direction * cardWidth;

        // Keep the scroll position inside the seamless loop
        if (carousel.scrollLeft >= loopWidth) {
            carousel.scrollLeft -= loopWidth;
        }

        if (carousel.scrollLeft < 0) {
            carousel.scrollLeft += loopWidth;
        }
    };

    // Calculate issue statistics
    const statusCounts = STATUSES.reduce((result, status) => {
        result[status] = issues.filter(
            issue => issue.status === status
        ).length;

        return result;
    }, {});

    const totalIssues = issues.length;
    const resolvedCount = statusCounts["Resolved"];

    const uniqueLocations = new Set(
        issues
            .map(issue => issue.location)
            .filter(Boolean)
    ).size;

    const uniqueCategories = new Set(
        issues
            .map(issue => issue.category)
            .filter(Boolean)
    ).size;

    const activeCount =
        statusCounts["Reported"] +
        statusCounts["Under Investigation"];

    const inProgressCount =
        statusCounts["Under Investigation"] +
        statusCounts["Action Taken"];

    // Statistics displayed on the six journey cards
    const cardMetrics = [
        {
            value: totalIssues.toString().padStart(2, "0"),
            label: "TOTAL REPORTS",
            isText: false
        },
        {
            value: uniqueLocations.toString().padStart(2, "0"),
            label: "CAMPUS LOCATIONS",
            isText: false
        },
        {
            value: uniqueCategories.toString().padStart(2, "0"),
            label: "ISSUE CATEGORIES",
            isText: false
        },
        {
            value: activeCount.toString().padStart(2, "0"),
            label: "NEEDING ATTENTION",
            isText: false
        },
        {
            value: inProgressCount.toString().padStart(2, "0"),
            label: "IN PROGRESS",
            isText: false
        },
        {
            value: resolvedCount.toString().padStart(2, "0"),
            label: "ISSUES RESOLVED",
            isText: false
        }
    ];

    // Render one complete set of journey cards
    const renderJourneyCards = (isDuplicate = false) => (
        <div
            className="pulse-marquee-group"
            aria-hidden={isDuplicate ? "true" : undefined}
        >
            {JOURNEY_CARDS.map((stage, index) => {
                const StageIcon = stage.icon;
                const metric = cardMetrics[index];

                return (
                    <article
                        className="journey-card"
                        key={`${isDuplicate ? "duplicate-" : ""}${stage.number}`}
                    >

                        <div className={`journey-card-visual journey-visual-${index + 1}`}>

                            <div className="journey-visual-top">
                                <span>
                                    CIVICLENS / {stage.number}
                                </span>

                                <StageIcon size={20} />
                            </div>

                            <div className="journey-visual-main">

                                <span className={`journey-visual-value ${
                                    metric.isText ? "is-text" : ""
                                }`}>
                                    {metric.value}
                                </span>

                                <span className="journey-visual-label">
                                    {metric.label}
                                </span>

                            </div>

                            <div className="journey-visual-lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>

                            <span className="journey-visual-number">
                                {stage.number}
                            </span>

                        </div>

                        <div className="journey-card-content">

                            <div className="journey-card-meta">
                                <span>{stage.label}</span>
                                <span>{stage.number} / 06</span>
                            </div>

                            <h3>{stage.title}</h3>

                            <p>{stage.description}</p>

                        </div>

                    </article>
                );
            })}
        </div>
    );

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
                            <ClipboardList
                                size={27}
                                color="#9AB9A5"
                                strokeWidth={1.8}
                            />
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

                {/* 3D PLUMBER */}

                <PlumberCompanion />

            </section>

            {/* CAMPUS PULSE CAROUSEL */}

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

                <div className="pulse-carousel-header">

                    <span className="pulse-carousel-caption">
                        EXPLORE THE JOURNEY
                    </span>

                </div>

                <div className="pulse-carousel-shell">

                    <button
                        type="button"
                        className="pulse-arrow pulse-arrow-left"
                        onClick={() => scrollCarousel(-1)}
                        aria-label="Previous cards"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div
                        className="pulse-carousel"
                        ref={carouselRef}
                        role="region"
                        aria-label="CivicLens campus journey cards"
                        onMouseEnter={() => {
                            isCarouselHovered.current = true;
                        }}
                        onMouseLeave={() => {
                            isCarouselHovered.current = false;
                        }}
                    >

                        <div className="pulse-marquee-track">

                            {renderJourneyCards()}

                            {renderJourneyCards(true)}

                        </div>

                    </div>

                    <button
                        type="button"
                        className="pulse-arrow pulse-arrow-right"
                        onClick={() => scrollCarousel(1)}
                        aria-label="Next cards"
                    >
                        <ArrowRight size={20} />
                    </button>

                </div>

            </section>

        </main>
    );
}

export default Home;
