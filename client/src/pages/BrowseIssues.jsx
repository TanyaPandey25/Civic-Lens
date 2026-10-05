import { useEffect, useState } from "react";
import axios from "axios";
import IssueCard from "../components/IssueCard";

function BrowseIssues() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/issues"
                );

                setIssues(response.data.issues);
            } catch (error) {
                console.error("Failed to fetch issues");
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    return (
        <main className="issues-page">
            <div className="page-heading">
                <p className="eyebrow">
                    CAMPUS ISSUES
                </p>

                <h1>What is happening on campus?</h1>

                <p>
                    Browse reported problems and see
                    which issues are being tracked.
                </p>
            </div>

            {loading ? (
                <p>Loading issues...</p>
            ) : (
                <div className="issues-grid">
                    {issues.map((issue) => (
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