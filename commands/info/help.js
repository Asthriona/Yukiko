var { RichEmbed } = require("discord.js");
var { stripIndents } = require("common-tags");
var { promptMessage } = require("../../function")
var { botConfig } = require("../../botconfig.json")
module.exports = {
    name: "help",
    category: "info",
    description: "Return all the commands for this bot.",
    usage: "[command | alias]",
    run: async (bot, message, args) => {
        if(args[0]){
            return getCMD(bot, message, args[0])
        } else {
           return getAll(bot, message)
        }
    }
}
function getAll(bot, message){
    var embed = new RichEmbed()
    .setColor("RANDOM")
    var commands = (category) => {
        return bot.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}\``)
            .join("\n")
    }
    var info = bot.categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n ${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info));
}
function getCMD(bot, message, input){
    var embed = new RichEmbed()
    var cmd = bot.commands.get(input.toLowerCase()) || bot.commands.get(bot.alias.get(input.toLowerCase()))
    let info = `No information for the commands ***${input.toLowerCase}`;

    if(!cmd){
        return message.channel.send(embed.setColor("RED").setDescription(info))
    }
    if(cmd.name) info = `**command name** ${cmd.name}`;
    if(cmd.alias) info += `\n**Alialses** ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if(cmd.description) info += `\n**Description**: ${cmd.description}`
    if(cmd.usage){
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = Is required, [] = is optional`);
    }
    return message.channel.send(embed.setColor("PURPLE").setDescription(info));
}