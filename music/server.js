var botConfig = require('../botconfig.json');
var discord = require("discord.js");
var ytdl = require('ytdl-core');
var streamOptions ={
    seek: 0,
    volume: 0.3
}
console.log("Initializing music module...")
var servers = {};

console.log('Initializing Discord API');
var bot = new discord.Client({disableEveryone: true});
bot.commands = new discord.Collection();

bot.on('message', async message =>{
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botConfig.prefix;
    let messageArray = message.content.split(" ");
    let args = messageArray;
    let cmd = messageArray[0];


    if(cmd === `${prefix}play`){
        function play(connection, message){
            var server = servers[message.guild.id];
            server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
            server.queue.shift();
            server.dispatcher.on("end", function(){
                if(server.queue[0]){
                    play(connection, message);
                }else{
                    connection.disconnect();
                }
            })
        }

        if(!message.member.voiceChannel){
            return message.reply("You must be in a voice channel.");
        }
        if (!args[1]) {
            return message.channel.send('You must provide a URL!')
              .catch(console.error);
        }
        if(!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        }
        var server = servers[message.guild.id];
        server.queue.push(args[1]);
        if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
            play(connection, message);
        })
    }
    if(cmd === `${prefix}skip`){
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end()
            message.channel.send("Song skipped.")
    }
    if(cmd === `${prefix}stop`){
        var server = servers[message.guild.id];
        if(message.guild.voiceConnection){
            for(var i = server.queue.length -1; i >=0; i--){
                server.queue.splice(i, 1);
            }
            server.dispatcher.end();
            message.channel.send("Queue stoped. Quitting VC now.")
            console.log('stop The queue')
        }
    }
    if(message.guild.connection) message.guild.voiceConnection.disconnect();
});
bot.login(botConfig.tokenDev)
console.log('Music module is ready!')