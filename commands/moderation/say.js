const Discord = require("discord.js");
module.exports = {
	name: "say",
	category: "Moderation",
	description: "Let the bot speak for you",
	run: async (bot, message, args) => {
		if(!message.member.permissions.has("BAN_MEMBERS")) return message.reply("Oy! dont tell me what to say!");
		if(message.deletable) message.delete();
		if(args.length < 1) {return message.reply("Nothing to say? Please TALK TO ME! 😢");}

		const roleColor = message.guild.me.displayHexColor === "#000" ? "#fff" : message.guild.me.displayHexColor ;
		if(args[0].toLowerCase() === "embed") {
			const embed = new Discord.MessageEmbed()
				.setColor(roleColor)
				.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL()})
				.setDescription(args.slice(1).join(" "))
				.setTimestamp()
				.setFooter({ name: `Powered by: ${bot.user.username}`, iconURL: bot.user.displayAvatarURL()});
			message.channel.send({ embeds:[embed] });
		}
		else{
			message.channel.send(args.join(" "));
		}
	},
};