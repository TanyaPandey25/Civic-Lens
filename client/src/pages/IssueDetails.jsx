
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft,
    MapPin,
    CalendarDays,
    Trash2,
    RefreshCw,
    Image as ImageIcon
} from "lucide-react";

import StatusBadge from "../components/StatusBadge";

const API = "http://localhost:5000/api";

function IssueDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [updating, setUpdating] = useState(false);

    const fetchIssue = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await axios.get(`${API}/issues/${id}`);
            setIssue(response.data.issue);

        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to load this issue."
            );
            setMessageType("error");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssue();
    }, [id]);

    const updateStatus = async (event) => {
        const status = event.target.value;

        try {
            setUpdating(true);
            setMessage("");

            const response = await axios.patch(
                `${API}/issues/${id}`,
                { status }
            );

            setIssue(response.data.issue);
            setMessage("The issue status has been updated.");
            setMessageType("success");

        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Failed to update issue."
            );
            setMessageType("error");

        } finally {
            setUpdating(false);
        }
    };

    const deleteIssue = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this issue?"
        );

        if (!confirmed) return;

        try {
            await axios.delete(`${API}/issues/${id}`);
            navigate("/issues");

        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Failed to delete issue."
            );
            setMessageType("error");
        }
    };

    if (loading) {
        return (
            <main className="details-page">
                <div className="loading-message">
                    <RefreshCw size={20} />
                    <p>Loading issue details...</p>
                </div>
            </main>
        );
    }

    if (!issue) {
        return (
            <main className="details-page">

                <div className="directory-empty">
                    <h2>Issue not found.</h2>

                    <p>
                        This report may have been removed
                        or is no longer available.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() => navigate("/issues")}
                    >
                        <ArrowLeft size={15} />
                        Back to issues
                    </button>
                </div>

            </main>
        );
    }

    return (
        <main className="details-page">

            <div className="details-container">

                <button
                    className="back-link"
                    onClick={() => navigate("/issues")}
                >
                    <ArrowLeft size={15} />
                    All campus issues
                </button>

                <div className="details-intro">

                    <p className="eyebrow">
                        CAMPUS ISSUE RECORD
                    </p>

                    <div className="details-status">
                        <StatusBadge status={issue.status} />

                        <span className="category">
                            {issue.category}
                        </span>
                    </div>

                    <h1>{issue.title}</h1>

                    <p className="details-location">
                        <MapPin size={15} />
                        {issue.location}
                    </p>

                </div>

                <div className="details-grid">

                    <div>
                        <span>Category</span>
                        <strong>{issue.category}</strong>
                    </div>

                    <div>
                        <span>Severity</span>
                        <strong>{issue.severity}</strong>
                    </div>

                    <div>
                        <span>Status</span>
                        <strong>{issue.status}</strong>
                    </div>

                    <div>
                        <span>Reported on</span>
                        <strong>
                            {issue.createdAt
                                ? new Date(issue.createdAt)
                                    .toLocaleDateString("en-IN")
                                : "N/A"}
                        </strong>
                    </div>

                </div>

                <section className="issue-description">

                    <p className="eyebrow">
                        THE REPORT
                    </p>

                    <h2>What happened?</h2>

                    <p>{issue.description}</p>

                </section>

                {issue.imageUrl && (
                    <section className="issue-image-section">

                        <h2>
                            <ImageIcon size={17} />
                            Attached photograph
                        </h2>

                        <img
                            src={`http://localhost:5000${issue.imageUrl}`}
                            alt="Photograph of the reported campus issue"
                            className="issue-detail-image"
                        />

                    </section>
                )}

                <section className="status-update-section">

                    <div>
                        <p className="eyebrow">
                            MANAGEMENT
                        </p>

                        <h2>Update issue status</h2>

                        <p>
                            Record the latest progress
                            on this campus concern.
                        </p>
                    </div>

                    <label htmlFor="issue-status">
                        Current status
                    </label>

                    <select
                        id="issue-status"
                        value={issue.status}
                        onChange={updateStatus}
                        disabled={updating}
                    >
                        <option value="Reported">
                            Reported
                        </option>

                        <option value="Under Investigation">
                            Under Investigation
                        </option>

                        <option value="Action Taken">
                            Action Taken
                        </option>

                        <option value="Resolved">
                            Resolved
                        </option>
                    </select>

                    {updating && (
                        <p className="form-hint">
                            Updating status...
                        </p>
                    )}

                </section>

                {message && (
                    <p
                        className={
                            messageType === "error"
                                ? "error-message"
                                : "success-message"
                        }
                        role="status"
                    >
                        {message}
                    </p>
                )}

                <div className="issue-actions">

                    <button
                        className="secondary-button"
                        onClick={() => navigate("/issues")}
                    >
                        <ArrowLeft size={14} />
                        Back to issues
                    </button>

                    <button
                        className="delete-button"
                        onClick={deleteIssue}
                    >
                        <Trash2 size={14} />
                        Delete issue
                    </button>

                </div>

            </div>
        </main>
    );
}

export default IssueDetails;
