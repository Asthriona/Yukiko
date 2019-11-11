var botConfig = require('./botconfig.json');
var discord = require("discord.js");
var fs = require('fs');
var util = require('util');
var http = require('http');
var pjson = require('./package.json');

var port = 3000;

console.log("Initializing bot...")

require('dotenv').config();
console.log("Initializing bot in " + process.env.NODE_ENV + " Environement.")

//WebServer For ping monitoring
http.createServer(function(req, res) {
    res.write(fs.readFileSync('./monitoring/index.html'));
    res.end();
}).listen(port);
console.log(`Starting Web Server for ping monitoring on port ${port}`);

//DiscordBot
console.log('Initializing Discord API');
var bot = new discord.Client({disableEveryone: true});
bot.commands = new discord.Collection();

//commands Handler
console.log("Initializing commands handler");
fs.readdir("./commands", (err, files) => {
    if(err) console.log("Woops! Somthing wrong happen! " + (err));

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Woops! Error sucessfully Happen! Can't find commands files!");
        return;
    }
    console.log("Loadings files...");
    jsfile.forEach((f, i) =>{
        let props = require(`./commands/${f}`);
        console.log(`${f} Loaded! Moving on!`);
        bot.commands.set(props.help.name, props);
    });
});
console.log('Setting bot presence...')
bot.on('ready', () =>{
    bot.user.setStatus('online');
    bot.user.setPresence({
        game: {
            name: 'Developement',
            type: 'PLAYING',
            url: 'https://www.asthriona.com/'
        }
    });
});

bot.on('message', async message =>{
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botConfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);


//Commands Handler
console.log("Reading Commands Handler...")
let commandfile = bot.commands.get(messageArray[0].slice(prefix.length));
if(commandfile) commandfile.run(bot,message,args);

//Commands
if(cmd === `${prefix}ping`){
    console.log(`${message.author.user} used !ping on ${message.guild.name}`)
    return message.channel.send("Pong!");
}

});
if (process.env.NODE_ENV === 'production'){
    bot.login("LOL") 
}else{
    bot.login("ANOTHER LOL") 
};