const mongoose = require("mongoose");

const connectDB = async() => {
	try {
		const mongourl =
			process.env.NODE_ENV === "development"
				? process.env.MONGOURL
				: process.env.MONGOURL_PRODUCTION;
                
        if(mongourl){
            await mongoose.connect(mongourl)
            console.log("mongodb connected Successfully")
        }

	} catch (err)
    {
        console.log("Error connecting to mongoDB",err)
    }
};

module.exports = connectDB;
