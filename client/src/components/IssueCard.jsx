import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function IssueCard({ issue }) {
    return (
        <Link
            to={`/issues/${issue.id}`}
            className="issue-card"
            aria-label={`View details for ${issue.title}`}
        >
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

            <p>
                Reports from students:{" "}
                <strong>{issue.reportCount || 1}</strong>
            </p>
        </Link>
    );
}

export default IssueCard;