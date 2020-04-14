var ytdl = require("ytdl-core")
module.exports = {
    name: "testqueue",
    category: "music",
    description: "Show the queue",
    run: async (bot, message, args, ops) => {
        var guildIDData = ops.active.get(message.guild.id);
        if(!guildIDData) return message.reply("Nothing in the queue for now.");
        
        var queue = guildIDData.queue;
        var nowPlaying = queue[0];
        var response = `Now playing: ${nowPlaying.songTitle} -> requested by ${nowPlaying.requester} \n\n ~Queue!~\n`;

        for(var i =0; i < queue.length; i++){
            response += `${i} - ${queue[i].songTitle} -> Requested by ${queue[i].requester}\n`;
        }
        message.channel.send(response)

    }
}