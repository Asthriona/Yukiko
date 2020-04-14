var ytdl = require("ytdl-core")
module.exports = {
    name: "stop",
    category: "music",
    description: "stop playing music and leave the channel.",
    run: async (bot, message, args, ops) => {
        if(!message.member.voiceChannel) return message.reply("You must be in a voice channel!");
        if(!message.guild.me.voiceChannel) return message.reply("i'm not in a voice channel baka!");
        if(message.guild.me.voiceChannelID != message.member.voiceChannelID) return message.reply("Hey, i'm busy in another channel right now. sorry!");

        message.guild.me.voiceChannel.leave()
        message.reply("I leaved the VC :)")

    }
}