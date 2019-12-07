var discord = require('discord.js');
var superagent = require('superagent');

module.exports.run = async (bot, message, args) => {
    if(message.author.id != "186195458182479874") return message.channel.send("Nope :)")

    try{
        await message.channel.send(`Ash a etait kick/ban ou a quitter le serveur.`);
        await message.channel.send(`Fuck this shit I'm out.`);
        await message.channel.send('https://www.youtube.com/watch?v=5FjWe31S_0g')
        message.guild.leave();
    } catch(e) {
        message.channel.send(`ERROR: ${e.message}`)

    }
}
module.exports.help = {
    name: "quit",
    description: 'for later ...'
}