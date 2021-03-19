const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: String,
    age: Number,
})

authorSchema.methods.log = function() {
    console.log(`${this.name} created`)
}

module.exports = mongoose.model("Author", authorSchema)