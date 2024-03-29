const mongoose = require("mongoose");
const botConfig = require("../../botconfig.json");
mongoose.connect(botConfig.dbLink, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const Cards = require("../../model/card.js");
module.exports = {
	name: "card",
	aliases: ["cards", "rankcards", "changeCards", "newcards"],
	category: "info",
	description: "give you the possibility to change your card background!",
	usage: "<link> | <info>",
	run: async (bot, message, args) => {
		if(args[0] === "info") {
			message.reply("You can send a custom image to use as a rank card.\n Your image must be in **934x282**. if it's not it will be stretched to this resolution. \n you must send a link to an image in ***.jpg*** or ***.png***. Any other link will be refused.");
		}
		console.log(args[0]);
		if(!args[0]) return message.reply("Please send a link to your image!");
		if(!args[0].startsWith("http" || "https")) return message.reply("please send a valid link.");
		// fix this.
		// aaah. I cant remember the issue. well test and fix this future me please.
		if(!args[0].endsWith(".png") || !args[0].endsWith(".jpg")) return message.reply("please send a link to an image in jpg or png.");
		Cards.findOne({
			did: message.author.id,
		}, (err, cards)=>{
			if(err) console.log(err);
			if (!cards) {
				const newCards = new Cards({
					did: message.author.id,
					link: args[0],
				});
				newCards.save().catch(error => console.log(error));
				message.reply("Your card has been saved!");
			}
			else {
				cards.link = args[0];
				cards.save().catch(error => console.log(error));
				message.reply("Your card has been saved!");
			}
		});
	},

};