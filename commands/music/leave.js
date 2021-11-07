module.exports = {
	name: "stop",
	category: "music",
	description: "stop playing music and leave the channel.",
	run: async (bot, message) => {
		const player = bot.manager.get(message.guild.id);
		if(!player) return message.reply("There is no active player at the moment.");
		if (!player.playing) {
			player.destroy();
			message.channel.send("👉🚪 Leaving the channel.");
		}
		else {
			player.destroy();
			message.channel.send("🎵 Player has been destroyed. 👉🚪 Leaving the channel.");
		}
	},
};