const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../function");

module.exports = {
	name: "whois",
	aliases: ["who", "user", "info", "tamer"],
	description: "Returns user information",
	category: "info",
	usage: "[username | id | mention]",
	run: (bot, message, args) => {
		const member = getMember(message, args.join(" "));

		// Member variables
		const joined = formatDate(member.joinedAt);
		const roles = member.roles.cache
			.filter(r => r.id !== message.guild.id)
			.map(r => r).join(", ") || "none";

		// User variables
		const created = formatDate(member.user.createdAt);

		const embed = new MessageEmbed()
			.setFooter(bot.user.username, bot.user.displayAvatarURL())
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
			.setAuthor(message.author.username, message.author.displayAvatarURL())

			.addField("Member information:", stripIndents`**=> Display name:** ${member.displayName}
            **=> Joined at:** ${joined}
            **=> Roles:** ${roles}`, true)

			.addField("User information:", stripIndents`**=> ID:** ${member.user.id}
            **=> Username:** ${member.user.username}
            **=> Tag:** ${member.user.tag}
            **=> Created at:** ${created}`, true)

			.setTimestamp();
		message.channel.send({ embeds: [embed] });
	},
};