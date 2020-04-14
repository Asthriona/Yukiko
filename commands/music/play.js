var { RichEmbed } = require("discord.js");
var ytdl = require("ytdl-core");
var YouTube = require('simple-youtube-api');
var botConfig = require('../../botconfig.json');
module.exports = {
    name: "testplay",
    category: "music",
    description: "Play music from youtube",
    run: async (bot, message, args, ops) => {
        var youtube = new YouTube(botConfig.YtKey);
        if(!message.member.voiceChannel) return message.reply("You must be in a voice channel!");
        //if(message.guild.me.voiceChannel) return message.reply("I can't connect to this voice channel. Please check the permissions.");
        if(!args[0]) return message.reply("Please provide a youtube or niconico video link.");

        var validate = await ytdl.validateURL(args[0]);
        if(!validate) return message.reply("This url can't be validate. please check your link.");

        var info = await ytdl.getInfo(args[0]);
        var meta = await youtube.getVideo(args[0]);
        var data = ops.active.get(message.guild.id) || {};
        
        if(!data.connection) data.connection = await message.member.voiceChannel.join();
        if(!data.queue) data.queue = [];
        data.guildID = message.guild.id;
        data.queue.push({
            songTitle: info.title,
            requester: message.author,
            url: args[0],
            thumb: meta.thumbnails.high.url,
            announceChannel: message.channel.id
        });
        
        if(!data.dispatcher){
            play(bot, ops, data);
        }else{
            message.channel.send(`${info.title} has been added to the queue. *requested by ${data.queue[0].requester}.`)
        }
        ops.active.set(message.guild.id, data);
    }
}
async function play(bot, ops, data) {
    let npEmbed = new RichEmbed()
    .setColor("PURPLE")
    .setAuthor("~Now Playing!~")
    .setDescription(`**=> ${data.queue[0].songTitle}**
    **Requested by:** ${data.queue[0].requester}`)
    .setImage(data.queue[0].thumb)
    bot.channels.get(data.queue[0].announceChannel).send(npEmbed);
    var options = {seek:0, volume: 0.5, bitrate: 96000};
    data.dispatcher = await data.connection.playStream(ytdl(data.queue[0].url, {filter: "audioonly"}), options);
    data.dispatcher.guildID = data.guildID;
    data.dispatcher.once('end', function() {
    Finish(bot, ops, this);
    });
}

function Finish(bot, ops, dispatcher) {
    var fetchData = ops.active.get(dispatcher.guildID);
    fetchData.queue.shift();
    if(fetchData.queue.length > 0){
        ops.active.set(dispatcher.guildID, fetchData);
        play(bot, ops, fetchData);
    }else{
        ops.active.delete(dispatcher.guildID);
        var voiceChannel = bot.guilds.get(dispatcher.guildID).me.voiceChannel;
        if(voiceChannel) voiceChannel.leave();
    }
}