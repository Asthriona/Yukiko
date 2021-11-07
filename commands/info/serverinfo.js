const { MessageEmbed } = require("discord.js");
const moment = require("moment");
module.exports = {
	name: "server",
	aliases: ["server-info", "serverinfo"],
	category: "info",
	description: "Return server infos.",
	run: async (bot, message) => {
		const guildOwner = bot.users.cache.get(message.guild.ownerId);
		const serverembed = new MessageEmbed()
			.setDescription("Server Information")
			.setColor("#800080")
			.setThumbnail(message.guild.iconURL())
			.addField("Server name", `${message.guild.name}`)
			.addField("Created at", `${moment(message.guild.createdAt).format("MMMM Do YYYY, h:mm:ss a")} (${moment(message.guild.createdAt).fromNow()})`)
			.addField("Joined at: ", `${moment(message.member.joinedAt).format("MMMM Do YYYY, h:mm:ss a")} (${moment(message.member.joinedAt).fromNow()})`)
			.addField("Owner: ", `${guildOwner}`)
			.addField("Total members: ", `${message.guild.memberCount}`)
			.setFooter(bot.user.username, bot.user.displayAvatarURL())
			.setTimestamp();
		return message.channel.send({ embeds: [serverembed] });
	},
};