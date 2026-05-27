require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const sqlite = require("better-sqlite3");
const mongoose = require("mongoose");
const path = require("path");

const RoadComplaint = require("../models/roadComplaint.model");
const HealthComplaint = require("../models/healthComplaint.model");
const BankingFraud = require("../models/bankingFraud.model");

const BATCH_SIZE = 1000;

async function migrate() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGOURL);
        console.log("Connected to MongoDB.");

        const dbPath = path.join(__dirname, "..", "govsecai.db");
        console.log(`Reading from SQLite at: ${dbPath}`);
        const db = new sqlite(dbPath, { readonly: true });

        // 1. Migrate Road Complaints
        console.log("\nMigrating Road Complaints...");
        const roadRows = db.prepare("SELECT * FROM road_complaints").all();
        console.log(`Found ${roadRows.length} SQLite records.`);
        
        try { await RoadComplaint.collection.drop(); } catch (e) {}
        
        let batch = [];
        let count = 0;
        for (const row of roadRows) {
            batch.push({
                complaintId: row.complaint_id,
                dateReported: row.date_reported,
                city: row.city,
                area: row.area,
                issueType: row.issue_type,
                description: row.description,
                status: row.status,
                priority: row.priority,
                latitude: row.latitude,
                longitude: row.longitude,
                areaStatus: row.area_status,
                evidenceUrl: row.evidence_url,
                citizenEmail: row.citizen_email
            });
            
            if (batch.length >= BATCH_SIZE) {
                try { await RoadComplaint.insertMany(batch, { ordered: false }); } catch(err) {}
                count += batch.length;
                process.stdout.write(`\rInserted ${count} / ${roadRows.length} `);
                batch = [];
            }
        }
        if (batch.length > 0) {
            try { await RoadComplaint.insertMany(batch, { ordered: false }); } catch(err) {}
            count += batch.length;
        }
        console.log(`\nRoad Complaints complete. Total inserted: ${count}`);

        // 2. Migrate Health Complaints
        console.log("\nMigrating Health Complaints...");
        const healthRows = db.prepare("SELECT * FROM health_complaints").all();
        console.log(`Found ${healthRows.length} SQLite records.`);
        
        try { await HealthComplaint.collection.drop(); } catch (e) {}
        
        batch = [];
        count = 0;
        for (const row of healthRows) {
            batch.push({
                complaintId: row.complaint_id,
                patientId: row.patient_id,
                dateReported: row.date_reported,
                city: row.city,
                area: row.area,
                facility: row.facility,
                category: row.category,
                severity: row.severity,
                complaintText: row.complaint_text,
                areaStatus: row.area_status,
                evidenceUrl: row.evidence_url,
                citizenEmail: row.citizen_email,
                status: row.status
            });
            
            if (batch.length >= BATCH_SIZE) {
                try { await HealthComplaint.insertMany(batch, { ordered: false }); } catch(err) {}
                count += batch.length;
                process.stdout.write(`\rInserted ${count} / ${healthRows.length} `);
                batch = [];
            }
        }
        if (batch.length > 0) {
            try { await HealthComplaint.insertMany(batch, { ordered: false }); } catch(err) {}
            count += batch.length;
        }
        console.log(`\nHealth Complaints complete. Total inserted: ${count}`);
        
        // 3. Migrate Banking Fraud
        console.log("\nMigrating Banking Fraud...");
        const fraudRows = db.prepare("SELECT * FROM banking_fraud").all();
        console.log(`Found ${fraudRows.length} SQLite records.`);
        
        try { await BankingFraud.collection.drop(); } catch (e) {}
        
        batch = [];
        count = 0;
        for (const row of fraudRows) {
            batch.push({
                transactionId: row.transaction_id,
                accountId: row.account_id,
                timestamp: row.timestamp,
                amount: row.amount,
                merchantCategory: row.merchant_category,
                transactionType: row.transaction_type,
                deviceType: row.device_type,
                locationCity: row.location_city,
                riskScore: row.risk_score,
                isFraud: row.is_fraud,
                status: row.status,
                areaStatus: row.area_status,
                area: row.area,
                evidenceUrl: row.evidence_url,
                citizenEmail: row.citizen_email
            });
            
            if (batch.length >= BATCH_SIZE) {
                try { await BankingFraud.insertMany(batch, { ordered: false }); } catch(err) {}
                count += batch.length;
                process.stdout.write(`\rInserted ${count} / ${fraudRows.length} `);
                batch = [];
            }
        }
        if (batch.length > 0) {
            try { await BankingFraud.insertMany(batch, { ordered: false }); } catch(err) {}
            count += batch.length;
        }
        console.log(`\nBanking Fraud complete. Total inserted: ${count}`);

        console.log("\n✅ Migration complete!");

    } catch (err) {
        console.error("Migration error:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

migrate();
