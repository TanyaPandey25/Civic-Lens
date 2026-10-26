
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

function IssueDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchIssue = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(`${API}/issues/${id}`);
            setIssue(response.data.issue);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load this issue."
            );
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
            const response = await axios.patch(
                `${API}/issues/${id}`,
                { status }
            );

            setIssue(response.data.issue);
            setMessage("Issue status updated successfully.");
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Failed to update issue."
            );
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
        }
    };

    if (loading) {
        return <main className="details-page"><p>Loading issue...</p></main>;
    }

    if (error) {
        return (
            <main className="details-page">
                <p>{error}</p>
                <button onClick={() => navigate("/issues")}>
                    Back to Issues
                </button>
            </main>
        );
    }

    if (!issue) return null;

    return (
        <main className="details-page">
            <div className="details-container">
                <p className="eyebrow">CAMPUS ISSUE</p>

                <h1>{issue.title}</h1>
                <p className="location">{issue.location}</p>

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
                        <span>Created</span>
                        <strong>
                            {issue.createdAt
                                ? new Date(issue.createdAt).toLocaleDateString()
                                : "N/A"}
                        </strong>
                    </div>
                </div>

                <section className="issue-description">
                    <h2>Description</h2>
                    <p>{issue.description}</p>
                </section>

                <label htmlFor="issue-status">Update status</label>
                <select
                    id="issue-status"
                    value={issue.status}
                    onChange={updateStatus}
                >
                    <option value="Reported">Reported</option>
                    <option value="Under Investigation">
                        Under Investigation
                    </option>
                    <option value="Action Taken">Action Taken</option>
                    <option value="Resolved">Resolved</option>
                </select>

                {message && <p>{message}</p>}

                <div className="issue-actions">
                    <button
                        className="secondary-button"
                        onClick={() => navigate("/issues")}
                    >
                        Back to Issues
                    </button>

                    <button
                        className="primary-button"
                        onClick={deleteIssue}
                    >
                        Delete Issue
                    </button>
                </div>
            </div>
        </main>
    );
}

export default IssueDetails;
