module.exports = {
    name: "animefm",
    category: "music",
    description: "Play music from https://AnimeFM.co",
    run: async (bot, message, args) => {
        var voiceChannel = message.member.voiceChannel;
        if(!voiceChannel) return message.channel.send("You are not in a voice channel.");
        var permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send("Please, check you permissions system, I can't join that VC.");
        if(!permissions.has('SPEAK')) return message.channel.send("I can't speak in that channel.");

        try {
            var connection = await voiceChannel.join();
            message.channel.send("Now Playing **AnimeFM** https://AnimeFM.co")
        } catch (error) {
            message.channel.send("An error happened... ```" + error + "```")
            console.log(error)
            return            
        }

        var dispatcher = connection.playStream("https://broadcaster.animefm.co/radio/8020/radio320.mp3")
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