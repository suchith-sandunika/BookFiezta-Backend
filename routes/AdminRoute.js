const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Admin = require('../model/Admin');

// Admin Registration ...
router.post('/register', async (req, res) => {
    try {
        const {name, email, password: plainTextPassword} = req.body;

        // Check if user exists already ...
        const admin = await Admin.findOne({ email }).lean();
        if(admin) {
            return res.status(400).send("This email already in use");
        } else {
            const password = await bcrypt.hash(plainTextPassword, 10);
            const adminUser = await Admin.create({ name, email, password });
            return res.status(201).json({message: 'Registration Successfull', data: adminUser});
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}); 

// Route for Admin Login ...
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if user related to given details already exists ...
        const admin = await Admin.findOne({email}).lean();
        if(!admin) {
            return res.status(400).send("Invalid credentials");
        } else {
            // Compare the given password with the hashed password in the database ...  
            // Note: In a real-world application, you should use a secure method for password hashing and comparison. 
            // Here, we are using simple bcrypt for demonstration purposes.
            const correctPassword = await bcrypt.compare(password, admin.password);
            if(!correctPassword) {
                return res.status(400).send("Invalid Password");
            } else {
                // Generate JWT token for authenticated user ...
                const token = jwt.sign({
                    id: admin._id, 
                    email: admin.email
                }, process.env.JWT_SECRET, {expiresIn: '1d'});

                // Set the cookie with JWT token for authenticated user ...
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    maxAge: 1000 * 60 * 60 * 24 // 1 day
                }); 

                res.status(200).json({message: 'Login Successful', token: token, data: admin});
            }
        }
    } catch (error) {
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
        const updateAdmin = await Admin.findOneAndUpdate({email: email, password: hashedPassword});
        return res.status(200).json({message: "Password Reset Successfully", data: updateAdmin});
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

module.exports = router;