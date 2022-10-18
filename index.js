/*
/   Welp, Discord used Yukiko-dev-team as an exemple for their new ToS enforcement. because they are releasing a new feature with YouTube.
/ 	So I guess I have time again?
/ 	funyn they wont reply to the ticket they TOLD me to make.
/ 	so this might be last update of this bot and then I leave Discord to use LINE, messenger, or something else.
/   Here is the link to my LINE account :) https://line.me/ti/p/FOBYHR9htn
/	- Asthriona
*/

const { Client, MessageEmbed, Collection, GatewayIntentBits } = require("discord.js");
const Config = require("./botconfig.json");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { Manager } = require("erela.js");

const bot = new Client({
	disableMentions: "everyone",
	// partials: ["USER", "MESSAGE", "CHANNEL", "REACTION"],
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers],
});

// Connection to mongoDB
mongoose.connect(Config.dbLink, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).catch(error => console.error(error));

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
			.setAuthor({ name: "Now playing", iconURL: bot.user.displayAvatarURL()})
			.setDescription(`Now playing 『${track.title}』 requested by ${track.requester}`)
			.setImage(track.displayThumbnail("mqdefault"))
			.setTimestamp()
			.setFooter({ text: bot.user.username, iconURL: bot.user.displayAvatarURL()});
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