var discord = require("discord.js");
var superagent = require("superagent");
var os = require('os');
var osu = require('os-utils')

module.exports.run = async (bot, message, args) => {
    var cpu = osu.cpuUsage(function(v){
        var ram = os.freemem() * 100 / os.totalmem();
        var uptime = os.uptime();
        var load = os.loadavg();
        var hostname = os.hostname();
        //var ip = os.networkInterfaces(address)
        var niketoi = "Intel(R) Xeon(R) CPU E3-1230 v3 @ 3.30GHz"
        
              let  systemEmbed = new discord.RichEmbed()
              .setTitle("System Information")
              .setDescription("This commands is used to show the stats from the server who host this bot.")
              .setColor("#800080")
              .setThumbnail(bot.user.displayAvatarURL)
              .addField("CPU Model:", niketoi )
              .addField("CPU Usage:", Math.round(v * 100) + "%", true)
              .addField("RAM:", Math.round(ram) + "%")
              .addField("Load:", load, true)
              .addField("Server Hostname:", hostname)
              .addField("Server Uptime:", Math.round(uptime / 3600 / 24) + "days", true)
              .setFooter("Powered by Asthriona LLC", bot.user.displayAvatarURL)
              return message.channel.send(systemEmbed)
        });
}

module.exports.help = {
    name: "host",
    description: "system info"
}
