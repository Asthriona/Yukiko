var discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    //let emote = message.guild.emojis.find('name', "japanese_goblin")
    message.react("👺")
}
module.exports.help = {
    name: "react"
}