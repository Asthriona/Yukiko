
module.exports = {
    name: "skip",
    category: "music",
    description: "Skip the current video.",
    run: async (bot, message, args, ops) => {
        const player = bot.manager.get(message.guild.id)
        if(!player || player.playing == false) return message.reply('Nothing is playing at the moment');
        if(player.trackRepeat == true) {
			player.setTrackRepeat(false);
			await player.stop();
			message.channel.send(`${player.queue.current.title} has been skiped, repeat is disabled. \`${this.client.prefix}repeat\` to re-enable `);
		}
		else{
			player.stop();
			message.channel.send(`${player.queue.current.title} has been skiped.`);
		}
    }
}