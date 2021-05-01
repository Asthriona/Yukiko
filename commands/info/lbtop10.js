var { MessageEmbed } = require("discord.js");
var mongoose = require("mongoose");
var botConfig = require('../../botconfig.json');

mongoose.connect(botConfig.dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Users = require('../../model/xp.js')

module.exports = {
    name: "top",
    category: "info",
    description: "Show the top 10 leaderboard!",
    run: async (bot, message, args) => {
        Users.find({
            serverID: message.guild.id
        }).sort([
            ['xp', 'descending']
        ]).exec((err, res) => {
        if(err) console.log(err);
        let embed = new MessageEmbed()
        .setTitle("Yukiko's Leaderboard!")
        .setThumbnail(bot.user.displayAvatarURL())
        .setDescription("Here is our top10!")
        .setFooter(`Powered by ${bot.user.username}`, bot.user.displayAvatarURL())
        if(res.length === 0){
            //if no result
            embed.setColor("red")
            embed.addField("No Data :c")
        }else if(res.length < 10){
            //if less than 10
            embed.setColor("#351B96")
            for(i = 0; i < res.length; i++){
                let member = message.guild.members.cache.get(res[i].did) || "User is gone :/"
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
}