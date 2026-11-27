
import { useState } from "react";
import { ChevronDown, X, ArrowUpRight } from "lucide-react";

const faqs = [
    {
        question: "What is CivicLens?",
        answer:
            "CivicLens is a campus issue reporting platform that helps students report problems around campus and follow their progress towards resolution."
    },
    {
        question: "How do I report a campus issue?",
        answer:
            "Log in using your BMSCE student account, open the Report Issue page, provide the issue details and location, and submit your report."
    },
    {
        question: "Can I browse issues without logging in?",
        answer:
            "Yes. You can explore reported campus issues and view their details without logging in. You need a student account to submit a report."
    },
    {
        question: "How can I track my reported issues?",
        answer:
            "After logging in, you can access your reports and check their latest status to see how they are progressing."
    },
    {
        question: "What do the different issue statuses mean?",
        answer:
            "Reported means the issue has been submitted. Under Investigation means it is being reviewed. Action Taken means steps have been taken to address it. Resolved means the issue has been marked as resolved."
    },
    {
        question: "Who can update an issue's status?",
        answer:
            "Administrators manage issue status updates to keep students informed about the progress of reported campus issues."
    }
];

function Footer() {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [activeFAQ, setActiveFAQ] = useState(null);

    const closeHelp = () => {
        setIsHelpOpen(false);
        setActiveFAQ(null);
    };

    return (
        <>
            <footer className="footer">
                <p>
                    © 2026 <strong>CivicLens</strong>
                    {" "}· A better campus starts with being heard.
                </p>

                <button
                    type="button"
                    className="footer-help-link"
                    onClick={() => setIsHelpOpen(true)}
                >
                    Get Help
                    <ArrowUpRight size={13} />
                </button>
            </footer>

            {isHelpOpen && (
                <div
                    className="help-modal-overlay"
                    onClick={closeHelp}
                >
                    <section
                        className="help-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="help-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="help-modal-header">
                            <div>
                                <span className="help-modal-eyebrow">
                                    CIVICLENS SUPPORT
                                </span>

                                <h2 id="help-modal-title">
                                    How can we help?
                                </h2>

                                <p>
                                    Find answers to common questions about
                                    using CivicLens.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="help-modal-close"
                                onClick={closeHelp}
                                aria-label="Close help"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="help-faq-list">
                            {faqs.map((faq, index) => (
                                <div
                                    className={`help-faq-item ${
                                        activeFAQ === index ? "active" : ""
                                    }`}
                                    key={index}
                                >
                                    <button
                                        type="button"
                                        className="help-faq-question"
                                        onClick={() =>
                                            setActiveFAQ(
                                                activeFAQ === index
                                                    ? null
                                                    : index
                                            )
                                        }
                                        aria-expanded={activeFAQ === index}
                                    >
                                        <span>{faq.question}</span>

                                        <ChevronDown
                                            size={18}
                                            className="help-faq-chevron"
                                        />
                                    </button>

                                    {activeFAQ === index && (
                                        <div className="help-faq-answer">
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}

export default Footer;
