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
    auther: {
        type: String,
        required: true
    },
    publishers: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: 'No description available'
    },
    price: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    publishedYear: {
        type: Number,
        required: false
    },
    addedDate: {
        type: Date,
        default: FormattedDateTime,
    },
    sells: {
        type: Number,
        required: false,
        default: 0
    },
    rating: {
        type: String,
        required: false,
        default: '0/10'
    },
    reviews: {
        type: [
            {
                userName: { type: String, required: true },
                reviewBody: { type: String, required: true },
                reviewAddedDate: { type: Date, required: true, default: FormattedDateTime }
            }
        ],
        default: [] // ✅ Ensures the reviews starts as an empty array
    }
}, {collection: 'books'});

module.exports = mongoose.model('Book', schema);