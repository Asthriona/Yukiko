var botConfig = require('./botconfig.json');
var discord = require("discord.js");
var fs = require('fs');
var util = require('util');
var http = require('http');
var pjson = require('./package.json');

var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;
//Import music module
require('./music/server')


console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

console.log("Initializing bot...")

require('dotenv').config();
console.log("Initializing bot in " + process.env.NODE_ENV + " Environement.")

//WebServer For ping monitoring
console.log("Initializing WebServer...")
require("./web/server")


//DiscordBot
console.log('Initializing Discord API');
var bot = new discord.Client({disableEveryone: true});
bot.commands = new discord.Collection();

//commands Handler
console.log("Initializing commands handler");
fs.readdir("./commands", (err, files) => {
    if(err) console.log("Woops! Somthing wrong sucessfully happen! " + (err));

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
    if (process.env.NODE_ENV == "production") {
        bot.user.setStatus('online');
        bot.user.setPresence({
            game: {
                name: 'Asthriona.com',
                type: "WATCHING",
            }
        })
    } else {
        bot.user.setStatus('dnd');
        bot.user.setPresence({
            game: {
                name: 'Developement',
                type: "WATCHING",
            }
        })
    }
    });
    if (process.env.NODE_ENV == "production") {
        var channelprod = bot.channels.get(botConfig.channelprod);
        //let bicon = bot.user.displayAvatarURL;
        let versionembed = new discord.RichEmbed()
        .setColor("#800080")
        .setAuthor('Bot Online!', 'https://cdn.discordapp.com/emojis/515665388495962112.png', 'https://github.com/Asthriona')
        .setDescription("Le bot viens juste de démaré, il est maintenant fonctionel et a jour!")
        .addField("Bot Status:", "Ready!")
        .addField("Version:", pjson.version)
        .addField("Version name: ", pjson.codeName)
        .addField("Environement", `${process.env.NODE_ENV}`)
        .addField('ChangsLogs:', 'https://sh.nishikino.me/e0c79')
        .setFooter(`Hosted by Sirius Media Group`, `https://cdn.asthriona.com/986868.png`, 'https://TheWall.ovh')
        //.setThumbnail(bicon);
        return channelprod.sendMessage(versionembed);  
    }

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
    let args = messageArray.slice(1);
    let cmd = messageArray[0];


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
//botinfo
if(cmd === `${prefix}info`){
    //let bicon = bot.user.displayAvatarURL;
    let botembed = new discord.RichEmbed()
    .setThumbnail('https://cdn.discordapp.com/icons/647689682381045772/ee4fb06d56cffabf4e7e2851ee5836cc.jpg')
    .setTitle("A propos de ce bot")
    .setDescription("this bot can make your cat explode, Mount the DOGO, burn your egg and clean your house. (but not your room. we tested all of this.(RIP my cat...))")
    .setColor("#800080")
    .addField("Nom du bot", bot.user.username)
    .addField("Version:", `${pjson.version } ${pjson.codeName}`)
    .addField("Developper par", "Asthriona")
    .addField("Developper Website", "https://Asthriona.com")
    .addField("Crée le", bot.user.createdAt)
    //.addField("Sur le serveur depuis:", bot.user.joinedAt)
    .addField("Git:", "https://github.com/Asthriona/AsthriModBot")
    .addField("Nombre de serveur utilisant ce bot: ", bot.guilds.size)
    .setThumbnail('https://cdn.asthriona.com/986868.png')
    //.setThumbnail(bicon);
    return message.channel.send(botembed)
}
//Console Chatter
let y = process.openStdin()
y.addListener("data", res => {
    let x = res.toString().trim().split(/ +/g)
    bot.channels.get("638455806144151562").send(x.join(" "));
})
});

if (process.env.NODE_ENV === 'production'){
    bot.login(botConfig.token) 
}else{
    bot.login(botConfig.tokenDev) 
};
