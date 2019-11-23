var discord = require('discord.js');
var superagent = require('superagent');

let p = "a!"


module.exports.run = async (bot, message, args) => {
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Utilisateur Introvable D:");
    let reason = args.join(" ").slice(22);

    let embed = new discord.RichEmbed()
    .setAuthor('Asthriona Moderation bot')
    .setThumbnail(message.author.displayAvatarURL)
    .setTitle(`report from ${message.author.username}`)
    .setDescription("Reports")
    .setColor("#800080")
    .addField("Reported User: ", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported by ", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel: ", message.channel)
    .addField("Time: ", message.createdAt)
    .addField("reason", reason)
    
    let reportChannel = message.guild.channels.find('name', "report");
    if(!reportChannel) return message.channel.send("Oops Erreur 10-r404 :/ <@186195458182479874> ");

    message.delete().catch(O_o=>{});
    reportChannel.send(embed)

    return
}

module.exports.help = {
    name: "report",
    description: 'for later ...'
}