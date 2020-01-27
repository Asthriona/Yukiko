var discord = require('discord.js');
var superagent = require('superagent');

module.exports.run = async (bot, message, args) => {
    if(message.author.id === "186195458182479874"){ 
    bot.user.setStatus('')
    bot.user.setPresence({
        game: {
            name: args.join(" "),
            type: "WATCHING",
            url: "https://www.asthriona.com/"
        }
});
    }else{
        return message.reply("C'est moi qui decide ce que je regarde!")
    }
}
module.exports.help = {
    name: "watch",
    description: 'for later ...'
}