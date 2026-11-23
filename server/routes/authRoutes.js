
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const COLLEGE_EMAIL_REGEX = /^[^\s@]+@bmsce\.ac\.in$/i;

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id.toString()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

// REGISTER STUDENT
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide your name, email and password."
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanName) {
            return res.status(400).json({
                success: false,
                message: "Name is required."
            });
        }

        if (!COLLEGE_EMAIL_REGEX.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please use your BMSCE college email address."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters."
            });
        }

        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        // Public registration always creates a STUDENT
        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            password,
            role: "STUDENT"
        });

        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "Student account created successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create account."
        });
    }
});

// LOGIN STUDENT OR ADMIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide your email and password."
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        if (!COLLEGE_EMAIL_REGEX.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please use your BMSCE college email address."
            });
        }

        // Password is excluded by default in the User model
        const user = await User.findOne({
            email: cleanEmail
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const isPasswordValid =
            await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = generateToken(user);

        return res.json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again."
        });
    }
});

module.exports = router;
