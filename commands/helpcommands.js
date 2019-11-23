var discord = require('discord.js');
var superagent = require('superagent');

let p = "a!"


module.exports.run = async (bot, message, args) => {
    let asthri = bot.users.get("186195458182479874")
    let  embed = new discord.RichEmbed()
    .setColor("#800080")
    .setTitle("Commands heneral")
    .setDescription("Cette section est en contruction... Merci de patienter encore quelques mise a jours...")
    .setAuthor("Asthriona Moderation bot", bot.user.displayAvatarURL, 'https://Asthriona.com')
    .setFooter('Bot developer par Asthriona', "https://cdn.discordapp.com/avatars/139660104881537024/b534e233f7457477b9d771808754180b.png?size=2048")

    message.channel.send(embed)
}

module.exports.help = {
    name: "help-commands",
    description: 'for later ...'
}