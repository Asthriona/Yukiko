var mongoose = require("mongoose");

var cardsSchema = new mongoose.Schema({
    did: String,
    link: String
})
module.exports = mongoose.model("Cards", cardsSchema);