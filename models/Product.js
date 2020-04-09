const mongoose = require('mongoose');

const Product = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    description: String,
    price: Number,
    photoUrl: String
});

module.exports = mongoose.model('Products', Product);