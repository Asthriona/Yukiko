var discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
        let sicon = message.guild.iconURL;
        let serverembed = new discord.RichEmbed()
        .setDescription("Server Information")
        .setColor("#800080")
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name)
        .addField("Created on", message.guild.createdAt)
        .addField("You joined", message.member.joinedAt)
        .addField("Server Owner", message.guild.owner)
        .addField("Total members", message.guild.memberCount)
        return message.channel.send(serverembed);
}


module.exports.help = {
    name: "server-info",
    description: 'for later ...'
}