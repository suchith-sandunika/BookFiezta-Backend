const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const router = express.Router();
const User = require('../model/User');
const SessionLog = require('../model/SessionLog');
const { otpCache, generateOTP, sendOTP } = require('../controllers/OTP');
const { FormattedDateTime } = require('../utils/FormatDate');
const { otpMobileCache, generateMobileOTP, sendSMS } = require('../controllers/MobileOTPSending');

const from = process.env.FROM;

// User Registration ...
router.post('/register', async (req, res) => {
    try {
        const {name, email, password: plainTextPassword} = req.body;

        // userEmail = email; // Set the email to the global variable ...
        // userName = name; // Set the name to the global variable ...

        // Check if user exists already ...
        const existingUser = await User.findOne({ email: email }).lean();
        if(existingUser) {
            return res.status(400).send("This email already in use");
        } else {
            const password = await bcrypt.hash(plainTextPassword, 10);
            const newUser = await User.create({ name, password });
            console.log(newUser);
            res.status(201).json({message: 'Before registration you must verify your email', data: newUser});
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}); 

// User Login ...
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if user related to given details already exists ...
        const existingUser = await User.findOne({email}).lean();
        if(!existingUser) {
            return res.status(400).send("Invalid credentials");
        } else {
            // Compare the given password with the hashed password in the database ...  
            // Note: In a real-world application, you should use a secure method for password hashing and comparison. 
            // Here, we are using simple bcrypt for demonstration purposes.
            const correctPassword = await bcrypt.compare(password, existingUser.password);
            if(!correctPassword) {
                return res.status(400).send("Invalid Password");
            } else {
                // Generate JWT token for authenticated user ...
                const token = jwt.sign({
                    id: existingUser._id,
                    email: existingUser.email,
                }, process.env.JWT_SECRET, {expiresIn: '1d'});

                // Set the time to expire the token ...
                const expiringAt = new Date();
                expiringAt.setDate(expiringAt.getDate() + 1);
                console.log("Generated Token Expiring At:", expiringAt);

                // create Session for logged user ...
                const sessionData = await SessionLog.create({userId: existingUser._id, email: existingUser.email, token: token, expiringAt: expiringAt});
                console.log(sessionData);

                // Set the cookie with JWT token for authenticated user ...
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    maxAge: 1000 * 60 * 60 * 24 // 1 day
                }); 

                res.status(200).json({message: 'Login Successful', token: token, data: existingUser});
            }
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// Route to request OTP ...
router.post('/sendOTP', (req, res) => {
    try {
        const {userEmail} = req.body;
        const otp = generateOTP();
        otpCache[userEmail] = otp;
        //console.log(otpCache[userEmail]);
        // Send the email ...
        sendOTP(userEmail, otp);
        res.cookie('otpCache', otpCache, { maxAge: 3000, httpOnly: true });
        res.status(200).json({message: "OTP sent successfully", otp: otp});
    } catch (error) {
        return res.status(500).send(error.message);
    }
}); 

// Route to verify OTP ...
router.post('/verifyOTP', async (req, res) => {
    try {
        const {otp, userName, userEmail} = req.body;
        
        console.log(otpCache.hasOwnProperty(userEmail));
        // Check if email exists in the cache ...
        if(!otpCache.hasOwnProperty(userEmail)) {
            return res.status(404).send("Email not found");
        }

        // Check if the OTP matches the one stored in the cache ...
        if(otpCache[userEmail] === otp) {
            // res.status(200).send("OTP Verified Successfully");
            console.log("OTP Verified Successfully");
            delete otpCache[userEmail]; // Remove the OTP from the cache after successful verification.
            const UpdatedRegisteredUser = await User.findOneAndUpdate({name: userName}, {name: userName, email: userEmail}, {new: true});
            if(!UpdatedRegisteredUser) {
                return res.status(404).send("User not found");
            } else {
                res.status(200).json({message: 'Registration Successful', data: UpdatedRegisteredUser});
            }
        }  
    } catch (error) {
        return res.status(500).send(error.message);
    }
}); 

// Route to check email before resetting password ...
router.post('/emailCheck', async (req, res) => {
    try {
        const {email} = req.body;
        // Check there is a user related to the email ...
        const existingUser = await User.findOne({email}).lean();
        if(!existingUser) {
            return res.status(400).send("Email is Incorrect");
        } else {
            return res.status(200).json({message: "Email is Verified Sucessfully", data: existingUser});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
});

// Route to reset password ...
router.post('/reset-password', async (req, res) => {
    try {
        const {email, password} = req.body;
        // Hash the password before saving ...
        const hashedPassword = await bcrypt.hash(password, 10);
        // Update the password in the database for the user related to the email...
        const updateUser = await User.findOneAndUpdate({email: email, password: hashedPassword});
        return res.status(200).json({message: "Password Reset Successfully", data: updateUser});
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// Route to send the OTP to mobile ...
router.post('/sendOTP/mobile', (req, res) => {
   try {
       const {mobileNumber} = req.body;
       const otp = generateMobileOTP();
       otpMobileCache[mobileNumber] = otp;
       const messageToBeSent = `The OTP for Verification is ${otp}`;
       // Send the notification ...
       sendSMS(mobileNumber, from, messageToBeSent)
           .then(result => {
               console.log(result);
               res.cookie('otpMobileCache', otpMobileCache, {maxAge: 3000, httpOnly: true});
               res.status(200).json({message: "OTP sent successfully", otp: otp});
           })
           .catch(error => console.log(error));
   } catch (error) {
       console.log(error.message);
       return res.status(500).send(error.message);
   }
});

// Route to verify the otp, sent to mobile ...
router.post('/verifyOTP/mobile', async (req, res) => {
   try {
       const {otp, userName, mobileNumber} = req.body;

       console.log(otpMobileCache.hasOwnProperty(mobileNumber));
       // Check if email exists in the cache ...
       if(!otpMobileCache.hasOwnProperty(mobileNumber)) {
           return res.status(404).send("Mobile Number not found");
       }

       // Check if the OTP matches the one stored in the cache ...
       if(otpMobileCache[mobileNumber] === otp) {
           // res.status(200).send("OTP Verified Successfully");
           console.log("OTP Verified Successfully");
           delete otpMobileCache[mobileNumber]; // Remove the OTP from the cache after successful verification.
           const UpdatedRegisteredUser = await User.findOneAndUpdate({name: userName}, {phoneNumber: mobileNumber}, {new: true});
           if(!UpdatedRegisteredUser) {
               return res.status(404).send("User not found");
           } else {
               res.status(200).json({message: 'Data Updated Successfully', data: UpdatedRegisteredUser});
           }
       }
   } catch (error) {
       console.log(error.message);
       return res.status(500).send(error.message);
   }
});

// Route to log out from the system ...
router.get('/logout', async (req, res) => {
    try {
        // Get the session data ...
        const sessionData = await SessionLog.findOne().sort({ _id: -1});
        if(!sessionData) {
            res.status(404).send("Session Not Found");
        } else {
            const updateSessionData = await SessionLog.updateOne(
                {_id: sessionData._id},
                {$set: {logoutTime: FormattedDateTime, isActive: false}}
            );
            console.log('Session Ended with logout - ', updateSessionData);
            res.status(200).json({message: "Logout Successful", data: updateSessionData});
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

module.exports = router;