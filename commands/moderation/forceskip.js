var ytdl = require("ytdl-core")
module.exports = {
    name: "testforceskip",
    category: "music",
    description: "Skip the current video.",
    run: async (bot, message, args, ops) => {
        if(message.member.hasPermission("BAN_MEMBERS")){
            var guildIDData = ops.active.get(message.guild.id)
            if(!guildIDData) return message.reply("Nothing in the queue for now.");
            if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.reply("Hey, i'm busy in another channel right now. sorry!");
    
            ops.active.set(message.guild.id, guildIDData);
            message.channel.send(`**${guildIDData.queue[0].songTitle}** Has been skiped by an admin.`)
            return guildIDData.dispatcher.emit("end")
        }
    }
}