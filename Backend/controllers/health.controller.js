const mongoose = require("mongoose")
const response = require("../utils/responseHandler.util.js")

const healthCheck= (req, res)=>{
    const serverStatus = {
        connectionStatus:"Server is running",
        mongodb:{
            status:'unknown',
            message:'checking...'

        },
        timeStamp: new Date()
}


    switch(mongoose.connection.readyState){
        case 0:
            serverStatus.mongodb.status="discconected"
            serverStatus.mongodb.message="Kal Aiyo"
            break
        
        case 1:
            serverStatus.mongodb.status="Connected"
            serverStatus.mongodb.message="Hogaya"
            break
        case 2:
            serverStatus.mongodb.status="Connecting"
            serverStatus.mongodb.message="Ho Raha Hai"
            break
    }

    return response(res,200,serverStatus)
}

module.exports = {
    healthCheck
}