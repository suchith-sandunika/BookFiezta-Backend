const express = require('express');
const router = express.Router();

let frontendURL = '';

router.post('/frontend-url', (req, res) => {
    const { url } = req.body;
    try {
        if(url == '' || url.length == 0){
            res.status(400).send('URL is not captured');
        } else {
            frontendURL = url;
            return res.status(200).json({message: 'Frontend URL captured successfully', data: frontendURL });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
});

module.exports = { router, frontendURL };