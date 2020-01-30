

var botConfig = require('../botconfig.json');
var discord = require("discord.js");
var Util = require("discord.js");
var ytdl = require('ytdl-core');
var YouTube = require('simple-youtube-api')
require('dotenv').config();


var youtube = new YouTube(botConfig.YtKey);
var bot = new discord.Client({disableEveryone: true});
bot.commands = new discord.Collection();
bot.on('disconnect', () => console.log("Musicbot is Disconected."));
bot.on('reconnecting', () => console.log("Music Bot is reconnecting."))
bot.on('ready', () => `\x1b[32mMusic bot\x1b[0m is now started and running on \x1b[31m${bot.user.username} \x1b[0menvironement!`)
var queue = new Map();

bot.on('message', async message =>{
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if (!message.content.startsWith(botConfig.prefix)) return

    let prefix = botConfig.prefix;
    let args = message.content.split(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const searchString = args.slice(1).join(' ');
    const serverQueue = queue.get(message.guild.id);

    if(message.content.startsWith(`${prefix}play`)) {
        if(!args[1]) return message.reply("You must provide a youtube link.")
        var voiceChannel = message.member.voiceChannel;
        if(!voiceChannel) return message.reply('You must be in a voice channel.')
        var permission = voiceChannel.permissionsFor(message.client.user);
        if(!permission.has('CONNECT')){
            return message.reply("I'm unable to connect to you voice channel, please check my permission or change VC.");
        }
        if(!permission.has('SPEAK')){
            return message.reply("I cannot speak in this VC please check I have the permission or change VC.");
        }
        if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
            var playlist = await youtube.getPlaylist(url);
            var videos = await playlist.getVideos();
            for (var video of Object.values(videos)){
                var video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, message, voiceChannel, true);
            }
            message.channel.send(`**${playlist.title}** Has been added to the queue.`);
        }else{
        try {
            var video = await youtube.getVideo(url);
        } catch (error) {
            try {
                var videos = await youtube.searchVideos(searchString, 1);
                console.log("Searching: " + searchString + " Requested by " + message.author.username)
                var video = await youtube.getVideoByID(videos[0].id);
            } catch (err) {
                console.log(err);
                return message.channel.send("No video found :c ```" + err.error + "```")
            }
        }
        return handleVideo(video, message, voiceChannel, playlist = false);
    }
        //console.log(video)
        async function handleVideo(video, message, voiceChannel){
            var video = await youtube.getVideoByID(videos[0].id);
            var serverQueue = queue.get(message.guild.id)
            var song = {
                id: video.id,
                title: Util.escapeMarkdown(video.title),
                url: "https://www.youtube.com/watch?v=" + video.id
            };
            console.log(song)
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
                    play(message.guild, queueConstruct.songs[0]);
                } catch (error) {
                    console.log(`An error sucessfully happened! ${error}`)
                    queue.delete(message.guild.id)
                    return message.channel.send("An error sucessfully happened! ```" +error+ " ``` Please contact <@186195458182479874> ");
                }
                return undefined;
            } else {
                serverQueue.songs.push(song);
                console.log("MUSIC BOT: Server Queue: " + serverQueue.songs)
                if(playlist)return undefined;
                message.channel.send(`** ${song.title} ** has been addded to the queue`);
            }
        }
        } else if(message.content.startsWith(`${prefix}skip`)){
            if(!serverQueue) return message.reply('Im not playing anything right now, so I cant skip anything except void! :thinking:')
            serverQueue.connection.dispatcher.end();
            return undefined;
        } else if(message.content.startsWith(`${prefix}stop`)){
            if(!message.member.voiceChannel) return message.reply('You are not in the voice chat! :c');
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
            return undefined;
        } else if(message.content.startsWith(`${prefix}np`)){
            if(!serverQueue) return message.reply("Nothing is currectly playing.");
            return message.channel.send("Now Playing: ***" +serverQueue.songs[0].title + "***")
        } else if(message.content.startsWith(`${prefix}volume`)){
            if(!message.member.voiceChannel) return message.reply("You are not in the voice channel!")
            if(!serverQueue) return message.reply('There is nothing currently playing.');
            if(!args[1]) return message.reply("The current volume is " + serverQueue.volume);
            serverQueue.volume = args[1];
            serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
            return message.reply("I set the volume to " + args[1])

        }else if(message.content.startsWith(`${prefix}queue`)){
            if(!serverQueue) return ("There is nothing currently playing.")
            return message.channel.send(`
~Song Queue~
${serverQueue.songs.map(song => `> **-** ${song.title}`).join('\n')}
**Now Playing:** ${serverQueue.songs[0].title}
            `)
        }else if(message.content.startsWith(`${prefix}pause`)) {
            if(serverQueue && serverQueue.playing){
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.reply("Music is now paused.");
            }
        }else if(message.content.startsWith(`${prefix}resume`)){
            if(serverQueue && !serverQueue.playing){
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.reply("Music un paused.");
            }
            return message.reply("There is nothing playing.")
        }
//fin du bot
});
function play(guild, song){
    var serverQueue = queue.get(guild.id)
    if(!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
    }
    var dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    .on('end', () =>{
        console.log('MUSIC: Song ended.');
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0])
    })
    .on('error', error => console.log(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    serverQueue.textChannel.send("Now Playing: **" + song.title + "**")
}
    bot.login(botConfig.tokenDev) 
console.log(`\x1b[32mMusic bot \x1b[0m is now started and running`)