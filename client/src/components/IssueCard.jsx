
import { Link } from "react-router-dom";
import { MapPin, ArrowUpRight, Users } from "lucide-react";
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
                <MapPin size={13} />
                {issue.location}
            </p>

            <p>
                Severity: <strong>{issue.severity}</strong>
            </p>

            <div className="issue-card-bottom">
                <span className="view-details-btn">
                    <Users size={13} />
                    {issue.reportCount || 1} student report(s)
                </span>

                <ArrowUpRight
                    size={17}
                    color="var(--teal)"
                />
            </div>
        </Link>
    );
}

export default IssueCard;
