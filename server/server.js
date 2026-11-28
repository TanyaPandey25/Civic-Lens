
const dns = require("dns");
dns.setServers(["8.8.8.8"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Issue = require("./models/Issue");

const {
    authenticateToken,
    requireAdmin
} = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads folder if it does not exist
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDir);
    },

    filename: (req, file, callback) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname).toLowerCase();

        callback(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return callback(
                new Error("Only JPG, PNG and WEBP images are allowed.")
            );
        }

        callback(null, true);
    }
});

app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Serve uploaded images
app.use("/uploads", express.static(uploadDir));

// Remove uploaded image
const removeUploadedFile = (imageUrl) => {
    if (!imageUrl) return;

    const filename = path.basename(imageUrl);
    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// Normalize location and category for comparison
const normalizeValue = (value) => {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[.,;:!?]/g, "")
        .replace(/\s+/g, " ");
};

// Automatically categorise an issue based on its description
const categorizeIssue = (description) => {
    const text = ` ${String(description || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()} `;

    const matches = (keywords) => {
        return keywords.some(keyword => {
            const normalizedKeyword = keyword
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, " ")
                .trim();

            return text.includes(` ${normalizedKeyword} `);
        });
    };

    // Electrical issues
    if (matches([
        "wiring",
        "electrical",
        "electricity",
        "electric shock",
        "short circuit",
        "power supply",
        "power cut",
        "switch",
        "socket",
        "plug",
        "fuse"
    ])) {
        return "Electrical";
    }

    // IT and equipment issues
    if (matches([
        "projector",
        "computer",
        "laptop",
        "wifi",
        "wi fi",
        "network",
        "printer",
        "monitor",
        "keyboard",
        "mouse",
        "smart board",
        "internet"
    ])) {
        return "IT & Equipment";
    }

    // Furniture issues
    if (matches([
        "desk",
        "chair",
        "bench",
        "table",
        "cupboard",
        "furniture",
        "broken seat",
        "damaged seat"
    ])) {
        return "Furniture";
    }

    // Water-related issues
    if (matches([
        "water",
        "water leakage",
        "leakage",
        "leaking",
        "leak",
        "tap",
        "faucet",
        "drinking water",
        "water supply",
        "water shortage",
        "pipe burst",
        "pipeline"
    ])) {
        return "Water";
    }

    // Sanitation issues
    if (matches([
        "garbage",
        "waste",
        "dustbin",
        "trash",
        "litter",
        "sanitation",
        "cleanliness",
        "unclean",
        "dirty",
        "sewage",
        "overflowing bin"
    ])) {
        return "Sanitation";
    }

    // Infrastructure issues
    if (matches([
        "building",
        "wall",
        "ceiling",
        "roof",
        "door",
        "window",
        "staircase",
        "stairs",
        "corridor",
        "floor tiles",
        "crack",
        "plaster",
        "painting",
        "pavement",
        "infrastructure"
    ])) {
        return "Infrastructure";
    }

    // Default category when no keywords match
    return "Other";
};

// Calculate severity based on report count
const calculateSeverity = (count) => {
    if (count >= 6) {
        return "High";
    }

    if (count >= 3) {
        return "Medium";
    }

    return "Low";
};

// Format issue response
const formatIssue = (issue, reportCount = 1) => ({
    id: issue._id.toString(),
    title: issue.title,
    description: issue.description,
    location: issue.location,
    category: issue.category,
    severity: issue.severity,
    reportCount,
    status: issue.status,
    imageUrl: issue.imageUrl || "",
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt
});

// Calculate and update severity for all issues
const getIssuesWithCalculatedSeverity = async () => {
    const issues = await Issue.find().sort({ createdAt: -1 });

    const groups = new Map();

    // Group reports by location and category
    for (const issue of issues) {
        const locationKey = normalizeValue(issue.location);
        const categoryKey = normalizeValue(issue.category);

        const groupKey = JSON.stringify([
            locationKey,
            categoryKey
        ]);

        if (!groups.has(groupKey)) {
            groups.set(groupKey, []);
        }

        groups.get(groupKey).push(issue);
    }

    const updates = [];
    const formattedIssues = [];

    // Calculate severity for each group
    for (const group of groups.values()) {
        const reportCount = group.length;
        const severity = calculateSeverity(reportCount);

        for (const issue of group) {
            if (issue.severity !== severity) {
                updates.push({
                    updateOne: {
                        filter: { _id: issue._id },
                        update: {
                            $set: { severity }
                        }
                    }
                });

                issue.severity = severity;
            }

            formattedIssues.push(
                formatIssue(issue, reportCount)
            );
        }
    }

    // Save updated severity values in MongoDB
    if (updates.length > 0) {
        await Issue.bulkWrite(updates);
    }

    return formattedIssues;
};

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "CivicLens backend is running"
    });
});

// CREATE: Submit a new campus issue
// Logged-in students and admins can submit reports
app.post(
    "/api/reports",
    authenticateToken,
    (req, res, next) => {
        upload.single("image")(req, res, (error) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            next();
        });
    },
    async (req, res) => {
        let issueCreated = false;

        try {
            const {
                description,
                location
            } = req.body;

            if (
                typeof description !== "string" ||
                !description.trim() ||
                typeof location !== "string" ||
                !location.trim()
            ) {
                if (req.file) {
                    removeUploadedFile(req.file.filename);
                }

                return res.status(400).json({
                    success: false,
                    message: "Description and location are required"
                });
            }

            const cleanedDescription = description.trim();

            const imageUrl = req.file
                ? `/uploads/${req.file.filename}`
                : "";

            // Automatically determine category from description
            const category = categorizeIssue(cleanedDescription);

            const issue = await Issue.create({
                title: cleanedDescription.slice(0, 60),
                description: cleanedDescription,
                location: location.trim(),
                category,
                severity: "Low",
                imageUrl,

                // Save the ID of the logged-in user
                createdBy: req.user.id
            });

            issueCreated = true;

            // Recalculate severity for all matching reports
            const updatedIssues =
                await getIssuesWithCalculatedSeverity();

            const createdReport = updatedIssues.find(
                (item) => item.id === issue._id.toString()
            );

            return res.status(201).json({
                success: true,
                message: "Report submitted and saved successfully",
                report: createdReport
            });

        } catch (error) {
            if (req.file && !issueCreated) {
                removeUploadedFile(req.file.filename);
            }

            console.error("Create issue error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Failed to save the report"
            });
        }
    }
);

// READ: Get all reports submitted by the logged-in user
app.get(
    "/api/my-reports",
    authenticateToken,
    async (req, res) => {
        try {
            // Find only reports belonging to this account
            const myIssueIds = await Issue.find({
                createdBy: req.user.id
            }).distinct("_id");

            // Get formatted issues with calculated severity
            const allIssues =
                await getIssuesWithCalculatedSeverity();

            // Keep only this user's reports
            const myIssueIdSet = new Set(
                myIssueIds.map((id) => id.toString())
            );

            const myReports = allIssues.filter(
                (issue) => myIssueIdSet.has(issue.id)
            );

            return res.json({
                success: true,
                count: myReports.length,
                reports: myReports
            });

        } catch (error) {
            console.error("Fetch my reports error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch your reports"
            });
        }
    }
);

// READ: Get all issues
app.get("/api/issues", async (req, res) => {
    try {
        const issues = await getIssuesWithCalculatedSeverity();

        return res.json({
            success: true,
            issues
        });

    } catch (error) {
        console.error("Fetch issues error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch issues"
        });
    }
});

// READ: Get one issue by ID
app.get("/api/issues/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue ID"
            });
        }

        const issues = await getIssuesWithCalculatedSeverity();

        const issue = issues.find(
            (item) => item.id === id
        );

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            });
        }

        return res.json({
            success: true,
            issue
        });

    } catch (error) {
        console.error("Fetch issue error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch issue"
        });
    }
});

// UPDATE: Admin only
app.patch(
    "/api/issues/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid issue ID"
                });
            }

            const allowedFields = [
                "title",
                "description",
                "location",
                "category",
                "status"
            ];

            const updates = {};

            for (const field of allowedFields) {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            }

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No valid fields provided for update"
                });
            }

            const updatedIssue = await Issue.findByIdAndUpdate(
                id,
                updates,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!updatedIssue) {
                return res.status(404).json({
                    success: false,
                    message: "Issue not found"
                });
            }

            // Recalculate after location or category changes too
            const issues = await getIssuesWithCalculatedSeverity();

            const issue = issues.find(
                (item) => item.id === id
            );

            return res.json({
                success: true,
                message: "Issue updated successfully",
                issue
            });

        } catch (error) {
            console.error("Update issue error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Failed to update issue"
            });
        }
    }
);

// DELETE: Admin only
app.delete(
    "/api/issues/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid issue ID"
                });
            }

            const issue = await Issue.findByIdAndDelete(id);

            if (!issue) {
                return res.status(404).json({
                    success: false,
                    message: "Issue not found"
                });
            }

            removeUploadedFile(issue.imageUrl);

            // Recalculate severity after deletion
            await getIssuesWithCalculatedSeverity();

            return res.json({
                success: true,
                message: "Issue deleted successfully"
            });

        } catch (error) {
            console.error("Delete issue error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Failed to delete issue"
            });
        }
    }
);

// Handle unexpected server errors
app.use((error, req, res, next) => {
    console.error("Server error:", error.message);

    res.status(500).json({
        success: false,
        message: "An unexpected server error occurred"
    });
});

// Connect to MongoDB, then start the API server
async function startServer() {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri || !/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
            throw new Error(
                "MONGODB_URI is missing or invalid. Check server/.env."
            );
        }

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("Connected to MongoDB successfully");

        app.listen(PORT, () => {
            console.log(`CivicLens backend running on port ${PORT}`);
        });

    } catch (error) {
        console.error("\nMongoDB connection failed:", error.message);

        if (error.reason && error.reason.servers) {
            for (const [address, server] of error.reason.servers) {
                console.error("\nServer:", address);
                console.error("State:", server.type);
                console.error(
                    "Cause:",
                    server.error?.message || "No underlying error reported"
                );
            }
        } else if (error.cause) {
            console.error("Underlying cause:", error.cause.message);
        }

        process.exit(1);
    }
}

startServer();
