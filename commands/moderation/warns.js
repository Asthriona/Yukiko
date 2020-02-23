var mongoose = require("mongoose");
var botConfig = require("../../botconfig.json");
var { RichEmbed } = require("discord.js");
var ms = require("ms");

mongoose.connect(botConfig.dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Users = require("../../model/xp")

module.exports = {
    name: "warn",
    category: "moderation",
    description: "Warn a user that break the law!",
    usage: "$warn <mention | id> [Raison]",
    run: async (bot, message, args) =>{
        if(!message.member.hasPermission("BAN_MEMBERS")){
            message.reply("Wow! You can't give wanrn! You dont have the right to do it!")
        }
        let wUser = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!wUser) return message.reply(`I can't find ${args[0]}`)
        if(wUser.hasPermission("BAN_MEMBERS")) return message.reply(`You can't warn ${wUser} he/she is waaaaay too cool for that!`)
        if(!args[1]) return message.reply("Oy! you forgot to provide a reason!")
        Users.findOne({
            userID: wUser.id,
            serverID: message.guild.id
        }, async (err, users) => {
            if(err) console.log(err);
            users.warn = users.warn +1
            users.save()

            //Auto mute
            let MuteRole = message.guild.roles.find('name', 'Muted');
            if(users.warn = 2){
                let muteTime = "10m"
                await(wUser.addRole(MuteRole.id));
                message.channel.send(`${wUser} has been mute for ${muteTime} (Second Warn.)`)
                setTimeout(function(){
                    wUser.removeRole(muteRole.id);
                    message.channel.send(`${wUser} has been un-mute`);
                },ms(muteTime))
            }else if(users.warn = 5){
                let muteTime = "1h"
                await(wUser.addRole(MuteRole.id));
                message.channel.send(`${wUser} has been mute for ${muteTime} (5 Warn.)`)
                setTimeout(function(){
                    wUser.removeRole(muteRole.id);
                    message.channel.send(`${wUser} has been un-mute`);
                },ms(muteTime))
            }
            
            //Warn
            let logChannel = message.guild.channels.find(c => c.name === "incident")
            var embed = new RichEmbed()
            .setAuthor(`~Warn~ ${wUser.username}`, wUser.user.displayAvatarURL)
            .setColor("PURPLE")
            .setTimestamp()
            .setFooter(bot.user.username, bot.user.displayAvatarURL)
            .setDescription(`=> **Warned user: ** ${wUser} (${wUser.id})
            => **Warned by:** ${message.author} (${message.author.id})
            => **Warn number:** ${users.warn}
            => **Reason:** ${args.slice(1).join(" ")}`)
            logChannel.send(embed)
            message.channel.send(`${wUser} has been warned for the following reason: ${args.slice(1).join(" ")}`)
        })
    }
}