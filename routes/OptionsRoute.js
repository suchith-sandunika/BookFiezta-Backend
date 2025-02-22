const express = require('express');

const router = express.Router();

// OPTIONS method for a specific route ...
router.options('/options', (req, res) => {
    res.header('Allow', 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS');
    res.sendStatus(200); // Respond with 200 OK
}); 

// The options method is used to configure the allowed methods ...

// If the server supports the OPTIONS method, you will receive a response with a 200 OK status and headers indicating allowed HTTP methods. ...

router.head('/header', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // res.setHeader('Content-Length', '1234');
    res.sendStatus(200);
}); 

// The options method is used to configure the response header ...

// If the server supports the HEAD method, You will receive headers such as Content-Type, Content-Length, Server, etc. but no response body. ...


module.exports = router;