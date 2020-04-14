var ytdl = require("ytdl-core");
var search = require("yt-search");
module.exports = {
    name: "search",
    category: "music",
    description: "change the volume of the video.",
    run: async (bot, message, args, ops) => {
        if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.reply("Hey, i'm busy in another channel right now. sorry!");
        var guildIDData = ops.active.get(message.guild.id)
        search(args.join(" "), function (err, res) {
            if (err) return message.reply("an error happened :/ ```" + err + "```");
            var videos = res.videos.slice(0, 10);
            var response = `Please enter a number between 1 and ${videos.length} \n`;
            for (var i in videos) {
                response += `**[${parseInt(i) + 1}]:** ${videos[i].title}\r\n`;
            }
            message.reply(response);

            var filter = music => !isNaN(music.content) && music.content < videos.length && music.content > 0;
            var collection = message.channel.createMessageCollector(filter);
            collection.videos = videos;

            collection.once('collect', function (music) {
                var commandfile = require('./play.js');
                commandfile.run(bot, message, [this.videos[parseInt(music.content) - 1].url], ops);
            });

        })
    }
}