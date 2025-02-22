const randomstring = require('randomstring');
const axios = require('axios');
require('dotenv').config();

const otpMobileCache = {};
const api_key = process.env.TEXTFLOW_API_KEY3;

// function to generate random string ...
const generateMobileOTP = () => {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
};

// Function to send the otp to phone number ...
const sendMobileOTP = async (phoneNumber, otp) => {
    try {
        const response = await axios.post('https://api.textflow.com/send', {
            to: phoneNumber,
            message: `Your OTP code is: ${otp}`,
            apiKey: api_key
        }, {
            timeout: 15000 // 5 seconds timeout ...
        });

        console.log('SMS Sent:', response.data);
    } catch (error) {
        console.error('Error sending OTP:', error.response ? error.response.data : error.message);
    }
};

module.exports = {otpMobileCache, generateMobileOTP, sendMobileOTP};