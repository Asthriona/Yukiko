var discord = require("discord.js");
var superagent = require("superagent");
var warn = require('../warn.json');

module.exports.run = async (bot, message, args) => {
    let iUser  = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(iUser.bot === true) return message.channel.send ('Bot are not supported yet.')
    let userEmbed = new discord.RichEmbed()
    .setTitle(bot.user.username)
    .setThumbnail(iUser.user.displayAvatarURL)
    .setDescription("Here the all the information for the user **" + iUser.user.username + "#" + iUser.user.discriminator + "**")
    .addField("Username: ", iUser.user.username )
    .addField("Nickname: ", iUser.nickname)
    .addField("ID:", iUser.id)
    .addField("Joined the server at:", iUser.joinedAt)
    .addField("Account Created at:", /*iUser.createdAt*/ "Feature not Supported yet")
    .addField('Roles:', iUser.roles.map(r => `${r}`).join(' | '), true)
    //console.log(iUser)
    return message.channel.send(userEmbed)
    
}

module.exports.help = {
    name: "user-info",
    description: "Show... bot uptime? more or less."
}
