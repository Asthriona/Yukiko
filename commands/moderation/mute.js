var { RichEmbed } = require("discord.js");
var { stripIndents } = require("common-tags");
var { promptMessage } = require("../../function");
var ms = require("ms")

module.exports = {
    name: "mute",
    category: "Moderation",
    description: "Create a new role!",
    usage: "!mute <@mention> <time> <reason>",
    run: async (bot, message, args) => {
        let tomute = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!tomute) return message.reply("Erreur 10-Mun-f. Merci de spécifier un utilisateur.")
        if (!message.member.hasPermission('KICK_MEMBERS', false, false)) {
            let muterole = message.guild.roles.find('name', "muted");
            //Create muted roll and overwrite permissions
            if (!muterole) {
                try {
                    muterole = await message.guild.createRole({
                        name: "muted",
                        color: "#070505",
                        permissions: []
                    })
                    message.guild.channels.forEach(async (channel, id) => {
                        await channel.overwritePermission(muterole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        });
                    });
                } catch (e) {
                    console.log(e.stack)
                }
            }
            //Donezo role creation LOL x) xDDDDDDD JPP DE MWA MDR!
            let mutetime = args[1];
            if (!mutetime) return message.reply("Error: 10-MtU Merci de definire un temps de mute.");
            let muteReason = args.slice(2).join(" ")
            if (!muteReason) muteReason = "Parce que les admins sont méchant!"
            //if(muteReason == "Raison Personel") return ("Error: 10-Ta pas mieux?")

            let iEmbed = new RichEmbed()
                .setDescription("~Mute!~")
                .setColor("#800080")
                .addField("muted user: ", `${tomute} with ID ${tomute.id}`)
                .addField("muted by: ", `<@${message.author.id}> with ID ${message.author.id}`)
                .addField("muted in", message.channel)
                .addField("Time", message.createdAt)
                .addField("Reason:", muteReason)
                .addField("Time: ", mutetime)
            let incidentChannel = message.guild.channels.find('name', "incident");
            if (!incidentChannel) return message.channel.send("Oops Erreur 10-Kick :/ <@186195458182479874> ");
            incidentChannel.send(iEmbed)

            await (tomute.addRole(muterole.id));
            message.reply(`<@${tomute.id}> à etait muter pendent ${mutetime} pour ${muteReason}`)
            setTimeout(function () {
                tomute.removeRole(muterole.id);
                message.channel.send(`<@${tomute.id}> a etait démute.`);
            }, ms(mutetime));
        } else { return message.reply("Oy!  qui t'as dit que tu pouvais mute les gens toi?! D:<") }
    }
}