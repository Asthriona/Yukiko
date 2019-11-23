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
        console.log(`${f} Loaded!`);
        bot.commands.set(props.help.name, props);
    });
    console.log("Files Loaded, Moving on!")
    console.log(`\x1b[32mAsthriona Mod Bot\x1b[0m is now started and running in \x1b[31m${process.env.NODE_ENV} \x1b[0menvironement!`)
});
console.log('Setting bot presence...')
bot.on('ready', () =>{
    bot.user.setStatus('online');
    bot.user.setPresence({
        game: {
            name: 'Asthriona.com',
            type: 'WATCHING',
            url: 'https://www.asthriona.com/'            
        }
    });
    if (process.env.NODE_ENV == "production") {
        var channelprod = bot.channels.get(botConfig.channelprod);
        let bicon = bot.user.displayAvatarURL;
        let versionembed = new discord.RichEmbed()
        .setColor("#800080")
        .setAuthor('Bot Online!', 'https://cdn.discordapp.com/emojis/515665388495962112.png', 'https://github.com/Asthriona')
        .setDescription("Le bot viens juste de démaré, il est maintenant fonctionel et a jour!")
        .addField("Bot Status:", "Ready!")
        .addField("Version:", pjson.version)
        .addField("Version name: ", pjson.codeName)
        .addField("Environement", `${process.env.NODE_ENV}`)
        .addField('ChangsLogs:', 'https://git.io/JeiBi')
        .setFooter(`Hosted by Sirius Media Group`, `${bicon}`, 'https://TheWall.ovh')
        .setThumbnail(bicon);
        return channelprod.sendMessage(versionembed);  
    }
});

bot.on('message', async message =>{
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var hs = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var ms = date.getMilliseconds();
    date = hs +':'+ min +':'+ sec +':'+ ms + ' -- ' + mm + '/' + dd + '/' + yyyy + ' ->';

    //Log
    console.log(`${date} ${message.guild.name} -> ${message.author.username}: ${message.content}`)

    let prefix = botConfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);


//Commands Handler
//console.log("Reading Commands Handler...")
let commandfile = bot.commands.get(messageArray[0].slice(prefix.length));
if(commandfile) commandfile.run(bot,message,args);

//Commands
if(cmd === `${prefix}ping`){
    console.log(`${message.author.user} used !ping on ${message.guild.name}`)
    return message.channel.send("Pong!");
}
if(cmd === `${prefix}Salut`){
    return message.channel.send(`Hello ${message.author}!`)
}
if(cmd === `${prefix}DM`){
    return message.author.send('Pog U!')
}

});

if (process.env.NODE_ENV === 'production'){
    bot.login(botConfig.token) 
}else{
    bot.login(botConfig.tokenDev) 
};
