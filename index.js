/*  
/   Even if Updated this code is still very old, and use some old Yukiko 1.0 code, I didnt really knew what I was doing back then.
/   expect a lot of changement whenever I found the will to update it, for now its more a practical update to get it to work with Djs 12. 
/   I also added Erela for Youtube so you have something better to work with. but you need an external server (Lavalink) to get it to work.
/   I may switch to a dockerized version when i've learned it so one command install with mongo and Lavalink.
/   You can find Lavalink here: https://github.com/freyacodes/Lavalink-Client
/   -Asthriona
*/

var { Client, MessageEmbed, Collection, Attachment, Utils, MessageCollector } = require('discord.js');
var Config = require('./botconfig.json');
var fs = require("fs");
var Canvas = require('canvas');
var mongoose = require("mongoose");
var {getMember} = require("./function")
const { Manager } = require("erela.js");

var bot = new Client({
    disableEveryone: true
});

//YukikoDB
mongoose.connect(Config.dbLink, {
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
var Cards = require('./model/card.js');

// Command Handler
bot.Commands = new Collection();
bot.Aliases = new Collection();
bot.Categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
})

// Config Music bot
bot.manager = new Manager({
	nodes: [{
		host: Config.lavaHost,
		port: 2333,
		password: Config.lavaPasswd,
		secure: false,
	} ],
	autoPlay: true,
	send(id, payload) {
		const guild = bot.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	},
})
	.on('nodeConnect', () => console.log('Connected to Lavalink'))
	.on('nodeError', (node, error) => console.log(`Node error: ${error.message}`))
	.on('trackStart', (player, track) => {
		if (!player.voiceChannel) {
			bot.channels.cache.get(player.textChannel).send('Seems like I\'ve been disconnected from the voice channel. I\'m destroying the player now.');
			return player.destroy();
		}
		const nowPlayingEmbed = new MessageEmbed()()
			.setAuthor('Now playing', bot.user.displayAvatarURL())
			.setDescription(`Now playing 『${track.title}』 requested by ${track.requester}`)
			.setImage(track.displayThumbnail('mqdefault'))
			.setTimestamp()
			.setFooter(bot.user.username, bot.user.displayAvatarURL());
		bot.channels.cache.get(player.textChannel).send(nowPlayingEmbed);
		// this.client.dogstats.increment("Yukiko.Voice", 1)
	})
	.on('queueEnd', (player) => {
		client.dogstats.increment('Yukiko.stream', -1);
		client.channels.cache.get(player.textChannel).send('Queue has ended.');
		this.client.dogstats.decrements('Yukiko.Voice', 1);
		player.destroy();
	});


// Event
// Disconnecting/reconnecting discord gateway
bot.on('disconnect', () => console.log("\x1b[32m${bot.user.username}\x1b[0m is Disconected... Waiting for reconnect"));
bot.on('reconnecting', () => console.log("\x1b[32m${bot.user.username}\x1b[0m  is reconnecting."))

// New member event
bot.on("guildMemberAdd", async member => {
    const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if (!channel) {
        const channel = member.guild.channels.find(channel => channel.name === "bienvenue");
        return await WelcomeCad(member, channel);
    } else {
        return await WelcomeCad(member, channel);
    }
});

// Member leave event
bot.on("guildMemberRemove", async member => {
    const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if (!channel) {
        const channel = member.guild.channels.find(channel => channel.name === "bienvenue");
        return await farewell(member, channel);
    } else {
        return await farewell(member, channel);
    }
});

// Presence settings
console.log('Setting bot presence...')
let statues = ["Persona 4 Golden", "Twitter: @YukikoApp", "W/ @Asthriona's Feelings", "w/ Rise", "in my castle", "Bummer! an error happened!"]
bot.on('ready', () => {
    setInterval(function() {
        let status = statues[Math.floor(Math.random()*statues.length)];
        bot.user.setStatus('dnd');
        bot.user.setPresence({game: { name: status, type: "PLAYING"}
    })
}, 600000)
console.log('waiting for ready event...')
console.log(`\x1b[32m${bot.user.username}\x1b[0m is now started and running in \x1b[31m${process.env.NODE_ENV} \x1b[0menvironement!`);
});
bot.once('ready', ()=>{
    console.log('Init Player manager...')
    bot.manager.init(bot.user.id);
})
//RAW (for erela.js)

bot.on("raw", (d) => bot.manager.updateVoiceState(d));

//XP On message

bot.on('message', async message => {
    //XP System
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);
    //DA NEW XP SYSTEM 2.0
    let xpAdd = Math.ceil(Math.random() * 15);
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
                avatarURL: message.author.displayAvatarURL()
            })

            newUsers.save().catch(error => console.log(error));
        } else {
            users.xp = users.xp + xpAdd;
            users.message = users.message + messageAdd
            users.username = message.author.username
            users.avatarURL = message.author.displayAvatarURL()

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
                link: "https://cdn.yukiko.app/Cards/DefaultYukikocard.jpg"
            })
            newCards.save().catch(error => console.log(error));
        }
    })


})

//Message Event

bot.on('message', async message => {
    if(message.author.bot) return;

    //Todo Replace with MS or smth
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var hs = String(date.getHours()).padStart(2, '0');
    var min = String(date.getMinutes()).padStart(2, '0');
    var sec = String(date.getSeconds()).padStart(2, '0');
    var ms = String(date.getMilliseconds()).padStart(2);
    date = hs + ':' + min + ':' + sec + ':' + ms + ' -- ' + mm + '/' + dd + '/' + yyyy + ' ->';

    //Log
    if (message.channel.type === "dm") return console.log(`${date} DM from -> ${message.author.username}: ${message.content}`);
    console.log(`${date} ${message.guild.name} -> ${message.author.username}: ${message.content}`)

    //Setup Prefix and args
    let prefix = Config.prefix;
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);
    let cmd = messageArray[0];

    let filter = m => !m.author.bot;
    if(!prefix) return

    //Force mute.
    if (message.member.roles.cache.find(r => r.name === "muted")) {
        message.delete();
        message.author.send("You are muted on " + message.guild.name)
    };
    //Commands Handler
    let commandfile = bot.Commands.get(messageArray[0].slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args, cmd);
})
bot.login(Config.token)

//Cards Generation

// Level Up card
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
    Cards.findOne({
        did: message.author.id
    }, async (err, cards)=>{
        var cardbg = cards.link
    var member = getMember(message);
    var background = await Canvas.loadImage(cardbg);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    //Draw rectangle
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(260, 80, 650, 160);
    ctx.closePath();
    ctx.stroke();
    //show Username
    ctx.font = applyText(canvas, member.displayName);
    ctx.fillStyle = '#fff';
    ctx.fillText(member.displayName + " Level up!", 280, 136);
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
})
}

// Welcome Card
async function WelcomeCad(member, channel) {
    const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
        let fontSize = 70;
        do {
            ctx.font = `${fontSize -= 10}px sans-serif`;
        } while (ctx.measureText(text).width > canvas.width - 300);
        return ctx.font;
    };
Cards.findOne({
    did: member.user.id
}, async (err, cards)=>{
    var canvas = Canvas.createCanvas(934, 282);
    var ctx = canvas.getContext('2d');
    var cardbg = cards.link
    var background = await Canvas.loadImage(cardbg);
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
    var avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: "jpg"}));
    ctx.beginPath();
    ctx.arc(140, 128, 110, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 15, 256, 256);
    var attachment = new Attachment(canvas.toBuffer(), 'welcome-image.png');
    channel.send(`Welcome ${member.user}`, attachment)
});
}
// Farewell card
async function farewell(member, channel) {
    const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
        let fontSize = 70;
        do {
            ctx.font = `${fontSize -= 10}px sans-serif`;
        } while (ctx.measureText(text).width > canvas.width - 300);
        return ctx.font;
    };
    Cards.findOne({
        did: member.user.id
    }, async (err, cards) =>{
    var cardbg = cards.link
    var background = await Canvas.loadImage(cardbg);
    var canvas = Canvas.createCanvas(934, 282);
    var ctx = canvas.getContext('2d');
    var cardsbg = cards.link
    var background = await Canvas.loadImage(cardsbg);
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
    var avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: "jpg"}));
    ctx.beginPath();
    ctx.arc(140, 128, 110, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 15, 256, 256);
    var attachment = new Attachment(canvas.toBuffer(), 'farewell-image.png');
    channel.send(attachment)
})
};
// Get Avatar
async function GetAvatar(message, ctx) {
    var avatar = await Canvas.loadImage(message.author.displayAvatarURL({format: "jpg"}));
    ctx.beginPath();
    ctx.arc(125, 140, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 40, 200, 200);
}