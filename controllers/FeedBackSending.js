const nodemailer = require('nodemailer');
require('dotenv').config();

const app_email = process.env.APP_EMAIL;
const app_password = process.env.APP_PASSWORD;

// Send mail ...
const sendFeedback = (email, name, message) => {
    const mailOptions = {
        from: email,
        to: app_email,
        subject: 'Via BookFiezta - Feedback Form',
        text: `From: ${name} \n Message: ${message}`
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
            console.log('Error occurred while sending Feedback:', error);
            return;
        } else {
            console.log('Feedback sent successfully:', info.response);
        }
    })
};

module.exports = { sendFeedback };