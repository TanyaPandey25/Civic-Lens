const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "CivicLens backend is running"
    });
});

app.post("/api/reports", (req, res) => {
    const { description, location } = req.body;

    if (!description || !location) {
        return res.status(400).json({
            success: false,
            message: "Description and location are required"
        });
    }

    res.status(201).json({
        success: true,
        message: "Report received successfully",
        report: {
            description,
            location
        }
    });
});

app.get("/api/issues", (req, res) => {
    res.json({
        success: true,
        issues: [
            {
                id: 1,
                title: "Broken Water Dispenser",
                location: "Block C",
                category: "Facilities",
                severity: "Medium",
                status: "Under Investigation"
            },
            {
                id: 2,
                title: "Slippery Corridor",
                location: "Block A",
                category: "Safety",
                severity: "High",
                status: "Reported"
            },
            {
                id: 3,
                title: "Intermittent Wi-Fi",
                location: "Library",
                category: "IT",
                severity: "Medium",
                status: "Action Taken"
            }
        ]
    });
});

app.listen(PORT, () => {
    console.log(`CivicLens backend running on port ${PORT}`);
});