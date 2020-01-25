var botConfig = require('./botconfig.json');
var discord = require("discord.js");
var fs = require('fs');
var util = require('util');
var Canvas = require('canvas');
var pjson = require('./package.json');
var util = require('util');
var os = require('os');
var osu = require('os-utils')


    //Mongodb
    var mongoose = require("mongoose");
    
    let dbusername = botConfig.dbuser;
    let dbpasswd = botConfig.dbpass;
    mongoose.connect('mongodb+srv://' + dbusername + ':'+ dbpasswd +'@yukiko-pcvs8.mongodb.net/discordbot?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    var Users = require('./model/xp.js')
    console.log("Connected to YukikoDB!");

var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;
require('./music/server');

console.log = function(d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
  };
console.log("Initializing bot...")

require('dotenv').config();
console.log("Initializing bot in " + process.env.NODE_ENV + " Environement.")

//DiscordBot
console.log('Initializing Discord API');
var bot = new discord.Client({disableEveryone: true});
bot.commands = new discord.Collection();
bot.on('disconnect', () => console.log("\x1b[32mAsthriona Mod Bot\x1b[0m is Disconected... Waiting for reconnect"));
bot.on('reconnecting', () => console.log("\x1b[32mAsthriona Mod Bot\x1b[0m  is reconnecting."))
bot.on('ready', () =>console.log(`\x1b[32mAsthriona Mod Bot\x1b[0m is now started and running in \x1b[31m${process.env.NODE_ENV} \x1b[0menvironement!`));

bot.on ("guildMemberAdd", async member => {
    const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if(!channel){
        const channel = member.guild.channels.find(channel => channel.name === "bienvenue");
        return await WelcomeCad(member, channel);
    } else {
        return await WelcomeCad(member, channel);
    }
});

bot.on ("guildMemberRemove", member => {
    const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if(!channel) if(!channel){
        const channel = member.guild.channels.find(channel => channel.name === "bienvenue");
        channel.send(`${member} Viens de quitter le serveur! https://cdn.asthriona.com/sad.gif`);
    } else {
        channel.send(`${member} Viens de quitter le serveur! https://cdn.asthriona.com/sad.gif`);
    }
});

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
        require('./twitch.js');
        bot.user.setStatus('online');
        bot.user.setPresence({
            game: {
                name: 'TRP | Mara Fox | SOB',
                type: 'STREAMING',
                url: 'https://www.twitch.tv/',
                smallImage: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_jacquirenee-1280x720.jpg',
                largeImageURL:"https://static-cdn.jtvnw.net/previews-ttv/live_user_jacquirenee-1280x720.jpg"
            }
        })
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
    let args = messageArray.slice(1);
    let cmd = messageArray[0];

    //XP System
    //DA NEW XP SYSTEM 2.0
    let xpAdd = Math.floor(Math.random()*7) + 8;
    console.log(xpAdd)
    let messageAdd = +1


    Users.findOne({
        did: message.author.id,
        serverID: message.guild.id
    }, (err, users) =>{
        if(err) console.log(err);
        if(!users){
            var newUsers = new Users({
                did: message.author.id,
                username: message.author.username,
                serverID: message.guild.id,
                xp: xpAdd,
                level: 0,
                message: messageAdd,
                avatarURL: message.author.displayAvatarURL
            })

            newUsers.save().catch(error => console.log(error));
        }else{
            users.xp = users.xp + xpAdd;
            users.message = users.message + messageAdd
            users.username = message.author.username
            users.avatarURL = message.author.displayAvatarURL

            let nxtlvl = 300*Math.pow(2, users.level)
            if(users.xp >= nxtlvl){
                users.level = users.level +1

                //lvl up embed
                let lvlupEmbed = new discord.RichEmbed()
                .setTitle(message.author.username + " is now level " + users.level)
                .setThumbnail(message.author.displayAvatarURL)
                .addField("You are now level: ", users.level, true)
                .addField("Xp to level up: ", 300*Math.pow(2, users.level), true)
                .addField("you have: ", + users.xp + " xp", true)
                .setFooter("Powered by Yukiko Bot", bot.user.displayAvatarURL)
                message.channel.send(lvlupEmbed);
                
            }
            users.save().catch(error => console.log(error));
        }
    });

    //add Username
    Users.aggregate([{$addfields: {username: ""}}])
//Force mute.
if(message.member.roles.find(r => r.name === "muted")){
    message.delete();
    message.author.send("You are muted on " + message.guild.name)
};

//Commands Handler
//console.log("Reading Commands Handler...")
let commandfile = bot.commands.get(messageArray[0].slice(prefix.length));
if(commandfile) commandfile.run(bot,message,args);

//Commands
if(cmd === `${prefix}ping`){
    console.log(`${message.author.user} used !ping on ${message.guild.name}`)
    return message.channel.send("Pong! ");
}
if(cmd === `${prefix}lb`){
    return message.channel.send(` Voici le liens du Leaderboard \n http://yukiko.nishikino.me/${message.guild.id}`)
}
if(cmd === `${prefix}Salut`){
    return message.channel.send(`Hello ${message.author}!`)
}
if(cmd === `${prefix}DM`){
    return message.author.send('Pog U!')
}
if(cmd == `${prefix}leaderboard`){
    Users.find({
        serverID: message.guild.id
    }, function(err, docs) {
        if (err) console.log(err);
        message.reply(docs);
        })
        .sort([["xp", 1], ["xp", "descending"]]);
}
//botinfo
if(cmd === `${prefix}info`){
    let bicon = bot.user.displayAvatarURL;
    let botembed = new discord.RichEmbed()
    .setThumbnail(bicon)
    .setTitle("A propos de ce bot")
    .setDescription("this bot can make your cat explode, Mount the DOGO, burn your egg and clean your house. (but not your room. we tested all of this.(RIP my cat...))")
    .setColor("#800080")
    .addField("Bot name:", bot.user.username, true)
    .addField("Version:", `${pjson.version } ${pjson.codeName}`, true)
    .addField("Developped by:", "Asthriona", true)
    .addField("Developper Website", "https://Asthriona.com", true)
    .addField("Created on", bot.user.createdAt, true)
    .addField("On the server since:", bot.user.joinedAt, true)
    .addField("Git:", "https://github.com/Asthriona/AsthriModBot", true)
    .addField('Site: ', 'http://yukiko.nishikino.me/', true)
    .addField("Server Using this server: ", bot.guilds.size, true)
    //.setThumbnail(bicon);
    return message.channel.send(botembed)
}
//Client join
//bot.on('guildMemberAdd', async member => {
//	let channel = message.guild.channels.find('name', "general");
//	if (!channel) return;
//  await welcomeText(cmd, prefix, message);
//});
//Console Chatter
    let y = process.openStdin()
    y.addListener("data", res => {
        let x = res.toString().trim().split(/ +/g)
        bot.channels.get("638455806144151562").send(x.join(" "));
    });
});


if (process.env.NODE_ENV === 'production'){
    bot.login(botConfig.token) 
    console.log("login on discord...")
}else{
    bot.login(botConfig.tokenDev) 
    console.log("login on discord...")
};
async function WelcomeCad(member, channel) {
    var canvas = Canvas.createCanvas(934, 282);
    var ctx = canvas.getContext('2d');
    var background = await Canvas.loadImage('https://cdn.asthriona.com/discordbotCard.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(260, 80, 650, 130);
    ctx.stroke();
    ctx.font = '60px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(member.user.username, 280, 141);
    ctx.font = '50px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText("Welcome on " + member.guild.name, 280, 185);
    var avatar = await Canvas.loadImage(member.user.displayAvatarURL);
    ctx.beginPath();
    ctx.arc(140, 128, 110, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 15, 256, 256);
    var attachment = new discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
    channel.send(`bienvenue sur  le serveur ${member.guild.name}, ${member}! Pense a aller accepter le <#639155918696874004> pour avoirs acces au serveur complet!`);
    channel.send(attachment)
}
