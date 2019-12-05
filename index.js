var botConfig = require('./botconfig.json');
var discord = require("discord.js");
var fs = require('fs');
var util = require('util');
//var http = require('http');
var Canvas = require('canvas');
var pjson = require('./package.json');
var xp = require('./xp.json')
var util = require('util');

let cooldown = new Set();
let cdseconds = 60
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
//console.log("Initializing WebServer...")
//require("./web/server")


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
    bot.on('ready', () =>{
        console.log(`\x1b[32mAsthriona Mod Bot\x1b[0m is now started and running in \x1b[31m${process.env.NODE_ENV} \x1b[0menvironement!`)
    })
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
        bot.user.setStatus('online');
        bot.user.setPresence({
            game: {
                name: 'TRP | Mara Fox | SOB',
                type: 'STREAMING',
                url: 'https://www.twitch.tv/jacquirenee',
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
    let xpAdd = Math.floor(Math.random()*7) + 8;
    if(!xp[message.author.id]){
        xp[message.author.id] = {
            xp: 0,
            level: -1
        };
    }
    let curxp = xp[message.author.id].xp;
    let curLvl = xp[message.author.id].level;
    let nxtLvl = xp[message.author.id].level * 300;
    xp[message.author.id].xp = curxp + xpAdd;
    if(nxtLvl <= xp[message.author.id].xp){
    xp[message.author.id].level = curLvl + 1;
    //await lvlupIMG(message);
    }

    fs.writeFile("./xp.json", JSON.stringify(xp), err =>{
        if(err){
            console.log(err)
            message.channel.send("An Error sucessfully happend with the XP system <@[186195458182479874]>")
        }
    });
    console.log(message.author.username + " is Level " + xp[message.author.id].level + " currently have " + xp[message.author.id].xp + " XP");


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
    .addField("Avatar by:", "Kimberly Senpai")
    .setThumbnail('https://cdn.asthriona.com/986868.png')
    //.setThumbnail(bicon);
    return message.channel.send(botembed)
}
//Client join
//bot.on('guildMemberAdd', async member => {
//	let channel = message.guild.channels.find('name', "general");
//	if (!channel) return;
    await welcomeText(cmd, prefix, message);

//Console Chatter
let y = process.openStdin()
y.addListener("data", res => {
    let x = res.toString().trim().split(/ +/g)
    bot.channels.get("638455806144151562").send(x.join(" "));
})
});

if (process.env.NODE_ENV === 'production'){
    bot.login(botConfig.token) 
    console.log("login on discord...")
}else{
    bot.login(botConfig.tokenDev) 
    console.log("login on discord...")
};
async function lvlupIMG(message) {
    var canvas = Canvas.createCanvas(934, 282);
    var ctx = canvas.getContext('2d');
    var background = await Canvas.loadImage('https://cdn.asthriona.com/abeeb960-e829-443f-8d18-b6636b01a1ab.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(260, 80, 650, 130);
    ctx.stroke();
    ctx.font = '60px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(message.author.username, 280, 141);
    ctx.font = '50px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText("You are now level " + xp[message.author.id].level + " !", 280, 185);
    var avatar = await Canvas.loadImage(message.author.displayAvatarURL);
    ctx.beginPath();
    ctx.arc(140, 128, 110, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 15, 256, 256);
    var lvlupimg = new discord.Attachment(canvas.toBuffer(), 'lvlup-image.png');
    let lvlchan = message.guild.channels.find('name', "wall-of-fame");
    lvlchan.send(message.author + " You Leveled up!", lvlupimg);
}

//Image generation test
async function welcomeText(cmd, prefix, message) {
    if (cmd === `${prefix}test`) {
        var canvas = Canvas.createCanvas(934, 282);
        var ctx = canvas.getContext('2d');
        var background = await Canvas.loadImage('https://cdn.asthriona.com/abeeb960-e829-443f-8d18-b6636b01a1ab.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(260, 80, 650, 130);
        ctx.stroke();
        ctx.font = '60px sans-serif';
        ctx.fillStyle = '#fff';
        //ctx.fillText(member.displayName, 280, 141);
        ctx.fillText(message.author.username, 280, 141);
        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText("Welcome on " + message.guild.name, 280, 185);
        //var avatar = await Canvas.loadImage(member.user.displayAvatarURL);
        var avatar = await Canvas.loadImage(message.author.displayAvatarURL);
        ctx.beginPath();
        ctx.arc(140, 128, 110, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 25, 15, 256, 256);
        var attachment = new discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
        message.channel.send(attachment);
    }
    ;
}