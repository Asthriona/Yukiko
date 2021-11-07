const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	did: String,
	username: String,
	serverID: String,
	xp: Number,
	level: Number,
	message: Number,
	warns: Number,
	avatarURL: String,
});
module.exports = mongoose.model("Users", userSchema);