var { Client, RichEmbed, Collection, Attachment, Utils } = require('discord.js');
var botConfig = require('./botconfig.json');
var fs = require("fs");
var Canvas = require('canvas');
var mongoose = require("mongoose");
var ytdl = require("ytdl-core");
var YouTube = require("simple-youtube-api");

var bot = new Client({
    disableEveryone: true
});

//YukikoDB
mongoose.connect(botConfig.dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => handleError(error));
mongoose.connection.on('error', function(e) {
    console.log('YukikoDB: Can not connect Error: ' + e);
    var {bot} = new discord.Client({ disableEveryone: true });
    bot.commands = new discord.Collection();
    process.exit();
});
mongoose.connection.once('open', function(d) { 
    console.log("\x1b[32mYukikoDB:\x1b[0m connected to \x1b[31m" + mongoose.connection.host + " \x1b[0m");
})
var Users = require('./model/xp.js')

require('./TempMusic/music.js');

bot.commands = new Collection();
bot.aliases = new Collection();
bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
})

bot.on('disconnect', () => console.log("\x1b[32m${bot.user.username}\x1b[0m is Disconected... Waiting for reconnect"));
bot.on('reconnecting', () => console.log("\x1b[32m${bot.user.username}\x1b[0m  is reconnecting."))

bot.on("ready", () => {
    console.log(`\x1b[32m${bot.user.username}\x1b[0m is now started and running in \x1b[31m${process.env.NODE_ENV} \x1b[0menvironement!`);
    bot.user.setPresence({
        game:{
            name: "coding 2.0!",
            type: "WATCHING"
        }
    })
})

// Welcome and stuff
bot.on("guildMemberAdd", async member => {
    const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if (!channel) {
        const channel = member.guild.channels.find(channel => channel.name === "bienvenue");
        return await WelcomeCad(member, channel);
    } else {
        return await WelcomeCad(member, channel);
    }
});

bot.on("guildMemberRemove", member => {
    const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if (!channel) {
        const channel = member.guild.channels.find(channel => channel.name === "bienvenue");
        channel.send(`${member} Viens de quitter le serveur! https://cdn.asthriona.com/sad.gif`);
    } else {
        channel.send(`${member} Viens de quitter le serveur! https://cdn.asthriona.com/sad.gif`);
    }
});
bot.on("message", async message =>{
            //XP System
    //DA NEW XP SYSTEM 2.0
    let xpAdd = Math.floor(Math.random() * 7) + 8;
    let messageAdd = +1


    Users.findOne({
        did: message.author.id,
        serverID: message.guild.id
    }, (err, users) => {
        if (err) console.log(err);
        if (!users) {
            var newUsers = new Users({
                did: message.author.id,
                username: message.author.username,
                serverID: message.guild.id,
                xp: xpAdd,
                level: 0,
                message: messageAdd,
                warns: 0,
                avatarURL: message.author.displayAvatarURL
            })

            newUsers.save().catch(error => console.log(error));
        } else {
            users.xp = users.xp + xpAdd;
            users.message = users.message + messageAdd
            users.username = message.author.username
            users.avatarURL = message.author.displayAvatarURL

            let nxtlvl = 300 * Math.pow(2, users.level)
            if (users.xp >= nxtlvl) {
                users.level = users.level + 1

                //lvl up image              
                var sendimg = async function sendimg() {
                    await lvlupimg(message, users);

                }
            }
            users.save().catch(error => console.log(error));
        }
    });
});

bot.on("message", async message =>{
    //Logging
    console.log(`${message.guild.name} -> ${message.author.username}: ${message.content}`)
    
    let prefix = botConfig.prefix;
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!message.content.startsWith(prefix)) return;
    if(!message.member) message.member = await message.guild.fetchMember(message)
    
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    if(cmd === 0) return;
    let command = bot.commands.get(cmd);
    if(!command) command = bot.commands.get(bot.aliases.get(cmd))
    if(command) command.run(bot, message, args, RichEmbed)

})

if (process.env.NODE_ENV === 'production') {
    bot.login(botConfig.token)
    console.log("login on discord...")
} else {
    bot.login(botConfig.tokenDev)
    console.log("login on discord...")
};

//Cards Generation

async function lvlupimg(message, users) {
    const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
        let fontSize = 70;
        do {
            ctx.font = `${fontSize -= 10}px sans-serif`;
        } while (ctx.measureText(text).width > canvas.width - 300);
        return ctx.font;
    };
    var canvas = Canvas.createCanvas(934, 282);
    var ctx = canvas.getContext('2d');
    var background = await Canvas.loadImage('https://cdn.asthriona.com/discordbotCard.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    //Draw rectangle
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(260, 80, 650, 160);
    ctx.closePath();
    ctx.stroke();
    //show Username
    ctx.font = applyText(canvas, message.author.username);
    ctx.fillStyle = '#fff';
    ctx.fillText(message.author.username + " Level up!", 280, 136);
    //Show Level & XP
    let nxtlvl = 300 * Math.pow(2, users.level);
    var xpleft = nxtlvl - users.xp;
    ctx.font = '40px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText("You are level now " + users.level + " - " + users.xp + " XP", 280, 180);
    //xp Left
    ctx.font = '50px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText("Next Level in " + xpleft + " xp", 280, 225);
    //Get avatar
    await GetAvatar(message, ctx);
    //put image together and send it
    var lvlupimg = new Attachment(canvas.toBuffer(), 'lvlup-image.png');
    message.channel.send(lvlupimg);
}

async function WelcomeCad(member, channel) {
    const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
        let fontSize = 70;
        do {
            ctx.font = `${fontSize -= 10}px sans-serif`;
        } while (ctx.measureText(text).width > canvas.width - 300);
        return ctx.font;
    };

    var canvas = Canvas.createCanvas(934, 282);
    var ctx = canvas.getContext('2d');
    var background = await Canvas.loadImage('https://cdn.asthriona.com/discordbotCard.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(260, 80, 650, 130);
    ctx.stroke();
    //get username 
    ctx.font =  applyText(canvas, member.user.username);
    ctx.fillStyle = '#fff';
    ctx.fillText(member.user.username, 280, 141);
    //Get guild name
    ctx.font = applyText(canvas, member.guild.name);
    ctx.fillStyle = '#fff';
    ctx.fillText("Welcome on " + member.guild.name, 280, 185);
    //Get avatar
    var avatar = await Canvas.loadImage(member.user.displayAvatarURL);
    ctx.beginPath();
    ctx.arc(140, 128, 110, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 15, 256, 256);
    var attachment = new discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
    channel.send(attachment)
}
async function GetAvatar(message, ctx) {
    var avatar = await Canvas.loadImage(message.author.displayAvatarURL);
    ctx.beginPath();
    ctx.arc(125, 140, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 40, 200, 200);
}