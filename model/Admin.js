const mongoose = require('mongoose');
const { FormattedDateTime, FormattedDate, formattedDate } = require('../utils/FormatDate');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: FormattedDateTime
    }
}, {collection: 'admin'});

module.exports = mongoose.model('Admin', schema);