var mongoose = require("mongoose");
var botConfig = require("../../botconfig.json");
var { RichEmbed } = require("discord.js")

mongoose.connect(botConfig.dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Users = require("../../model/xp")

module.exports = {
    name: "un-warn",
    category: "moderation",
    description: "supprimé un avertissement a un utilisateur.",
    usage: "$un-warn <mention | id> [Raison]",
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
            users.warn = users.warn -1
            users.save()
            

            let logChannel = message.guild.channels.find(c => c.name === "incident")
            var embed = new RichEmbed()
            .setAuthor(`~Warn~ ${wUser}`, wUser.user.displayAvatarURL)
            .setColor("PURPLE")
            .setTimestamp()
            .setFooter(bot.user.username, bot.user.displayAvatarURL)
            .setDescription(`=> **Avertissement supprimé a: ** ${wUser} (${wUser.id})
            => **Supprimé par:** ${message.author} (${message.author.id})
            => **Nombre de warn:** ${users.warn}
            => **Raison:** ${args.slice(1).join(" ")}`)
            logChannel.send(embed)
            message.channel.send(`L'avertissement donnée a ${wUser} a bien etait supprimé`)
        })
    }
}