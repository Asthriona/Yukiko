const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
	name: "queue",
	category: "music",
	description: "Show the queue",
	run: async (bot, message) => {
		const player = bot.manager.get(message.guild.id);
		if(!player) return message.reply("Noting playing at the moment.");
		try {
			if(!player.playing) return message.reply("Nothing is playing at the moment.");
			let total = 0;
			player.queue.forEach(queue => {
				total = total + queue.duration;
			});
			const queueEmbed = new MessageEmbed()()
				.setAuthor("Playlist " + ms(total, { long: true }), message.author.displayAvatarURL())
				.setTitle(`Now Playing: ${player.queue.current.title} requested by: ${player.queue.current.requester.username}`)
				.setFooter(`${bot.user.username} - Yukiko Dev Team`, bot.user.displayAvatarURL());
			queueEmbed.addField("Last Song:", player.queue.previous ? `${player.queue.previous.title} | ${player.queue.previous.requester.username}` : "No previously played songs.");
			for (let i = 0; i < player.queue.length; i += 10) {queueEmbed.splitFields(player.queue.map(track => `${++i}) 『${track.title}』 | Requested by <@${track.requester.id}>`).join(("\n")));}
			message.channel.send(queueEmbed);
		}
		catch (error) {
			console.log(error);
			message.channel.send(`Oops! an error happened...\n\`\`\`${error.message}\`\`\``);
		}
	},
};