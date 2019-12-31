var discord = require("discord.js");
var superagent = require("superagent");
var warn = require('../warn.json');

module.exports.run = async (bot, message, args) => {
    if(!args[0]) return message.reply("No user selected.")
    let iUser  = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!iUser) return message.reply("User not found :/");
    if(iUser.user.bot === true) return message.reply('Bot are not supported yet.')
    let userEmbed = new discord.RichEmbed()
    .setTitle(bot.user.username)
    .setThumbnail(iUser.user.displayAvatarURL)
    .setDescription("Here the all the information for the user **" + iUser.user.username + "#" + iUser.user.discriminator + "**")
    .addField("Username: ", iUser.user.username, true )
    .addField("Nickname: ", iUser.nickname, true )
    .addField("ID:", iUser.id, true)
    .addField("Joined the server at:", iUser.joinedAt, true)
    .addField("Account Created at:", /*iUser.createdAt*/ "Feature not Supported yet", true)
    .addField('Roles:', iUser.roles.map(r => `${r}`).join(' | '), true)
    //console.log(iUser)
    message.channel.send(userEmbed)
    
    
}

module.exports.help = {
    name: "user-info",
    description: "Show... bot uptime? more or less."
}
