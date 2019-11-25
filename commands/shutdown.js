var discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(message.author.id != "186195458182479874") return message.channel.send("You cant shutdown the bot.")

    try{
        await message.channel.send("bot is shuting down...")
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