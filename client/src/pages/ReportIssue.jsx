
import { useEffect, useState } from "react";
import axios from "axios";

function ReportIssue() {
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!image) {
            setPreviewUrl("");
            return;
        }

        const url = URL.createObjectURL(image);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [image]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            setMessage("Please upload a JPG, PNG or WEBP image.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage("Image size must not exceed 5 MB.");
            event.target.value = "";
            return;
        }

        setMessage("");
        setImage(file);
    };

    const removeImage = () => {
        setImage(null);

        const input = document.getElementById("issue-image");

        if (input) {
            input.value = "";
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setMessage("");

            const formData = new FormData();

            formData.append("description", description);
            formData.append("location", location);

            if (image) {
                formData.append("image", image);
            }

            const response = await axios.post(
                "http://localhost:5000/api/reports",
                formData
            );

            setMessage(response.data.message);
            setDescription("");
            setLocation("");
            setImage(null);

            const input = document.getElementById("issue-image");

            if (input) {
                input.value = "";
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to submit report. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="form-page">
            <div className="form-container">
                <p className="eyebrow">REPORT A PROBLEM</p>

                <h1>What happened?</h1>

                <p className="form-intro">
                    Describe the campus problem in your
                    own words. You don't need to know
                    which department handles it.
                </p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="issue-description">
                        Describe the issue
                    </label>

                    <textarea
                        id="issue-description"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        placeholder="Example: The corridor outside Room 302 becomes slippery whenever it rains..."
                        required
                    />

                    <label htmlFor="issue-location">
                        Where did it happen?
                    </label>

                    <input
                        id="issue-location"
                        type="text"
                        value={location}
                        onChange={(event) =>
                            setLocation(event.target.value)
                        }
                        placeholder="Example: Block A, 3rd Floor, Room 302"
                        required
                    />

                    <label htmlFor="issue-image">
                        Upload a picture <span className="optional-text">(Optional)</span>
                    </label>

                    <div className="image-upload-section">
                        <label
                            htmlFor="issue-image"
                            className="image-upload-box"
                        >
                            <span className="upload-icon">＋</span>
                            <strong>
                                {image ? "Change image" : "Choose an image"}
                            </strong>
                            <span>
                                JPG, PNG or WEBP · Maximum 5 MB
                            </span>
                        </label>

                        <input
                            id="issue-image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            hidden
                        />

                        {previewUrl && (
                            <div className="image-preview">
                                <img
                                    src={previewUrl}
                                    alt="Preview of the reported issue"
                                />

                                <button
                                    type="button"
                                    className="remove-image-button"
                                    onClick={removeImage}
                                >
                                    Remove image
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="primary-button full-width"
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Submit Report"}
                    </button>
                </form>

                {message && (
                    <p className="success-message" role="status">
                        {message}
                    </p>
                )}
            </div>
        </main>
    );
}

export default ReportIssue;
