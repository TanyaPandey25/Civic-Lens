
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
    Upload,
    Image as ImageIcon,
    X,
    ArrowRight,
    CheckCircle2
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const buildings = [
    "PJ Block",
    "PG Block",
    "Science Block",
    "Mechanical Block",
    "APS Block"
];

const floors = Array.from({ length: 7 }, (_, index) =>
    String(index + 1)
);

function ReportIssue() {
    const { token } = useAuth();

    const [description, setDescription] = useState("");
    const [building, setBuilding] = useState("");
    const [floor, setFloor] = useState("");
    const [classroom, setClassroom] = useState("");

    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [submitting, setSubmitting] = useState(false);

    // Generate classroom names according to the selected floor.
    // Example: Floor 1 -> CR-101 to CR-108.
    const classrooms = floor
        ? Array.from({ length: 8 }, (_, index) =>
            `CR-${floor}0${index + 1}`
        )
        : [];

    useEffect(() => {
        if (!image) {
            setPreviewUrl("");
            return;
        }

        const url = URL.createObjectURL(image);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [image]);

    const handleBuildingChange = (event) => {
        setBuilding(event.target.value);
        setFloor("");
        setClassroom("");
        setMessage("");
    };

    const handleFloorChange = (event) => {
        setFloor(event.target.value);
        setClassroom("");
        setMessage("");
    };

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

        if (!token) {
            setMessageType("error");
            setMessage("Your session has expired. Please log in again.");
            return;
        }

        try {
            setSubmitting(true);
            setMessage("");

            const location =
                `${building}, Floor ${floor}, ${classroom}`;

            const formData = new FormData();

            formData.append("description", description);
            formData.append("location", location);

            if (image) {
                formData.append("image", image);
            }

            const response = await axios.post(
                `${API}/reports`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(
                response.data.message || "Your report has been submitted."
            );
            setMessageType("success");

            setDescription("");
            setBuilding("");
            setFloor("");
            setClassroom("");
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

                        <label htmlFor="issue-building">
                            Select building
                        </label>

                        <select
                            id="issue-building"
                            value={building}
                            onChange={handleBuildingChange}
                            required
                        >
                            <option value="">
                                Choose a building
                            </option>

                            {buildings.map(item => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="issue-floor">
                            Select floor
                        </label>

                        <select
                            id="issue-floor"
                            value={floor}
                            onChange={handleFloorChange}
                            disabled={!building}
                            required
                        >
                            <option value="">
                                {building
                                    ? "Choose a floor"
                                    : "Select a building first"
                                }
                            </option>

                            {floors.map(item => (
                                <option key={item} value={item}>
                                    Floor {item}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="issue-classroom">
                            Select classroom
                        </label>

                        <select
                            id="issue-classroom"
                            value={classroom}
                            onChange={event =>
                                setClassroom(event.target.value)
                            }
                            disabled={!floor}
                            required
                        >
                            <option value="">
                                {floor
                                    ? "Choose a classroom"
                                    : "Select a floor first"
                                }
                            </option>

                            {classrooms.map(item => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

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
