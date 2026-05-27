const response = (res,statusCode,data=null,message="") => {
   return res.status(statusCode).json({
        success: statusCode<300,
        status: statusCode,
        data:data,
        message:message

    })
}

module.exports = response