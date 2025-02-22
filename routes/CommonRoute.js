const express = require('express');
const router = express.Router();
const { sendEMail } = require('../controllers/MailSending');

// Route to send mails though contact us ...
router.post('/contact-us', async (req, res) => {
    try {
        const { email, name, message } = req.body;
        // Send an email to the admin using the provided email, name, and message...
        sendEMail(email, name, message);
        res.status(200).json({ message: 'Mail sent successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;