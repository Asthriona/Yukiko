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
    return message.reply("No. https://cdn.asthriona.com/DKUR9Tk.png");
}
}
module.exports.help = {
    name: "play",
    description: 'for later ...'
}