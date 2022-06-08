/*
/   Morning! Time to get Dirty again. I dont have the will to create a whole new client for this, but as you are still starring the project I will update it
/ 	for Discord.js v13.
/ 	I mean so it start. Might add slash commands support later.
/	if any of you wanna help update it, feel free to open a PR :)
/	Rise (https://github.com/Heazher) or myself will be more than happy to review it!
/	- Asthriona
*/

/*
/ Okay time to add the slash commands I guess...
/ I wanted to test github codespace anyway soooo...
*/

const { Client, MessageEmbed, Collection } = require("discord.js");
const Config = require("./botconfig.json");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { Manager } = require("erela.js");

const bot = new Client({
	disableMentions: "everyone",
	partials: ["USER", "MESSAGE", "CHANNEL", "REACTION"],
	intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILD_MESSAGE_REACTIONS"],
});

// Connection to mongoDB
mongoose.connect(Config.dbLink, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).catch(error => console.log(error));

mongoose.connection.on("error", function(e) {
	console.log("YukikoDB: Can not connect Error: " + e);
});

mongoose.connection.once("open", function() {
	console.log("\x1b[32mYukikoDB:\x1b[0m connected to \x1b[31m" + mongoose.connection.host + " \x1b[0m");
});

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
	.on("nodeConnect", () => console.log("Connected to Lavalink"))
	.on("nodeError", (node, error) => console.log(`Node error: ${error.message}`))
	.on("trackStart", (player, track) => {
		if (!player.voiceChannel) {
			bot.channels.cache.get(player.textChannel).send("Seems like I've been disconnected from the voice channel. I'm destroying the player now.");
			return player.destroy();
		}
		const nowPlayingEmbed = new MessageEmbed()
			.setAuthor("Now playing", bot.user.displayAvatarURL())
			.setDescription(`Now playing 『${track.title}』 requested by ${track.requester}`)
			.setImage(track.displayThumbnail("mqdefault"))
			.setTimestamp()
			.setFooter(bot.user.username, bot.user.displayAvatarURL());
		bot.channels.cache.get(player.textChannel).send(nowPlayingEmbed);
	})
	.on("queueEnd", (player) => {
		bot.channels.cache.get(player.textChannel).send("Queue has ended.");
		player.destroy();
	});
bot.on("raw", (d) => bot.manager.updateVoiceState(d));

// Slash command Handler
bot.slash = new Collection();
const SlashPath = path.join(__dirname, "slash/commands");
const SlashFiles = fs.readdirSync(SlashPath).filter(file => file.endsWith(".js"));

for(const file of SlashFiles) {
	const filePath = path.join(SlashPath, file);
	const Slash = require(filePath);
	bot.slash.set(Slash.data.name, Slash);
}

// Command Handler
bot.Commands = new Collection();
bot.Aliases = new Collection();
bot.Categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
	require(`./handler/${handler}`)(bot);
});

// Event Handler
const EventFiles = fs.readdirSync("./events/").filter(file => file.endsWith(".js"));
for (const file of EventFiles) {
	const event = require(`./events/${file}`);
	if(event.once) {
		bot.once(event.name, (...args) => event.execute(...args, bot));
	}
	else{
		bot.on(event.name, (...args) => event.execute(...args, bot));
	}
}

bot.login(Config.token);