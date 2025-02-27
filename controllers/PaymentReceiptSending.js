const nodemailer = require('nodemailer');
require('dotenv').config();

const app_email = process.env.APP_EMAIL;
const app_password = process.env.APP_PASSWORD;

// Send mail ...
const sendPaymentReceiptEmail = (email, message, total, id, purchaser) => {
    const mailOptions = {
        from: app_email,
        to: email,
        subject: `BookFiezta - Book Purchase Receipt for Order Id : ${id} through ${purchaser}`,
        text: `Payment Information : \n Books Purchased : ${message} \n Total Balance Paid : USD ${total}`
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
            console.log('Error occurred while sending Mail:', error);
            return;
        } else {
            console.log('Mail sent successfully:', info.response);
        }
    })
};

module.exports = { sendPaymentReceiptEmail };