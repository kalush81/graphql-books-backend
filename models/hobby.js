const mongoose = require('mongoose');

const hobbySchema = new mongoose.Schema({
    title: String,
    body: String,
})

module.exports = mongoose.model("Hobby", hobbySchema)