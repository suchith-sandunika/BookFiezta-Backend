const axios = require("axios");
const randomstring = require("randomstring");
require("dotenv").config();

const otpMobileCache = {};
const apiKey = process.env.TEXTLOCAL_API_KEY;
const userName = process.env.TEXTLOCAL_USERNAME;
// const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP ...

// function to generate random string ...
const generateMobileOTP = () => {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
};

const sendMobileOTP = async (phoneNumber, otp) => {

    const message = `Your OTP code is ${otp}`;

    try {
        const response = await axios.post("https://api.textlocal.in/send/", null, {
            params: {
                apiKey: apiKey,
                username: userName,
                numbers: phoneNumber,
                message: message,
                sender: "BookFiezta Verifier"
            }
        });
        console.log("✅ OTP Sent:", response.data);
    } catch (error) {
        console.error("❌ Error sending OTP:", error.response?.data || error.message);
    }
};

// // Example usage ...
// sendMobileOTP("94712345678");  // Sri Lanka number format ...

module.exports = { otpMobileCache, generateMobileOTP, sendMobileOTP }
