
module.exports = {
    name: "resume",
    category: "music",
    description: "Resume the current video.",
    run: async (bot, message, args, ops) => {
        const player = bot.manager.get(message.guild.id);
        if(!player) return message.reply('Im not playing at the moment, please use the `play` command.')
        if(player.playing != true || player.pause != true) return message.reply('Player is not paused.')
        player.pause(false)
        message.reply("Music has been resumed!")
    }
}