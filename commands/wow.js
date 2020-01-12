var discord = require('discord.js');
var superagent = require('superagent');
var axios = require('axios');
var botConfig = require('../botconfig.json')

module.exports.run = async (bot, message, args) => {
  var char = args.join(" ");
  axios.get('https://eu.api.blizzard.com/wow/character/magtheridon/'+char+'?locale=en_US&access_token='+botConfig.wowAT).then(function(res) {
  
    if(message.author.id === "186195458182479874"){
    var wowembed = new discord.RichEmbed()
    .setTitle("Infos for: " + args)
    .addField("Name:", res.data.name, true)
    .addField("Realm", res.data.realm, true)
    .addField("Battlegroup", res.data.battlegroup, true)
    .addField("Class:", res.data.class, true)
    .addField("Race", res.data.race, true)
    .addField("Gender", res.data.gender, true)
    .addField("level", res.data.level, true)
    .addField("Achievement Points", res.data.achievementPoints, true)
    .addField("Calc Class", res.data.calcClass, true)
    .addField("faction", res.data.faction, true)
    .addField("Total Honorable Kills", res.data.totalHonorableKills, true)
    .addField("ID", res.data.id, true)
    message.reply(wowembed)
    }
}).catch(err => message.channel.send("WAW! an error sucessfully happened! ```"+err+"```"));
}
module.exports.help = {
    name: "wow",
    description: 'for later ...'
}