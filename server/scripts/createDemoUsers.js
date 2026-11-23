
const dns = require("dns");
dns.setServers(["8.8.8.8"]);

require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

const demoUsers = [
    {
        name: "Demo Student",
        email: "student.cs25@bmsce.ac.in",
        password: process.env.DEMO_STUDENT_PASSWORD,
        role: "STUDENT"
    },
    {
        name: "Demo Teacher",
        email: "teacher@bmsce.ac.in",
        password: process.env.DEMO_ADMIN_PASSWORD,
        role: "ADMIN"
    }
];

async function createDemoUsers() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from .env");
        }

        if (!process.env.DEMO_STUDENT_PASSWORD ||
            !process.env.DEMO_ADMIN_PASSWORD) {
            throw new Error(
                "Add both demo passwords to your .env file."
            );
        }

        if (
            process.env.DEMO_STUDENT_PASSWORD.length < 8 ||
            process.env.DEMO_ADMIN_PASSWORD.length < 8
        ) {
            throw new Error("Demo passwords must be at least 8 characters.");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Connected to MongoDB.");

        for (const account of demoUsers) {
            const existingUser = await User.findOne({
                email: account.email
            });

            if (existingUser) {
                console.log(
                    `${account.role} account already exists: ${account.email}`
                );
                continue;
            }

            await User.create(account);

            console.log(
                `${account.role} account created: ${account.email}`
            );
        }

        console.log("\nDemo account setup completed.");

    } catch (error) {
        console.error("\nDemo account setup failed:", error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
    }
}

createDemoUsers();
