const express = require('express');
const { createOrder, capturePayment } = require('../controllers/Paypal');
require('dotenv').config();

const router = express.Router();

// Route to initiate the payment
router.post('/pay', async (req, res) => {
    const { items, orderId, url } = req.body;
    try {
        const approvalUrl = await createOrder(items, orderId, url);
        console.log(approvalUrl);
        res.status(200).json({ url: approvalUrl });
    } catch (error) {
        console.error('Error creating order:', error.message);
        return res.status(500).json({ error: 'Failed to create order' });
    }
});

// {
//     "items": [
//     { "name": "Product A", "price": 29.99 },
//     { "name": "Product B", "price": 49.99 }
// ]
// }

// Route to handle payment completion ...
router.get('/complete-payment', async (req, res) => {
    const { token } = req.body;
    try {
        const paymentDetails = await capturePayment(token);
        res.json({ status: 'success', details: paymentDetails });
    } catch (error) {
        console.error('Error capturing payment:', error.message);
        return res.status(500).json({ error: 'Failed to capture payment' });
    }
});

// Route to handle payment cancellation ...
router.get('/cancel-payment', (req, res) => {
    res.json({ status: 'canceled', message: 'Payment was canceled by the user' });
    // res.redirect(process.env.REDIRECT_BASE_URL + '/home');
    res.redirect('/');
});

module.exports = router;