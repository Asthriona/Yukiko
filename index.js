var { Client, RichEmbed, Collection, Attachment, Utils, MessageCollector } = require('discord.js');
var botConfig = require('./botconfig.json');
var fs = require("fs");
var Canvas = require('canvas');
var mongoose = require("mongoose");

var bot = new Client({
    disableEveryone: true
});

var active = new Map();

//YukikoDB
mongoose.connect(botConfig.dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => handleError(error));
mongoose.connection.on('error', function (e) {
    console.log('YukikoDB: Can not connect Error: ' + e);
    var { bot } = new discord.Client({ disableEveryone: true });
    bot.commands = new discord.Collection();
    process.exit();
});
mongoose.connection.once('open', function (d) {
    console.log("\x1b[32mYukikoDB:\x1b[0m connected to \x1b[31m" + mongoose.connection.host + " \x1b[0m");
})
var Users = require('./model/xp.js')
var Cards = require('./model/card.js')

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
        game: {
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

bot.on("guildMemberRemove", async member => {
    const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if (!channel) {
        const channel = member.guild.channels.find(channel => channel.name === "bienvenue");
        return await farewell(member, channel);
    } else {
        return await farewell(member, channel);
        //channel.send(`${member} Viens de quitter le serveur! https://cdn.asthriona.com/sad.gif`);
    }
});
//commands Handler
console.log("Initializing commands handler");
fs.readdir("./commands", (err, files) => {
    if(err) console.log("Woops! Somthing wrong sucessfully happen! " + (err));
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("Woops! Error sucessfully Happen! Can't find commands files!");
        return;
    }
    console.log("Loadings files...");
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`\x1b[35m${f} \x1b[0mLoaded!`);
        bot.commands.set(props.help.name, props);
    });
    console.log("Files Loaded, Moving on!")
});
console.log('Setting bot presence...')

bot.on('ready', () => {
    bot.user.setStatus('online');
    bot.user.setPresence({
        game: {
            name: 'Persona 4 Golden',
            type: "PLAYING",
        }
    })
});

bot.on('message', async message => {
    //XP System
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);
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
                sendimg()
            }
            users.save().catch(error => console.log(error));
        }
    });

    //Add default cards to new users
    Cards.findOne({
        did: message.author.id
    }, (err, cards) => {
        if (err) console.log(err)
        if (!cards) {
            var newCards = new Cards({
                did: message.author.id,
                link: "https://cdn.asthriona.com/DefaultYukikocard.jpg"
            })
            newCards.save().catch(error => console.log(error));
        }
    })


})

bot.on('message', async message => {
    if (message.author.bot) return;

    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var hs = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var ms = date.getMilliseconds();
    date = hs + ':' + min + ':' + sec + ':' + ms + ' -- ' + mm + '/' + dd + '/' + yyyy + ' ->';

    //Log
    if (message.channel.type === "dm") return console.log(`${date} DM from -> ${message.author.username}: ${message.content}`);
    console.log(`${date} ${message.guild.name} -> ${message.author.username}: ${message.content}`)


    let prefix = botConfig.prefix;
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);
    let cmd = messageArray[0];

    let filter = m => !m.author.bot;

    //thinggy for music bot
    var options = {
        active: active
    }

    if (message.author.id === "186195458182479874" || "635422418424299521") {
        if (cmd === `${prefix}leave`) {
            message.channel.send("i'm out :)")
            return message.guild.leave();
        }
    }

    //Force mute.
    if (message.member.roles.find(r => r.name === "muted")) {
        message.delete();
        message.author.send("You are muted on " + message.guild.name)
    };
    //Commands Handler
    let commandfile = bot.commands.get(messageArray[0].slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args, options);
})
bot.login(botConfig.token)

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
    var background = await Canvas.loadImage('https://cdn.asthriona.com/DefaultYukikocard.jpg');
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
    var background = await Canvas.loadImage('https://cdn.asthriona.com/DefaultYukikocard.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(260, 80, 650, 130);
    ctx.stroke();
    //get username 
    ctx.font = applyText(canvas, member.user.username);
    ctx.fillStyle = '#fff';
    ctx.fillText(member.user.username, 280, 141);
    //Get guild name
    ctx.font = applyText(canvas, member.guild.name);
    ctx.fillStyle = '#fff';
    ctx.fillText("Joined the server! ", 280, 195);
    //Get avatar
    var avatar = await Canvas.loadImage(member.user.displayAvatarURL);
    ctx.beginPath();
    ctx.arc(140, 128, 110, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 15, 256, 256);
    var attachment = new Attachment(canvas.toBuffer(), 'welcome-image.png');
    channel.send(`Welcome ${member.user}`, attachment)
}

async function farewell(member, channel) {
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
    var background = await Canvas.loadImage('https://cdn.asthriona.com/YukikoLeft.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(260, 80, 650, 130);
    ctx.stroke();
    //get username 
    ctx.font = applyText(canvas, member.user.username);
    ctx.fillStyle = '#fff';
    ctx.fillText(member.user.username, 280, 141);
    //Get guild name
    ctx.font = applyText(canvas, member.guild.name);
    ctx.fillStyle = '#fff';
    ctx.fillText("Left the server! ", 280, 195);
    //Get avatar
    var avatar = await Canvas.loadImage(member.user.displayAvatarURL);
    ctx.beginPath();
    ctx.arc(140, 128, 110, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 15, 256, 256);
    var attachment = new Attachment(canvas.toBuffer(), 'farewell-image.png');
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