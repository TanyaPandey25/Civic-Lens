
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    ClipboardList,
    RefreshCw,
    SlidersHorizontal,
    RotateCcw
} from "lucide-react";

import IssueCard from "../components/IssueCard";

const buildings = [
    "PJ Block",
    "PG Block",
    "Science Block",
    "Mechanical Block",
    "APS Block"
];

const floors = Array.from({ length: 7 }, (_, index) =>
    String(index + 1)
);

const severities = ["Low", "Medium", "High"];

const statuses = [
    "Reported",
    "Under Investigation",
    "Action Taken",
    "Resolved"
];

// Extract building, floor and classroom from the saved location.
function getLocationParts(location = "") {
    const parts = location.split(",").map(part => part.trim());

    const floorMatch = parts[1]?.match(/^Floor\s+(\d+)$/i);
    const classroomMatch = parts[2]?.match(/^CR-\d+$/i);

    return {
        building: parts[0] || "",
        floor: floorMatch ? floorMatch[1] : "",
        classroom: classroomMatch ? parts[2] : ""
    };
}

function BrowseIssues() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter states
    const [building, setBuilding] = useState("");
    const [floor, setFloor] = useState("");
    const [classroom, setClassroom] = useState("");
    const [category, setCategory] = useState("");
    const [severity, setSeverity] = useState("");
    const [status, setStatus] = useState("");

    const classrooms = floor
        ? Array.from({ length: 8 }, (_, index) =>
            `CR-${floor}0${index + 1}`
        )
        : [];

    const fetchIssues = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/issues"
            );

            setIssues(
                Array.isArray(response.data.issues)
                    ? response.data.issues
                    : []
            );

        } catch (err) {
            setError("We couldn't load the reports. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    // Get categories from the reports currently loaded.
    const categories = [
        ...new Set(
            issues
                .map(issue => issue.category || "General")
                .filter(Boolean)
        )
    ].sort((a, b) => a.localeCompare(b));

    // Apply all selected filters together.
    const filteredIssues = issues.filter(issue => {
        const locationParts = getLocationParts(issue.location || "");

        const matchesBuilding =
            !building || locationParts.building === building;

        const matchesFloor =
            !floor || locationParts.floor === floor;

        const matchesClassroom =
            !classroom || locationParts.classroom === classroom;

        const matchesCategory =
            !category || (issue.category || "General") === category;

        const matchesSeverity =
            !severity || issue.severity === severity;

        const matchesStatus =
            !status || issue.status === status;

        return (
            matchesBuilding &&
            matchesFloor &&
            matchesClassroom &&
            matchesCategory &&
            matchesSeverity &&
            matchesStatus
        );
    });

    const hasActiveFilters =
        building || floor || classroom ||
        category || severity || status;

    const clearFilters = () => {
        setBuilding("");
        setFloor("");
        setClassroom("");
        setCategory("");
        setSeverity("");
        setStatus("");
    };

    const handleBuildingChange = (event) => {
        setBuilding(event.target.value);
        setFloor("");
        setClassroom("");
    };

    const handleFloorChange = (event) => {
        setFloor(event.target.value);
        setClassroom("");
    };

    return (
        <main className="issues-page">

            <div className="page-heading">

                <p className="eyebrow">
                    THE CAMPUS DIRECTORY
                </p>

                <h1>
                    What's happening on campus?
                </h1>

                <p>
                    A shared record of campus concerns.
                    Browse reported issues and follow their
                    progress from submission to resolution.
                </p>

            </div>

            <div className="directory-toolbar">

                <div>
                    <span className="directory-count">
                        {loading ? "—" : filteredIssues.length}
                    </span>

                    <span className="directory-count-label">
                        {hasActiveFilters
                            ? "MATCHING ISSUES"
                            : filteredIssues.length === 1
                                ? "REPORTED ISSUE"
                                : "REPORTED ISSUES"}
                    </span>
                </div>

                <button
                    type="button"
                    className="refresh-button"
                    onClick={fetchIssues}
                    disabled={loading}
                >
                    <RefreshCw size={14} />
                    Refresh
                </button>

            </div>

            {!loading && !error && issues.length > 0 && (

                <section className="issue-filters">

                    <div className="filters-heading">

                        <div className="filters-title">
                            <SlidersHorizontal size={17} />

                            <div>
                                <h2>Filter reports</h2>
                                <p>
                                    Narrow down issues by location and status.
                                </p>
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                className="clear-filters-button"
                                onClick={clearFilters}
                            >
                                <RotateCcw size={13} />
                                Clear filters
                            </button>
                        )}

                    </div>

                    <div className="filters-grid">

                        <div className="filter-field">
                            <label htmlFor="filter-building">
                                Building
                            </label>

                            <select
                                id="filter-building"
                                value={building}
                                onChange={handleBuildingChange}
                            >
                                <option value="">All buildings</option>

                                {buildings.map(item => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-field">
                            <label htmlFor="filter-floor">
                                Floor
                            </label>

                            <select
                                id="filter-floor"
                                value={floor}
                                onChange={handleFloorChange}
                                disabled={!building}
                            >
                                <option value="">All floors</option>

                                {floors.map(item => (
                                    <option key={item} value={item}>
                                        Floor {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-field">
                            <label htmlFor="filter-classroom">
                                Classroom
                            </label>

                            <select
                                id="filter-classroom"
                                value={classroom}
                                onChange={event =>
                                    setClassroom(event.target.value)
                                }
                                disabled={!floor}
                            >
                                <option value="">All classrooms</option>

                                {classrooms.map(item => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-field">
                            <label htmlFor="filter-category">
                                Category
                            </label>

                            <select
                                id="filter-category"
                                value={category}
                                onChange={event =>
                                    setCategory(event.target.value)
                                }
                            >
                                <option value="">All categories</option>

                                {categories.map(item => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-field">
                            <label htmlFor="filter-severity">
                                Severity
                            </label>

                            <select
                                id="filter-severity"
                                value={severity}
                                onChange={event =>
                                    setSeverity(event.target.value)
                                }
                            >
                                <option value="">All severities</option>

                                {severities.map(item => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-field">
                            <label htmlFor="filter-status">
                                Status
                            </label>

                            <select
                                id="filter-status"
                                value={status}
                                onChange={event =>
                                    setStatus(event.target.value)
                                }
                            >
                                <option value="">All statuses</option>

                                {statuses.map(item => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                </section>
            )}

            {loading ? (

                <div className="loading-message">
                    <RefreshCw size={19} className="loading-icon" />
                    <p>Loading campus reports...</p>
                </div>

            ) : error ? (

                <div className="directory-empty">

                    <ClipboardList size={28} />

                    <h2>Couldn't load the reports.</h2>

                    <p>{error}</p>

                    <button
                        className="primary-button"
                        onClick={fetchIssues}
                    >
                        Try again
                    </button>

                </div>

            ) : issues.length === 0 ? (

                <div className="directory-empty">

                    <ClipboardList size={32} />

                    <h2>Nothing reported yet.</h2>

                    <p>
                        Every improvement starts with someone
                        speaking up. Be the first to report
                        a campus problem.
                    </p>

                    <Link
                        to="/report"
                        className="primary-button"
                    >
                        Submit the first report
                        <ArrowRight size={15} />
                    </Link>

                </div>

            ) : filteredIssues.length === 0 ? (

                <div className="directory-empty filter-empty">

                    <SlidersHorizontal size={30} />

                    <h2>No matching reports.</h2>

                    <p>
                        No reports match all the selected filters.
                        Try changing your selections or clearing them.
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={clearFilters}
                    >
                        <RotateCcw size={14} />
                        Clear filters
                    </button>

                </div>

            ) : (

                <div className="issues-grid">
                    {filteredIssues.map(issue => (
                        <IssueCard
                            key={issue.id}
                            issue={issue}
                        />
                    ))}
                </div>

            )}

        </main>
    );
}

export default BrowseIssues;
