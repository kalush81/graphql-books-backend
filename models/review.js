const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    body: String,
    bookId: String 
})

module.exports = mongoose.model("Review", reviewSchema)