const mongoose = require('mongoose');
require('dotenv').config();

const Road = mongoose.model('RoadComplaint', new mongoose.Schema({}, {strict:false}), 'roadcomplaints');
const Health = mongoose.model('HealthComplaint', new mongoose.Schema({}, {strict:false}), 'healthcomplaints');

mongoose.connect(process.env.MONGOURL)
    .then(async () => {
        console.log("[*] Connected to MongoDB.");
        const roads = await Road.find({evidenceUrl: {$ne: null}}, {complaintId:1, evidenceUrl:1, description:1}).limit(5).lean();
        console.log("Road Complaints with Evidence URLs:\n", roads);
        
        const healths = await Health.find({evidenceUrl: {$ne: null}}, {complaintId:1, evidenceUrl:1, complaintText:1}).limit(5).lean();
        console.log("Health Complaints with Evidence URLs:\n", healths);
        
        process.exit(0);
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });
