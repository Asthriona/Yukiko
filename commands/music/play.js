var ytdl = require("ytdl-core");
var YouTube = require("simple-youtube-api");
module.exports = {
    name: "play",
    category: "music",
    description: "Play some music in a voice channel!",
    run: async (bot, message, args) => {
        if(!args[0]) return message.reply("please send a youtube link.")
        var voiceChannel = message.member.voiceChannel;
        if(!voiceChannel) return message.channel.send("You are not in a voice channel.");
        var permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send("Please, check you permissions system, I can't join that VC.");
        if(!permissions.has('SPEAK')) return message.channel.send("I can't speak in that channel.");

        try {
            var connection = await voiceChannel.join();
        } catch (error) {
            message.channel.send("An error happened... ```" + error + "```")
            console.log(error)
            return            
        }

        //var dispatcher = connection.playStream("https://broadcaster.animefm.co/radio/8020/radio320.mp3")
        var dispatcher = connection.playStream(ytdl(args[0]))
            .on('end', () =>{
                console.log("Song ended.")
                voiceChannel.leave();
            })
            .on('error', error =>{
                console.log(error)
            });
        dispatcher.setVolumeLogarithmic(5 / 5);

    }
}