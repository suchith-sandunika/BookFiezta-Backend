const mongoose = require('mongoose');
const { FormattedDateTime, FormattedDate, formattedDate } = require('../utils/FormatDate');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: {
            path: String,
            name: String
        },
        required: false,
        default: null
    },
    email: {
        type: String,
        required: false
    },
    dateOfBirth: {
        type: Date,
        required: false,
        default: null
    },
    phoneNumber: {
        type: String,
        required: false,
        default: null
    },
    age: {
        type: Number,
        required: false,
        default: null
    },
    password: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: FormattedDateTime
    },
    cart: {
        type: [
            {
                image: {type: {path: String, name: String}, required: false},
                name: { type: String, required: true },
                publishers: { type: String, required: true },
                price: { type: String, required: true }
            }
        ],
        default: [] // ✅ Ensures the cart starts as an empty array
    },
    purchasedBooks: {
        type: [
            {
                image: {type: {path: String, name: String}, required: false},
                name: { type: String, required: true },
                publishers: { type: String, required: true },
                price: { type: String, required: true }
            }
        ],
        default: [] // ✅ Ensures the purchasedBooks starts as an empty array
    },
    ratedBooks: {
        type: [
            {
                name: { type: String, required: true },
                publishers: { type: String, required: true },
                reatedAt: { type: Date, required: true, default: FormattedDateTime }
            }
        ],
        default: [] // ✅ Ensures the ratedBooks starts as an empty array
    }
}, {collection: 'users'});

module.exports = mongoose.model('User', schema);