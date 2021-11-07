module.exports = {
	name: "join",
	category: "music",
	description: "Let the bot join your VC waiting for music.",
	run: async (bot, message) => {
		const player = bot.manager.create({
			guild: message.guild.id,
			voiceChannel: message.member.voice.channel.id,
			textChannel: message.channel.id,
		});
		player.connect();
		message.reply("Here I am :D");
	},
};