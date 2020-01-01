var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    did: String,
    username: String,
    serverID: String,
    xp: Number,
    level: Number,
    message: Number,
    avatarURL: String
})
module.exports = mongoose.model("Users", userSchema);