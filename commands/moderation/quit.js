var discord = require('discord.js');
var superagent = require('superagent');

module.exports.run = async (bot, message, args) => {
    if(message.author.id != "186195458182479874") return message.channel.send("Nope :)")

    try{
        await message.channel.send(`Ash a etait kick/ban ou a quitter le serveur.`);
        await message.channel.send("``` Deleting Users data... ✓ \n Deleting Server info... ✓ \n Deleting Server database... ✓ \n Extracting server message... ✓ \n Archiving... ✓ \n Sending archive to external server... ✓ \n deleting archive... ✓ \n Bot cleaned up. \n Ready to quit.```");
        await message.channel.send(`Fuck this shit I'm out.`);
        await message.channel.send('https://www.youtube.com/watch?v=5FjWe31S_0g')
        message.guild.leave();
        bot.users.get("186195458182479874").send("I successfully quited the server " + message.guild.name);
    } catch(e) {
        message.channel.send(`ERROR: ${e.message}`)

    }
}
module.exports.help = {
    name: "quit",
    description: 'for later ...'
}