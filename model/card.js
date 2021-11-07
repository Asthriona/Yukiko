const mongoose = require("mongoose");

const cardsSchema = new mongoose.Schema({
	did: String,
	link: String,
});
module.exports = mongoose.model("Cards", cardsSchema);