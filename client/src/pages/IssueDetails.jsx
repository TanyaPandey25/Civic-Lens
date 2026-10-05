function IssueDetails() {
    return (
        <main className="details-page">
            <div className="details-container">
                <p className="eyebrow">
                    ISSUE #1042
                </p>

                <h1>
                    Recurring Slippery Corridor
                </h1>

                <p className="location">
                    📍 Corridor outside Room 302
                </p>

                <div className="details-grid">
                    <div>
                        <span>Category</span>
                        <strong>Safety</strong>
                    </div>

                    <div>
                        <span>Severity</span>
                        <strong>Medium</strong>
                    </div>

                    <div>
                        <span>Reports</span>
                        <strong>8</strong>
                    </div>

                    <div>
                        <span>Status</span>
                        <strong>
                            Under Investigation
                        </strong>
                    </div>
                </div>

                <section className="issue-description">
                    <h2>What students reported</h2>

                    <p>
                        The corridor outside Room 302
                        becomes extremely slippery whenever
                        it rains, creating a safety concern
                        for students.
                    </p>
                </section>

                <button className="secondary-button">
                    I'm experiencing this too
                </button>
            </div>
        </main>
    );
}

export default IssueDetails;