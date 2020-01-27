var { RichEmbed } = require("discord.js");
var { stripIndents } = require("common-tags");
module.exports = {
    name: "report",
    category: "moderation",
    description: "Report a user that break the law!",
    usage: "<mention | id>",
    run: async (bot, message, args) => {
        if(message.deletable) message.delete();
        let rMember = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!rMember)
            return message.reply("User not found").then(m => m.delete(5000));
            if(rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
                return message.reply("Cannot report that member.").then(m => m.delete(5000));
            if(!args[1])
                return message.reply("You can't report someone without a reason.")
            if(args[1] === "Raison")
                return message.reply("Ta pas mieux comme raison?")
            var channel =  message.guild.channels.find(channel => channel.name === "report")
            if(!channel)
                return message.reply("Cannot find the report channel.").then(m => m.delete(5000));

                var embed = new RichEmbed()
                .setColor("#FF0000")
                .setTimestamp()
                .setFooter(bot.user.username+" "+ message.guild.name, bot.user.displayAvatarURL)
                .setAuthor("Reported Member", rMember.user.displayAvatarURL)
                .setDescription(stripIndents`**-> Member:** ${rMember} (${rMember.id})
                **-> Reported by:** ${message.member} (${message.member.id})
                **-> Reported in:** ${message.channel}
                **-> Reason:** ${args.slice(1).join(" ")}`);
                channel.send(embed)
    }
}