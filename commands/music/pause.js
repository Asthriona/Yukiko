
module.exports = {
    name: "pause",
    category: "music",
    description: "Pause the current video.",
    run: async (bot, message, args, ops) => {
        const player = bot.manager.get(message.guild.id);
        if(!player) return message.reply('Im not playing at the moment, please use the `play` command.')
        if(player.playing != false || player.pause != false) return message.reply('Player is already paused.')
        player.pause(true)
        message.reply("Music has been paused!")
    }
}