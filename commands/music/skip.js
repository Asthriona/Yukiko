var ytdl = require("ytdl-core")
module.exports = {
    name: "testskip",
    category: "music",
    description: "Skip the current video.",
    run: async (bot, message, args, ops) => {
        var guildIDData = ops.active.get(message.guild.id)
        if(!guildIDData) return message.reply("Nothing in the queue for now.");
        if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.reply("Hey, i'm busy in another channel right now. sorry!");

        var amountUsers = message.member.voiceChannel.members.size;
        var amountSkip = Math.ceil(amountUsers / 2);
        if(!guildIDData.queue[0].voteSkips) guildIDData.queue[0].voteSkips = [];
        if(guildIDData.queue[0].voteSkips.includes(message.member.id)) return message.reply(`you can only vote once per song. ${guildIDData.queue[0].voteSkips.length}/${amountSkip}`);
        guildIDData.queue[0].voteSkips.push(message.member.id);

        ops.active.set(message.guild.id, guildIDData);

        if(guildIDData.queue[0].voteSkips.length >= amountSkip){
            message.channel.send(`Vote skip passed! ${guildIDData.queue[0].voteSkips.length}/${amountSkip}`)
            return guildIDData.dispatcher.emit("end")
        }
        message.channel.send(`A vote skip has been started! ${guildIDData.queue[0].voteSkips.length}/${amountSkip}`)
    }
}