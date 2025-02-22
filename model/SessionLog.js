const mongoose = require('mongoose');
const { FormattedDateTime, FormattedDate, formattedDate } = require('../utils/FormatDate');

const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: formattedDate
    },
    expiringAt: {
        type: Date,
        required: false,
        default: FormattedDateTime
    },
    logoutTime: {
        type: Date,
        required: false,
        default: null
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    }
}, {collection: 'sessionlogs'});

module.exports = mongoose.model('SessionLog', schema);