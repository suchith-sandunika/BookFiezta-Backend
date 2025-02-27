const mongoose = require('mongoose');
const {FormattedDateTime} = require("../utils/FormatDate");

const schema = new mongoose.Schema({
    items: {
        details: [
            {
                bookId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                bookName: {
                    type: String,
                    required: true
                },
                publishers: {
                    type: String,
                    required: true
                },
                priceValue: {
                    type: Number,
                    required: true
                },
                priceUnit: {
                    type: String,
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