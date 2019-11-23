var discord = require('discord.js');
var superagent = require('superagent');

module.exports.run = async (bot, message, args) => {
    bot.user.setStatus('')
    bot.user.setPresence({
        game: {
            name: args.join(" "),
            type: "WATCHING",
            url: "https://www.asthriona.com/"
        }
});
}

module.exports.help = {
    name: "watch",
    description: 'for later ...'
}