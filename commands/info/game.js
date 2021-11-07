module.exports = {
	name: "game",
	category: "info",
	description: "change what bot is actually playing.",
	aliases: ["setgame"],
	run: async (bot, message, args) => {
		if(message.member.permissions.has("BAN_MEMBERS")) {
			bot.user.setPresence({ activities: [{ name: args.join(" ") }] });
		}
		else{
			return message.reply("Oy! You can't tell me what to do! ");
		}

	},
};