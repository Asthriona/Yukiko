var discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(message.author.id != "186195458182479874") return message.channel.send("You cant shutdown the bot.")

    try{
        message.delete().catch(O_o=>{});
        await message.channel.send(`Bot is shuting down for ${args} requested by: <@${message.author.id}>`);
        bot.user.setStatus('INVISIBLE');
        bot.logout
        process.exit()
    } catch(e) {
        message.channel.send(`ERROR: ${e.message}`)

    }
}

module.exports.help = {
    name: "shutdown",
    description: "PLEASE DONT USE IT! :c"
}