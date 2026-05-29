const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user.model.js");
require("dotenv").config();

const MONGOURL = process.env.MONGOURL || "mongodb://127.0.0.1:27017/govsecai";

async function seed() {
    try {
        console.log("[*] Connecting to MongoDB...");
        await mongoose.connect(MONGOURL);
        console.log("[+] Connected successfully.");

        // Clear existing users
        await User.deleteMany({});
        console.log("[*] Cleared existing users.");

        const salt = await bcrypt.genSalt(12);
        // Standard pre-hashed password
        const passwordHash = await bcrypt.hash("password123", salt);

        // 1. Create Government Official/Admin User
        const adminUser = new User({
            firstname: "GovSec",
            lastname: "Admin",
            email: "admin@govsecai.com",
            password: "password123",
            phonenumber: 9876543210,
            city: "Ahmedabad",
            state: "Gujarat",
            address: "State Command HQ, Sector 21",
            role: "gov",
            isVerified: true
        });
        await adminUser.save();
        console.log("[+] Admin (Official) account created:");
        console.log("    Email:    admin@govsecai.com");
        console.log("    Password: password123");

        // 2. Create Citizen User
        const citizenUser = new User({
            firstname: "Rajesh",
            lastname: "Sharma",
            email: "citizen@govsecai.com",
            password: "password123",
            phonenumber: 9988776655,
            city: "Surat",
            state: "Gujarat",
            address: "Adajan Main Road, Near SMC Circle",
            role: "citizen",
            isVerified: true
        });
        await citizenUser.save();
        console.log("[+] Citizen account created:");
        console.log("    Email:    citizen@govsecai.com");
        console.log("    Password: password123");

        console.log("\n[!] Database Seeding Complete successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seed();
