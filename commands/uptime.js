var discord = require("discord.js");
var superagent = require("superagent");

module.exports.run = async (bot, message, args) => {
    //Uptime
    let totalSeconds = (bot.uptime / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor(totalSeconds / (60*60));
    totalSeconds %= 3600;
    var minutes = Math.floor(totalSeconds % (60*60) / 60);
    var seconds = Math.floor(totalSeconds % 60);
    var uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

    message.channel.send(uptime)
    console.log(`${message.author.username} used uptime ${uptime}`)
}

module.exports.help = {
    name: "uptime",
    description: "Show... bot uptime? more or less."
}
