
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    ClipboardList,
    RefreshCw
} from "lucide-react";

import IssueCard from "../components/IssueCard";

function BrowseIssues() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                        {loading ? "—" : issues.length}
                    </span>

                    <span className="directory-count-label">
                        {issues.length === 1 ? "REPORTED ISSUE" : "REPORTED ISSUES"}
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

            ) : (

                <div className="issues-grid">
                    {issues.map(issue => (
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
