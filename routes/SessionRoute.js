const express = require('express');
const router = express.Router();
const SessionLog = require('../model/SessionLog');

// Route to get the logged user ...
router.get('/loggedUser', async (req, res) => {
    try {
        const lastRecord = await SessionLog.find().sort({createdAt: -1}).limit(1).lean();
        res.status(200).json({message: "Logged User", data: lastRecord});
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
});

module.exports = router;