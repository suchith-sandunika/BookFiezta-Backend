const firebase = require("firebase/app");
require("firebase/auth");
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_APPID
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const sendMobileOTP = async (phoneNumber) => {
    try {
        const confirmationResult = await auth.signInWithPhoneNumber(phoneNumber);
        global.confirmationResult = confirmationResult; // Store for verification
        console.log("✅ OTP Sent to:", phoneNumber);
    } catch (error) {
        console.error("❌ Error sending OTP:", error.message);
    }
};

// // Example usage ...
// sendMobileOTP("+94712345678"); // Replace with a real number ...

const verifyMobileOTP = async (otp) => {
    try {
        const result = await global.confirmationResult.confirm(otp);
        console.log("✅ Phone Verified! User:", result.user);
    } catch (error) {
        console.error("❌ Incorrect OTP:", error.message);
    }
};

// // Example usage ...
// verifyMobileOTP("123456"); // Replace with actual OTP ...

module.exports = { sendMobileOTP, verifyMobileOTP }


