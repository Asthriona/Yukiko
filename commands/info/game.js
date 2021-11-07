module.exports = {
	name: "game",
	category: "info",
	description: "change what bot is actually playing.",
	aliases: ["setgame"],
	run: async (bot, message, args) => {
		if(message.member.hasPermission("BAN_MEMBERS")) {
			console.log(args[0]);
			bot.user.setStatus("pog");
			bot.user.setPresence({ activity: { name: args.join(" ") } });
		}
		else{
			console.log("Nope");
			return message.reply("Oy! You can't tell me what to do! ");
		}

	},
};