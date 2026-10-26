
const dns = require("dns");
dns.setServers(["8.8.8.8"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Issue = require("./models/Issue");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CivicLens backend is running",
  });
});

// CREATE: Submit a new campus issue
app.post("/api/reports", async (req, res) => {
  try {
    const { description, location, category, severity } = req.body;

    if (
      typeof description !== "string" ||
      !description.trim() ||
      typeof location !== "string" ||
      !location.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Description and location are required",
      });
    }

    const issue = await Issue.create({
      title: description.trim().slice(0, 60),
      description: description.trim(),
      location: location.trim(),
      category: category || "General",
      severity: severity || "Medium",
    });

    return res.status(201).json({
      success: true,
      message: "Report submitted and saved successfully",
      report: {
        id: issue._id.toString(),
        title: issue.title,
        description: issue.description,
        location: issue.location,
        category: issue.category,
        severity: issue.severity,
        status: issue.status,
        createdAt: issue.createdAt,
      },
    });
  } catch (error) {
    console.error("Create issue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to save the report",
    });
  }
});

// READ: Get all issues
app.get("/api/issues", async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      issues: issues.map((issue) => ({
        id: issue._id.toString(),
        title: issue.title,
        description: issue.description,
        location: issue.location,
        category: issue.category,
        severity: issue.severity,
        status: issue.status,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Fetch issues error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch issues",
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
        message: "Invalid issue ID",
      });
    }

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.json({
      success: true,
      issue: {
        id: issue._id.toString(),
        title: issue.title,
        description: issue.description,
        location: issue.location,
        category: issue.category,
        severity: issue.severity,
        status: issue.status,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
      },
    });
  } catch (error) {
    console.error("Fetch issue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch issue",
    });
  }
});

// UPDATE: Modify an existing issue
app.patch("/api/issues/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "location",
      "category",
      "severity",
      "status",
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
        message: "No valid fields provided for update",
      });
    }

    const issue = await Issue.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.json({
      success: true,
      message: "Issue updated successfully",
      issue: {
        id: issue._id.toString(),
        title: issue.title,
        description: issue.description,
        location: issue.location,
        category: issue.category,
        severity: issue.severity,
        status: issue.status,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update issue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update issue",
    });
  }
});

// DELETE: Remove an issue
app.delete("/api/issues/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    console.error("Delete issue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete issue",
    });
  }
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
      serverSelectionTimeoutMS: 10000,
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
