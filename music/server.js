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

if (process.env.NODE_ENV === 'production'){
    bot.login(botConfig.token) 
}else{
    bot.login(botConfig.tokenDev) 
};
console.log(`\x1b[32mMusic bot \x1b[0m is now started and running`)