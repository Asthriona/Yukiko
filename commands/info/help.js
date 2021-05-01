var { MessageEmbed } = require("discord.js");
var { stripIndents } = require("common-tags");
// var { botConfig } = require("../../botconfig.json")
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
//var prefix = botConfig.prefix;

function getAll(bot, message){
    var embed = new MessageEmbed()
    .setColor("RANDOM")
    var commands = (category) => {
        return bot.Commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `\`${cmd.name}\``)
            //.map(cmd => `\`${prefix}${cmd.name}\``) For later use, got weird ass bug. Getting my head back into this code is not the easiest thing I've ever done.
            .join(", ")
    }
    var info = bot.Categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n ${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info));
}
function getCMD(bot, message, input){
    var embed = new MessageEmbed()
    var cmd = bot.Commands.get(input.toLowerCase()) || bot.commands.get(bot.alias.get(input.toLowerCase()))
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