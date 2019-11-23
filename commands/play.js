var discord = require('discord.js');
var superagent = require('superagent');

module.exports.run = async (bot, message, args) => {
    bot.user.setStatus('')
    bot.user.setPresence({
        game: {
            name: args.join(" "),
            type: "PLAYING",
            url: "https://www.twitch.tv/Asthriona"
        }
});
}

module.exports.help = {
    name: "play",
    description: 'for later ...'
}