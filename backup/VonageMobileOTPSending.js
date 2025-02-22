const { Vonage } = require('@vonage/server-sdk');
const randomstring = require('randomstring');
require('dotenv').config();

const otpMobileCache = {};

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_APISECRET
});

// function to generate random string ...
const generateMobileOTP = () => {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
};

const sendSMS = async (to, from, text) => {
    await vonage.sms.send({to, from, text})
        .then(response => { console.log('Message sent successfully'); console.log(response); })
        .catch(error => { console.log('There was an error sending the messages.'); console.error(error); });
};

module.exports = { otpMobileCache, generateMobileOTP, sendSMS }