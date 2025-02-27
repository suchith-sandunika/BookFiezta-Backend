const express = require('express');
const router = express.Router();
const { sendFeedback } = require('../controllers/FeedBackSending');
const { sendEMail } = require('../controllers/MailSending');
const { sendPaymentReceiptEmail } = require('../controllers/PaymentReceiptSending');
const Purchase = require("../model/Purchase");
const User = require("../model/User");

// Route to send mails though contact us ...
router.post('/contact-us', async (req, res) => {
    try {
        const { email, name, message } = req.body;
        // Email the admin using the provided email, name, and message...
        sendEMail(email, name, message);
        res.status(200).json({ message: 'Mail sent successfully' });
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// Route to send mails though contact us ...
router.post('/send-feedback', async (req, res) => {
    try {
        const { email, name, message } = req.body;
        // Email the admin using the provided email, name, and message...
        sendFeedback(email, name, message);
        return res.status(200).send('Feedback sent successfully');
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

router.post('/user/send/payment-receipt', async (req, res) => {
    try {
        const { email, orderId } = req.body;
        // let purchasedItems = [];
        let message = ``;
        let totalPricePurchased = 0;
        // get the relevant purchase details ...
        const purchase = await Purchase.findById(orderId);
        if(!purchase) {
            return res.status(404).send('Purchase Not Found');
        } else {
            // check the email validity ...
            const validUser = await User.findById(purchase.userId)
            if(validUser.email != email) {
                res.status(400).send('Email validation failed');
            } else {
                const items = purchase.items.details;
                items.forEach(item => {
                    // const paymentRelatedStr = `${item.name} - USD ${item.priceValue}`;
                    totalPricePurchased = totalPricePurchased + item.priceValue;
                    message = message + ` ${item.bookName} from ${item.publishers} - USD ${item.priceValue}`;
                    // purchasedItems.push(paymentRelatedStr);
                });
                // Call the function to send email ...
                sendPaymentReceiptEmail(email, message, totalPricePurchased, orderId, purchase.purchasedBy);
                res.status(200).send('Payment Receipt Email Sent to user Successfully');
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
});

module.exports = router;