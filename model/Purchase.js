const mongoose = require('mongoose');
const {FormattedDateTime} = require("../utils/FormatDate");

const schema = new mongoose.Schema({
    items: {
        details: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                priceValue: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdDate: {
        type: Date,
        default: new Date(),
        required: false
    },
    paymentCompletedDate: {
        type: Date,
        default: null,
        required: false
    },
    status: {
        type: String,
        default: 'Unpaid',
        required: false
    },
    purchaseToken: {
        type: String,
        default: null,
        required: false
    },
    purchasedBy: {
        type: String,
        default: null,
        required: false
    }
}, {collection: 'purchases'});

module.exports = mongoose.model('Purchase', schema);