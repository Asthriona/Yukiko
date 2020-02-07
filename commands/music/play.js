var ytdl = require("ytdl-core");
var queue = new Map();

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
        var songInfo = await ytdl.getInfo(args[0])
        var song = {
            title: songInfo.title,
            url: songInfo.video_url
        }
        var serverQueue = queue.get(message.guild.id)
        if(!serverQueue){
            var queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 0.5,
                playing: true
            };
            queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);
            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                play(message.guild, queueConstruct.songs[0])
            } catch (error) {
                message.channel.send("An error happened... ```" + error + "```")
                console.log(error)
                queue.delete(message.guild.id)
                return            
            }
        }else{
            serverQueue.songs.push(song);
            return message.channel.send(`**${song.title}** Has been added to the queue.`)
        }

        function play(guild, song){
            var serverQueue = queue.get(guild.id);
            console.log(serverQueue.songs)
            if(!song){
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return
            }
            var dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on('end', () =>{
                console.log("Song ended.")
                serverQueue.songs.shift()
                play(guild, serverQueue.songs[0]);
            })
            .on('error', error => console.log(error));
        dispatcher.setVolumeLogarithmic(5 / 5);

        }
        return
    }
}