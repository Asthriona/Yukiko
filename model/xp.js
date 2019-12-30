var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    did: String,
    xp: Number,
    level: Number,
    message: Number
})
module.exports = mongoose.model("Users", userSchema);