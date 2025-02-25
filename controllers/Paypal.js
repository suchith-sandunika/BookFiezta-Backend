const axios = require('axios');
require('dotenv').config();

// Function to generate PayPal access token
const generateAccessToken = async () => {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYMENT_CLIENT_ID,
            password: process.env.PAYMENT_SECRET,
        },
    });

    console.log(response.data.access_token);
    return response.data.access_token;
};

const createOrder = async (items, orderId) => {
    const accessToken = await generateAccessToken();

    // Format items into the correct PayPal API structure
    const purchaseItems = items.map(item => ({
        name: item.name,
        unit_amount: {
            currency_code: 'USD',
            value: item.priceValue, // Ensure it's a valid decimal
        },
        quantity: 1,
    }));

    // Calculate total price
    const totalPrice = items.reduce((sum, item) => sum + item.priceValue, 0).toFixed(2);
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // Ensure space after 'Bearer'
        },
        data: {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    items: purchaseItems,
                    amount: {
                        currency_code: 'USD',
                        value: totalPrice,
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: totalPrice,
                            },
                        },
                    },
                },
            ],
            application_context: {
                return_url: process.env.REDIRECT_BASE_URL + `/home?status=paid?orderId=${orderId}`,
                cancel_url: process.env.REDIRECT_BASE_URL + `/home?status=unpaid?orderId=${orderId}`,
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'home',
            },
        },
    });
    // Return the approval URL to the client ...
    const approvalUrl = response.data.links.find((link) => link.rel === 'approve').href;
    return approvalUrl;
};


// Function to create PayPal order
// const createOrder = async (name, price) => {
//     const accessToken = await generateAccessToken();
//     const response = await axios({
//         url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
//         method: 'post',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer' + accessToken,
//         },
//         data: {
//             intent: 'CAPTURE',
//             purchase_units: [
//                 {
//                     items: [
//                         {
//                             name: name,
//                             unit_amount: {
//                                 currency_code: 'USD',
//                                 value: price,
//                             },
//                             quantity: 1,
//                         },
//                     ],
//                     amount: {
//                         currency_code: 'USD',
//                         value: price,
//                         breakdown: {
//                             item_total: {
//                                 currency_code: 'USD',
//                                 value: price,
//                             },
//                         },
//                     },
//                 },
//             ],
//             application_context: {
//                 return_url: process.env.REDIRECT_BASE_URL + '/home',
//                 cancel_url: process.env.REDIRECT_BASE_URL + '/home',
//                 shipping_preference: 'NO_SHIPPING',
//                 user_action: 'PAY_NOW',
//                 brand_name: 'home',
//             },
//         },
//     });
//
//     // Return the approval URL to the client
//     const approvalUrl = response.data.links.find((link) => link.rel === 'approve').href;
//     return approvalUrl;
// };

// Function to capture PayPal payment
const capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken();
    console.log('Access Token : ', accessToken);
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer' + accessToken,
        },
    });

    // Check if the payment was completed successfully
    //const paymentStatus = response.data.status === "COMPLETED" ? "paid" : "unpaid";

    console.log(response);
    return { data: response.data };
};

module.exports = { createOrder, capturePayment };