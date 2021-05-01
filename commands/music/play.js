const { MessageEmbed } = require("discord.js");
const ms = require('ms')

module.exports = {
    name: "play",
    category: "music",
    description: "Play music from youtube",
    run: async (bot, message, args) => {
        const { channel } = message.member.voice;
		if (!channel) return message.reply('You must be in a voice channel.');
        var player = bot.manager.get(message.guild.id)
        if(!player){
            var player = bot.manager.create({
                guild: message.guild.id,
                voiceChannel: message.member.voice.channel.id,
                textChannel: message.channel.id,
            });
        }
        player.connect();
        try {
            bot.manager.search(args.join(' '), message.author).then(async res =>{
                switch (res.loadType){
                    case 'TRACK_LOADED':
                        player.queue.add(res.tracks[0]);
                        message.channel.send(`${res.tracks[0].title} has been added to the queue.`)
                        if(player.playing == true){
                            return
                        }else{
                            player.play();
                        }
                        break
                    case 'SEARCH_RESULT':
                        let index = 1;
                        const tracks = res.track.slice(0,5);
                        const embed = new MessageEmbed()()
                        .setAuthor('Song Selection', bot.user.displayAvatarURL())
                        .setDescription(tracks.map(video => `**${index++} - ** ${video.title}`))
                        .setFooter('Your response time close within 30 seconds.')
    
                        await message.channel.send(embed);
                        const collector = message.channel.createMessageCollector(m =>{
                            return m.author.id === message.author.id && new RegExp('^([1-5|cancel])$', 'i').test(m.content);
                        }, {time: 30000, max: 1});
                        collector.on('collect', m =>{
                            const track = tracks[Number(m.content) -1];
                            player.queue.add(track);
                            if(player.playing){
                                return
                            }else{
                                player.play()
                            }
                        });
                        break
                    case 'PLAYLIST_LOADED':
                        res.tracks.forEach(track => player.queue.add(track));
                        message.reply(`Enqueuing \`${res.tracks.length}\` tracks from the playlist \`${res.playlist.name}\` total time: \`${ms(res.playlist.duration, { long: true })}\``)
                        if(player.playing){
                            return
                        }else{
                            player.play()
                        }
                        break
                }
            })
        } catch (error) {
            message.channel.send('Oops! an error happened...')
            console.log(error)
        }
    }
}