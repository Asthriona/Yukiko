var discord = require("discord.js");
var mongoose = require("mongoose");
var Canvas = require('canvas');
var botConfig = require('../botconfig.json');

let dbusername = botConfig.dbuser;
let dbpasswd = botConfig.dbpass;
mongoose.connect('mongodb+srv://' + dbusername + ':'+ dbpasswd +'@yukiko-pcvs8.mongodb.net/discordbot?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Users = require('../model/xp.js')

module.exports.run = async (bot, message, args) => {
    Users.find({
        serverID: message.guild.id
    }).sort([
        ['xp', 'descending']
    ]).exec((err, res) => {
    if(err) console.log(err);
    let embed = new discord.RichEmbed()
    .setTitle("Yukiko's Leaderboard!")
    .setThumbnail(bot.user.displayAvatarURL)
    .setDescription("Here is our top10!")
    .setFooter('Powered by Yukiko', bot.user.displayAvatarURL, "http://yukiko.nishikino.me/")
    if(res.length === 0){
        //if no result
        embed.setColor("red")
        embed.addField("No Data :c")
    }else if(res.length < 10){
        //if less than 10
        embed.setColor("#351B96")
        for(i = 0; i < res.length; i++){
            let member = message.guild.members.get(res[i].did) || "User is gone :/"
            if(member === "User is gone :/"){
                embed.addField(`${i+1}. ${member}`, `**Level**: ${res[i].level} || **XP**: ${res[i].xp}`)

            }else{
                embed.addField(`${i+1}. ${member.user.username}`, `**Level**: ${res[i].level} || **XP**: ${res[i].xp}`)
            }
        }
    }else{
        //if more than 10
        embed.setColor("#351B96")
        for(i = 0; i < 10; i++){
            let member = message.guild.members.get(res[i].did) || "User is gone :/"
            if(member === "User is gone :/"){
                embed.addField(`${i+1}. ${member}`, `**Level**: ${res[i].level} || **XP**: ${res[i].xp}`)

            }else{
                embed.addField(`${i+1}. ${member.user.username}`, `**Level**: ${res[i].level} || **XP**: ${res[i].xp}`, true)
            }
        }
    }
    message.channel.send(embed)
});
    }     
module.exports.help = {
    name: "level",
    description: "Show rank card"
}