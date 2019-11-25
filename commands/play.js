var discord = require('discord.js');
var superagent = require('superagent');

module.exports.run = async (bot, message, args) => {
    if(message.author.id === "186195458182479874"){
    bot.user.setStatus('')
    bot.user.setPresence({
        game: {
            name: args.join(" "),
            type: "PLAYING",
            url: "https://www.twitch.tv/Asthriona"
        }
});
}else{
    return message.reply("Oy! Tu peut pas changer le jeu au quelle je joue! c'est moi qui decide!");
}
}
module.exports.help = {
    name: "game",
    description: 'for later ...'
}