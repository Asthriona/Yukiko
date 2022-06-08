const { MessageEmbed } = require("discord.js");
const pjson = require("../../package.json");
module.exports = {
	name: "botinfo",
	category: "info",
	description: "show you information about this bot.",
	run: async (bot, message) => {
		const botembed = new MessageEmbed()
			.setThumbnail(bot.user.displayAvatarURL)
			.setTitle("About this bot:")
			.setAuthor({ name: bot.user.username, iconURL: bot.user.displayAvatarURL() })
			.setDescription("this bot can make your cat explode, Mount the DOGO, burn your egg and clean your house. (but not your room. we tested all of this.(RIP my cat...))")
			.setColor("#800080")
			.addField("Bot name:", bot.user.username, true)
			.addField("Version:", `${pjson.version} ${pjson.codeName}`, true)
			.addField("Developped by:", "[Asthriona](https://Asthriona.com) / [RiseDev](https://twitter.com/_RiseDev)", true)
			.addField("Developpers Website", "[Yukiko Dev Team](https://team.yukiko.app/), [Asthriona](https://Asthriona.com), [RiseDev](https://twitter.com/_RiseDev)", true)
		// Please DO NOT un-credit us. feel free to un-comment the line below to credit yourself :)
		// .addField("Edited by", "[Your Name](https://YourWebsiteOrLink.com)")
			.addField("Created on", bot.user.createdAt, true)
			.addField("On the server since:", bot.user.joinedAt, true)
			.addField("Git:", "https://github.com/Asthriona/Yukiko", true)
			.addField("Site: ", "http://yukiko.nishikino.me/", true)
			.addField("Guilds Using this bot: ", bot.guilds.size, true)
			.setTimestamp()
			.setFooter({ text: bot.user.username, iconURL: bot.user.displayAvatarURL() });
		return message.reply({ embeds: [botembed] });
	},
};