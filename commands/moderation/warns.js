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
    description: "Donner un avertissement a un utilisateur.",
    usage: "$warn <mention | id> [Raison]",
    run: async (bot, message, args) =>{
        if(!message.member.hasPermission("BAN_MEMBERS")){
            message.reply("Wow! ta pas le droit de donner des avertissement!")
        }
        let wUser = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!wUser) return message.reply(`j'ai pas trouver l'utilisateur ${args[0]}`)
        if(wUser.hasPermission("BAN_MEMBERS")) return message.reply(`Tu ne peut pas donner d'arvertissement a ${wUser} Il est bien trop cool pour ça!`)
        if(!args[1]) return message.reply("Merci de spécifier une raison.")
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
                message.channel.send(`${wUser} a etait mute pendent ${muteTime} (Second Warn.)`)
                setTimeout(function(){
                    wUser.removeRole(muteRole.id);
                    message.channel.send(`${wUser} a etait dé-mute`);
                },ms(muteTime))
            }else if(users.warn = 5){
                let muteTime = "1h"
                await(wUser.addRole(MuteRole.id));
                message.channel.send(`${wUser} a etait mute pendent ${muteTime} (5 Warn.)`)
                setTimeout(function(){
                    wUser.removeRole(muteRole.id);
                    message.channel.send(`${wUser} a etait dé-mute`);
                },ms(muteTime))
            }
            
            //Warn
            let logChannel = message.guild.channels.find(c => c.name === "incident")
            var embed = new RichEmbed()
            .setAuthor(`~Warn~ ${wUser.username}`, wUser.user.displayAvatarURL)
            .setColor("PURPLE")
            .setTimestamp()
            .setFooter(bot.user.username, bot.user.displayAvatarURL)
            .setDescription(`=> **Avertissement donnée a: ** ${wUser} (${wUser.id})
            => **Donner par:** ${message.author} (${message.author.id})
            => **Nombre de warn:** ${users.warn}
            => **Raison:** ${args.slice(1).join(" ")}`)
            logChannel.send(embed)
            message.channel.send(`L'utilisateur ${wUser} a bien recu un avertissement pour la raison ${args.slice(1).join(" ")}`)
        })
    }
}