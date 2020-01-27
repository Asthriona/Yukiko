var discord = require('discord.js');
var superagent = require('superagent');

module.exports.run = async (bot, message, args) => {
    if(message.author.id === "186195458182479874"){ 
    bot.user.setStatus('')
    bot.user.setPresence({
        game: {
            name: args.join(" "),
            type: "Streaming",
            url: "https://www.twitch.tv/jacquirenee"
        }
    });
}else{
    return message.reply("Oy! Je fé ke kess ke ge ve deja!")
}
}

module.exports.help = {
    name: "stream",
    description: 'for later ...'
}