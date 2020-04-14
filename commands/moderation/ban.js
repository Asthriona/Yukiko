var { RichEmbed } = require("discord.js");
var { stripIndents } = require("common-tags");
var { promptMessage } = require("../../function")
var { botConfig } = require("../../botconfig.json")
module.exports = {
    name: "ban",
    category: "moderation",
    description: "Ban a user that break the law!",
    usage: "<mention | id >",
    run: async (bot, message, args) => {
        var logChannel = message.guild.channels.find(c => c.name === "incident") || message.channel;
        if(!args[0]){
            return message.reply(" ❌ You forgot to tell me wich user you want to ban.")
        }
        if(!args[1]){
            return message.reply(" ❌ Please provide a reason to ban someone.")
        }
        if(!message.member.hasPermission("BAN_MEMBERS")){
            return message.reply(" ❌ You don't have the permission to ban somebody. Please use a!report.")
        }
        if(!message.guild.me.hasPermission("BAN_MEMBERS")){
            return message.reply(" ❌ I don't have to permissions to ban.")
        }

        var toban = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!toban){
            return message.reply(" ❌ Cannot find that user :/")
        }
        if(toban.id === "186195458182479874"){
            return message.reply(" ❌ Dont you dare ban my dad?! D:<")
        }
        if(toban.id === "635422418424299521"){
            return message.reply(" ❌ Dont you dare ban my mum?! D:<")
        }
        if(message.author.id === toban.id) {
            return message.reply(" ❌ You can't ban yourself you smart ass... 🤷‍♀️🤷‍♂️");
        }
        if(bot.user.id === toban.id){
            return message.reply(" ❌ Dont you dare try to ban me?!")
        }
        if(!toban.bannable){
            return message.reply("You can't ban this user because he/she is better than u **:)**")
        }

        var embed = new RichEmbed()
        .setAuthor("~Ban!~")
        .setColor("#FF0000")
        .setThumbnail(toban.user.displayAvatarURL)
        .setFooter(bot.user.username, bot.user.displayAvatarURL)
        .setTimestamp()
        .setDescription(stripIndents`**=> baned Member:** ${toban} (${toban.id})
        ***=> baned by:*** ${message.author} (${message.author.id})
        ***=> Reason:*** ${args.slice(1).join(" ")}`, true)

        var promptEmbed = new RichEmbed()
        .setColor("GREEN")
        .setAuthor("This verification becomes invalid after 30s.")
        .setDescription(`Do you want to ban ${toban}?`)
        .setTimestamp()

        var publicEmbed = new RichEmbed()
        .setColor("PURLPLE")
        .setAuthor(bot.user.username, bot.user.displayAvatarURL)
        .setDescription(`${toban} Just got baned by ${message.author}!`)
        .setImage("https://media.giphy.com/media/xUO4t2gkWBxDi/giphy.gif")
        .setTimestamp()
        .setFooter("Ban Sponsored by Asthriona LLC!", bot.user.displayAvatarURL)

        await message.channel.send(promptEmbed).then(async msg =>{
            var emoji = await promptMessage(msg, message.author, 30, ["✔️", "❌"]);
            if(emoji === "✔️"){
                msg.delete();
                logChannel.send(embed)
                message.channel.send(publicEmbed)
                toban.ban(args.slice(1).join(" ")+" by " + message.author.username)
                    .catch(err => {
                        if(err) return message.channel.send("Error: \n ```"+err+"```")
                    });
            }else if (emoji === "❌"){
                msg.delete()
                message.reply(`ban cancelled. \n You got lucky this time ${toban}!`)
            }
        })
    }
} 