const nodemailer = require("nodemailer");
require("dotenv").config()


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});


const sendOtp=async (email,Otp) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Verification",
    text: `This Otp will be availabe for 5MINS ${Otp} `, // plain‑text body
    html: `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          padding: 20px;
        }
        .container {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          margin: 0 auto;
        }
        h2 {
          color: #2c3e50;
        }
        .otp-code {
          font-size: 24px;
          font-weight: bold;
          color: #e74c3c;
          margin-top: 20px;
        }
        .footer {
          font-size: 12px;
          color: #7f8c8d;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Your OTP Code</h2>
        <p>Hello,</p>
        <p>Here is your one-time password (OTP) for authentication:</p>
        <div class="otp-code">${Otp}</div>
        <p>This OTP will expire in 5 minutes. Please enter it on the website to complete the process.</p>
        <div class="footer">If you didn't request this, please ignore this email.</div>
      </div>
    </body>
    </html>
`, // HTML body
  });

  console.log("Message sent:", info.messageId);
};

module.exports= {sendOtp} 