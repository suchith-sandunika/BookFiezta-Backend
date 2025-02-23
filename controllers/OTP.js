const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
require('dotenv').config();

// store generate OTPs and corresponding email addresses ...
const otpCache = {};
const app_email = process.env.APP_EMAIL;
const app_password = process.env.APP_PASSWORD;

// function to generate random string ...
const generateOTP = () => {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
}; 

// Send OTP via mail ...
const sendOTP = (email, otp) => {
    const mailOptions = {
        from: app_email,
        to: email,
        subject: 'OTP Verification - BookFiezta',
        text: `Your OTP for email verification is ${otp}`
    };

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: app_email,
            pass: app_password
        },
        tls: {
            rejectUnauthorized: false // Disable certificate validation ...
        }
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred while sending OTP:', error);
            return;
        } else {
            console.log('OTP sent successfully:', info.response);
        }
    })
};

module.exports = { otpCache, generateOTP, sendOTP };