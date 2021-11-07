const Discord = require("discord.js");
module.exports = {
	name: "say",
	category: "Moderation",
	description: " ",
	run: async (bot, message, args) => {
		if(!message.member.permissions.has("BAN_MEMBERS")) return message.reply("Oy! dont tell me what to say!");
		if(message.deletable) message.delete();
		if(args.length < 1) {return message.reply("Nothing to say? Please TALK TO ME! 😢");}

		const roleColor = message.guild.me.displayHexColor === "#000" ? "#fff" : message.guild.me.displayHexColor ;
		if(args[0].toLowerCase() === "embed") {
			const embed = new Discord.MessageEmbed()
				.setColor(roleColor)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setDescription(args.slice(1).join(" "))
				.setTimestamp()
				.setFooter(`Powered by: ${bot.user.username}`, bot.user.displayAvatarURL());
			message.channel.send({ embeds:[embed] });
		}
		else{
			message.channel.send(args.join(" "));
		}
	},
};