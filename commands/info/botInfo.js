var { RichEmbed } = require("discord.js");
var pjson = require('../../package.json');
module.exports = {
    name: "botinfo",
    category: "info",
    description: "show you information about this bot.",
    category: "info",
    run: async (bot, message, args) => {
        let botembed = new RichEmbed()
    .setThumbnail(bot.user.displayAvatarURL)
    .setTitle("A propos de ce bot")
    .setAuthor(bot.user.username, bot.user.displayAvatarURL, 'http://yukiko.nishikino.me/')
    .setDescription("this bot can make your cat explode, Mount the DOGO, burn your egg and clean your house. (but not your room. we tested all of this.(RIP my cat...))")
    .setColor("#800080")
    .addField("Bot name:", bot.user.username, true)
    .addField("Version:", `${pjson.version} ${pjson.codeName}`, true)
    .addField("Developped by:", "Asthriona / Heather", true)
    .addField("Developper Website", "https://Asthriona.com", true)
    .addField("Created on", bot.user.createdAt, true)
    .addField("On the server since:", bot.user.joinedAt, true)
    .addField("Git:", "https://github.com/Asthriona/Yukiko", true)
    .addField('Site: ', 'http://yukiko.nishikino.me/', true)
    .addField("Server Using this server: ", bot.guilds.size, true)
    .setTimestamp()
    .setFooter(bot.user.username, bot.user.displayAvatarURL)
return message.channel.send(botembed)
    }
}