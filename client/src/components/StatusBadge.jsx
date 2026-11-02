
function StatusBadge({ status }) {
    const statusClass = {
        "Reported": "status-reported",
        "Under Investigation": "status-under-investigation",
        "Action Taken": "status-action-taken",
        "Resolved": "status-resolved"
    };

    return (
        <span
            className={`status-badge ${statusClass[status] || ""}`}
        >
            {status}
        </span>
    );
}

export default StatusBadge;
