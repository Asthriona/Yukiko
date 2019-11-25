var discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
        let sicon = message.guild.iconURL;
        let serverembed = new discord.RichEmbed()
        .setDescription("Server Information")
        .setColor("#800080")
        .setThumbnail(sicon)
        .addField("Nom du serveur", message.guild.name)
        .addField("Crée le", message.guild.createdAt)
        .addField("Vous l'avez rejoint le: ", message.member.joinedAt)
        .addField("Propriétaire: ", message.guild.owner)
        .addField("Nombre de membre: ", message.guild.memberCount)
        return message.channel.send(serverembed);
}


module.exports.help = {
    name: "server-info",
    description: 'for later ...'
}