var discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    message.react(args[0])
    .catch(err => message.reply('```'+err+'```'));
}
module.exports.help = {
    name: "react"
}