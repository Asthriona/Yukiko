var discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    //clear
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("No.");
    if(!args[0]) return message.channel.send("oof");
    message.channel.bulkDelete(args[0]).then(() => {
        message.channel.send(`Cleared ${args[0]} messages.`).then(msg => msg.delete(1000));
    });
//console.log(`${message.author.username} used !clear`)
//        return message.channel.send("Error: Can't clear message for now.");
}

module.exports.help = {
    name: "clear",
    description: "Clear the selected number of message"
}