// Holy fuck. Lots of work to do here.
const Config = require("../botconfig.json");
const Users = require("../model/xp.js");
const Cards = require("../model/card.js");
const { lvlupimg } = require("../Cards.js");
module.exports = {
	name: "messageCreate",
	once: false,
	async execute(message, bot) {
		if(message.author.bot) return;
		// DA NEW XP SYSTEM 2.0
		const xpAdd = Math.ceil(Math.random() * 15);
		const messageAdd = +1;


		Users.findOne({
			did: message.author.id,
			serverID: message.guild.id,
		}, (err, users) => {
			if (err) console.log(err);
			if (!users) {
				const newUsers = new Users({
					did: message.author.id,
					username: message.author.username,
					serverID: message.guild.id,
					xp: xpAdd,
					level: 0,
					message: messageAdd,
					warns: 0,
					avatarURL: message.author.displayAvatarURL(),
				});

				newUsers.save().catch(error => console.log(error));
			}
			else {
				users.xp = users.xp + xpAdd;
				users.message = users.message + messageAdd;
				users.username = message.author.username;
				users.avatarURL = message.author.displayAvatarURL();

				const nxtlvl = 300 * Math.pow(2, users.level);
				if (users.xp >= nxtlvl) {
					users.level = users.level + 1;

					// lvl up image
					const sendimg = async function sendimg() {
						await lvlupimg(message, users);

					};
					sendimg();
				}
				users.save().catch(error => console.log(error));
			}
		});

		// Add default cards to new users
		Cards.findOne({
			did: message.author.id,
		}, (err, cards) => {
			if (err) console.log(err);
			if (!cards) {
				const newCards = new Cards({
					did: message.author.id,
					link: "https://cdn.yukiko.app/Cards/DefaultYukikocard.jpg",
				});
				newCards.save().catch(error => console.log(error));
			}
		});

		// ignore types of messages or without prefix.
		if (message.channel.type === "dm") return;
		if(message.author.bot) return;
		if(!prefix) return;

		// Setup Prefix and args
		const prefix = Config.prefix;
		const messageArray = message.content.split(" ");
		const args = messageArray.slice(1);
		const cmd = messageArray[0];

		// Commands Handler
		const commandfile = bot.Commands.get(messageArray[0].slice(prefix.length));
		if (commandfile) commandfile.run(bot, message, args, cmd);
	},
};