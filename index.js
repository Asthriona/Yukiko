/*  
/   Even if Updated this code is still very old, and use some old Yukiko 1.0 code, I didnt really knew what I was doing back then.
/   expect a lot of changement whenever I found the will to update it, for now its more a practical update to get it to work with Djs 12. 
/   I also added Erela for Youtube so you have something better to work with. but you need an external server (Lavalink) to get it to work.
/   I may switch to a dockerized version when i've learned it so one command install with mongo and Lavalink.
/   You can find Lavalink here: https://github.com/freyacodes/Lavalink-Client
/   -Asthriona
*/

var { Client, MessageEmbed, Collection } = require('discord.js');
var Config = require('./botconfig.json');
var fs = require("fs");
var mongoose = require("mongoose");
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
    var { bot } = new discord.Client({ disableMentions: 'everyone' });
    bot.commands = new discord.Collection();
    process.exit();
});
mongoose.connection.once('open', function (d) {
    console.log("\x1b[32mYukikoDB:\x1b[0m connected to \x1b[31m" + mongoose.connection.host + " \x1b[0m");
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
		const nowPlayingEmbed = new MessageEmbed()
			.setAuthor('Now playing', bot.user.displayAvatarURL())
			.setDescription(`Now playing 『${track.title}』 requested by ${track.requester}`)
			.setImage(track.displayThumbnail('mqdefault'))
			.setTimestamp()
			.setFooter(bot.user.username, bot.user.displayAvatarURL());
		bot.channels.cache.get(player.textChannel).send(nowPlayingEmbed);
	})
	.on('queueEnd', (player) => {
		bot.channels.cache.get(player.textChannel).send('Queue has ended.');
		player.destroy();
	});
    bot.on("raw", (d) => bot.manager.updateVoiceState(d));

// Command Handler
bot.Commands = new Collection();
bot.Aliases = new Collection();
bot.Categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
})

// Event Handler
const EventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
for (const file of EventFiles){
    const event = require(`./events/${file}`);
    if(event.once){
        bot.once(event.name, (...args) => event.execute(...args, bot));
    }else{ 
        bot.on(event.name, (...args) => event.execute(...args, bot));
    }
}

bot.login(Config.token);