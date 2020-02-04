module.exports = {
    name: "stop",
    category: "music",
    description: "Stop the music and clear the queue",
    run: async (bot, message, args) => {
        if(!message.member.voiceChannel) return message.reply("you are not in a voice channel.")
        message.member.voiceChannel.leave();
    }
}