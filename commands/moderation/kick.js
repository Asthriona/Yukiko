var { RichEmbed } = require("discord.js");
var { stripIndents } = require("common-tags");
var { promptMessage } = require("../../function")
module.exports = {
    name: "kick",
    category: "moderation",
    description: "Kick a user that break the law!",
    usage: "<mention | id >",
    run: async (bot, message, args) => {
        var logChannel = message.guild.channels.find(c => c.name === "incident") || message.channel;
        if(!args[0]){
            return message.reply(" ❌ You forgot to tell me wich user you want to kick.")
        }
        if(!args[1]){
            return message.reply(" ❌ Please provide a reason to kick someone.")
        }
        if(!message.member.hasPermission("KICK_MEMBERS")){
            return message.reply(" ❌ You don't have the permission to kick somebody. Please use a!report.")
        }
        if(!message.guild.me.hasPermission("KICK_MEMBERS")){
            return message.reply(" ❌ I don't have to permissions to Kick.")
        }

        var toKick = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!toKick){
            return message.reply(" ❌ Cannot find that user :/")
        }
        if(toKick.id === "186195458182479874"){
            return message.reply(" ❌ Dont you dare kick my dad?! D:<")
        }
        if(message.author.id === toKick.id) {
            return message.reply(" ❌ You can't kick yourself you smart ass... 🤷‍♀️🤷‍♂️");
        }
        if(bot.user.id === toKick.id){
            return message.reply(" ❌ Dont you dare try to kick me?!")
        }
        if(!toKick.kickable){
            return message.reply("You can't kick this user because he/she is better than u **:)**")
        }

        var embed = new RichEmbed()
        .setColor("#FF0000")
        .setThumbnail(toKick.user.displayAvatarURL)
        .setFooter(bot.user.username, bot.user.displayAvatarURL)
        .setTimestamp()
        .setDescription(stripIndents`**=> Kicked Member:** ${toKick} (${toKick.id})
        ***=> Kicked by:*** ${message.author} (${message.author.id})
        ***=> Reason:*** ${args.slice(1).join(" ")}`, true)

        var promptEmbed = new RichEmbed()
        .setColor("GREEN")
        .setAuthor("This verification becomes invalid after 30s.")
        .setDescription(`Do you want to kick ${toKick}?`)
        .setTimestamp()

        var publicEmbed = new RichEmbed()
        .setColor("PURLPLE")
        .setAuthor(bot.user.username, bot.user.displayAvatarURL)
        .setDescription(`${toKick} Just got kicked by ${message.author}!`)
        .setImage("https://cdn.asthriona.com/kick.gif")
        .setTimestamp()
        .setFooter("Kick Sponsored by Asthriona LLC!", bot.user.displayAvatarURL)

        await message.channel.send(promptEmbed).then(async msg =>{
            var emoji = await promptMessage(msg, message.author, 30, ["✔️", "❌"]);
            if(emoji === "✔️"){
                msg.delete();
                logChannel.send(embed)
                message.channel.send(publicEmbed)
                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if(err) return message.channel.send("Error: \n ```"+err+"```")
                    });
            }else if (emoji === "❌"){
                msg.delete()
                message.reply(`Kick cancelled. \n You got lucky this time ${toKick}!`)
            }
        })
    }
}