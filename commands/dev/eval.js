const { MessageEmbed } = require("discord.js");
const beautify = require("beautify");
const Config = require("../../botconfig.json");
module.exports = {
	name: "eval",
	category: "dev",
	description: "Run some code directly in discord! (developper only!)",
	run: async (bot, message, args) => {
		if(!Config.owners.includes(message.author.id)) return message.reply("You are not a developper! you can't run code just like that!");
		if(!args[0]) return message.channel.send("Please gimme some good code!");

		try {
			if(args.join(" ").toLowerCase().includes("token")) {
				return message.channel.send("No, I'm not gonna give you my token! Nice try tho!");
			}
			const toEval = args.join(" ");
			const evaluated = eval(toEval);

			const embed = new MessageEmbed()
				.setColor("PURPLE")
				.setTimestamp()
				.setFooter(bot.user.username, bot.user.displayAvatarURL())
				.setTitle("Elva")
				.addField("To Evaluate:", `\`\`\`js\n${beautify(args.join(" "), { format: "js" })}\n\`\`\``)
				.addField("Evaluated:", evaluated)
				.addField("Type of:", typeof (evaluated));

			message.channel.send({ embeds: [embed] });
		}
		catch (e) {
			message.channel.send("ERROR! \n ```" + e + "```");
		}
	},
};