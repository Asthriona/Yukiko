var mongoose = require("mongoose");
var botConfig = require("../../botconfig.json");
var { MessageEmbed } = require("discord.js")

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
        if(!wUser) return message.reply(`I can't find ${args[0]}`)
        if(wUser.hasPermission("BAN_MEMBERS")) return message.reply(`You can't warn ${wUser} he/she is waaaaay too cool for that!`)
        if(!args[1]) return message.reply("Please provide a reason.")
        Users.findOne({
            userID: wUser.id,
            serverID: message.guild.id
        }, async (err, users) => {
            if(err) console.log(err);
            users.warn = users.warn -1
            users.save()
            

            let logChannel = message.guild.channels.find(c => c.name === "incident")
            var embed = new MessageEmbed()()
            .setAuthor(`~Warn~ ${wUser}`, wUser.user.displayAvatarURL())
            .setColor("PURPLE")
            .setTimestamp()
            .setFooter(bot.user.username, bot.user.displayAvatarURL())
            .setDescription(`=> **Warn deleted from user: ** ${wUser} (${wUser.id})
            => **Deleted by:** ${message.author} (${message.author.id})
            => **warn Number:** ${users.warn}
            => **Reason:** ${args.slice(1).join(" ")}`)
            logChannel.send(embed)
            message.channel.send(`${wUser}'warn has been deleted.`)
        })
    }
}