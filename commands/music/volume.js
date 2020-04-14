var ytdl = require("ytdl-core")
module.exports = {
    name: "testvolume",
    category: "music",
    description: "change the volume of the video.",
    run: async (bot, message, args, ops) => {
        var guildIDData = ops.active.get(message.guild.id)
        if(!guildIDData) return message.reply("Nothing in the queue for now.");
        if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.reply("Hey, i'm busy in another channel right now. sorry!");
        if(!args[0]) return message.reply("The current volume is " + guildIDData.dispatcher.volume);
            
        if(isNaN(args[0] || args[0] <0 || args[0] > 150))return message.reply("Please use a number between 0 and 100")
        guildIDData.dispatcher.setVolume(args[0]/100);
        return message.reply(`volume set to ${args[0]}`)
    }
}