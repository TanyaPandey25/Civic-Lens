import { useState } from "react";
import axios from "axios";

function ReportIssue() {
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/reports",
                {
                    description,
                    location
                }
            );

            setMessage(response.data.message);

            setDescription("");
            setLocation("");
        } catch (error) {
            setMessage(
                "Unable to submit report. Please try again."
            );
        }
    };

    return (
        <main className="form-page">
            <div className="form-container">
                <p className="eyebrow">
                    REPORT A PROBLEM
                </p>

                <h1>What happened?</h1>

                <p className="form-intro">
                    Describe the campus problem in your
                    own words. You don't need to know
                    which department handles it.
                </p>

                <form onSubmit={handleSubmit}>
                    <label>
                        Describe the issue
                    </label>

                    <textarea
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        placeholder="Example: The corridor outside Room 302 becomes slippery whenever it rains..."
                        required
                    />

                    <label>
                        Where did it happen?
                    </label>

                    <input
                        type="text"
                        value={location}
                        onChange={(event) =>
                            setLocation(event.target.value)
                        }
                        placeholder="Example: Block A, 3rd Floor, Room 302"
                        required
                    />

                    <button
                        type="submit"
                        className="primary-button full-width"
                    >
                        Submit Report
                    </button>
                </form>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}
            </div>
        </main>
    );
}

export default ReportIssue;