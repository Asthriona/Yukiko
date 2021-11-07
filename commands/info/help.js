const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
// var { botConfig } = require("../../botconfig.json")
module.exports = {
	name: "help",
	category: "info",
	description: "Return all the commands for this bot.",
	usage: "[command | alias]",
	run: async (bot, message, args) => {
		if(args[0]) {
			return getCMD(bot, message, args[0]);
		}
		else {
			return getAll(bot, message);
		}
	},
};
// var prefix = botConfig.prefix;

function getAll(bot, message) {
	const embed = new MessageEmbed()
		.setColor("RANDOM");
	const commands = (category) => {
		return bot.Commands
			.filter(cmd => cmd.category === category)
			.map(cmd => `\`${cmd.name}\``)
			.join(", ");
	};
	const info = bot.Categories
		.map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n ${commands(cat)}`)
		.reduce((string, category) => string + "\n" + category);
	embed.setDescription(info);
	return message.reply({ embeds: [embed] });
}
function getCMD(bot, message, input) {
	const embed = new MessageEmbed();
	const cmd = bot.Commands.get(input.toLowerCase()) || bot.commands.get(bot.alias.get(input.toLowerCase()));
	let info = `No information for the commands ***${input.toLowerCase}`;
	embed.setColor("RED")
		.setDescription(info);
	if(!cmd) {
		return message.reply({ embeds: [embed] });
	}
	if(cmd.name) info = `**command name** ${cmd.name}`;
	if(cmd.alias) info += `\n**Alialses** ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
	if(cmd.description) info += `\n**Description**: ${cmd.description}`;
	if(cmd.usage) {
		info += `\n**Usage**: ${cmd.usage}`;
		embed.setFooter("Syntax: <> = Is required, [] = is optional")
			.setColor("PURPLE")
			.setDescription(info);
	}
	return message.reply({ embeds: [embed] });
}