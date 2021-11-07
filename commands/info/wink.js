const superagent = require("superagent");
const { MessageEmbed } = require("discord.js");
module.exports = {
	name: "wink",
	category: "info",
	description: "send a Winky face!",
	run: async (bot, message) => {
		const { body } = await superagent
			.get("https://some-random-api.ml/animu/wink");
		const winkembed = new MessageEmbed()
			.setColor("#800080")
			.setTitle("winky Face! ;)")
			.setImage(body.link);

		message.channel.send({ embeds: [winkembed] });
	},
};