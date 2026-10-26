
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function IssueCard({ issue }) {
    return (
        <div className="issue-card">
            <div className="issue-card-top">
                <span className="category">
                    {issue.category}
                </span>

                <StatusBadge status={issue.status} />
            </div>

            <h3>{issue.title}</h3>

            <p className="location">
                📍 {issue.location}
            </p>

            <p>
                Severity: <strong>{issue.severity}</strong>
            </p>

            <Link
                to={`/issues/${issue.id}`}
                className="view-details-btn"
            >
                View Details →
            </Link>
        </div>
    );
}

export default IssueCard;
