
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Upload,
    Image as ImageIcon,
    X,
    ArrowRight,
    CheckCircle2
} from "lucide-react";

function ReportIssue() {
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
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
            setMessageType("error");
            setMessage("Please upload a JPG, PNG or WEBP image.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessageType("error");
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

        if (input) input.value = "";
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

            setMessage(
                response.data.message || "Your report has been submitted."
            );
            setMessageType("success");

            setDescription("");
            setLocation("");
            setImage(null);

            const input = document.getElementById("issue-image");

            if (input) input.value = "";

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to submit report. Please try again."
            );

            setMessageType("error");

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="report-page">

            <div className="report-layout">

                <aside className="report-aside">

                    <p className="eyebrow">
                        YOUR VOICE MATTERS
                    </p>

                    <h1>
                        Every improvement
                        starts with
                        <span> being heard.</span>
                    </h1>

                    <p>
                        Notice something that needs attention?
                        Tell us what happened. We'll make sure
                        there's a record of it.
                    </p>

                    <div className="report-aside-note">
                        <CheckCircle2 size={18} />

                        <span>
                            You don't need to know which
                            department handles the problem.
                        </span>
                    </div>

                    <div className="report-aside-number">
                        <span>01</span>
                        <span>DESCRIBE · LOCATE · SUBMIT</span>
                    </div>

                </aside>

                <section className="report-form-section">

                    <p className="eyebrow">
                        NEW CAMPUS REPORT
                    </p>

                    <h2>What happened?</h2>

                    <p className="form-intro">
                        Share a few details so the issue
                        can be understood and tracked.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <label htmlFor="issue-description">
                            Describe the issue
                        </label>

                        <textarea
                            id="issue-description"
                            value={description}
                            onChange={event =>
                                setDescription(event.target.value)
                            }
                            placeholder="Tell us what happened..."
                            required
                            minLength={5}
                        />

                        <label htmlFor="issue-location">
                            Where did it happen?
                        </label>

                        <input
                            id="issue-location"
                            type="text"
                            value={location}
                            onChange={event =>
                                setLocation(event.target.value)
                            }
                            placeholder="Block, floor, room or nearby landmark"
                            required
                        />

                        <label htmlFor="issue-image">
                            Photograph
                            <span className="optional-text">
                                {" "}(Optional)
                            </span>
                        </label>

                        <div className="image-upload-section">

                            <label
                                htmlFor="issue-image"
                                className="image-upload-box"
                            >
                                <Upload size={23} />

                                <strong>
                                    {image
                                        ? "Choose another photograph"
                                        : "Choose a photograph"}
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

                                    <div className="preview-heading">
                                        <span>
                                            <ImageIcon size={14} />
                                            Image preview
                                        </span>

                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            aria-label="Remove image"
                                            className="remove-image-button"
                                        >
                                            <X size={14} />
                                            Remove
                                        </button>
                                    </div>

                                    <img
                                        src={previewUrl}
                                        alt="Preview of the reported issue"
                                    />

                                </div>
                            )}

                        </div>

                        <button
                            type="submit"
                            className="primary-button full-width"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Submitting report..."
                                : "Submit report"
                            }

                            {!submitting && <ArrowRight size={15} />}
                        </button>

                    </form>

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

                </section>

            </div>

        </main>
    );
}

export default ReportIssue;
