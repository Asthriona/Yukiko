var discord = require("discord.js");
var superagent = require("superagent");

module.exports.run = async (bot, message, args) => {
    //Uptime
    var seconds = Math.floor(seconds % 60);
    let days = Math.floor(seconds / 86400);
    let hours = Math.floor(seconds / (60*60));
    let minutes = Math.floor(seconds % (60*60) / 60);
    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

    message.channel.send(uptime)
    console.log(`${message.author.username} used uptime ${uptime}`)
}

module.exports.help = {
    name: "uptime",
    description: "Show... bot uptime? more or less."
}
