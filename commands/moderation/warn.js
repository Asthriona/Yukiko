var discord = require('discord.js');
var superagent = require('superagent');
var ms = require('ms');
var fs = require('fs');
let warns = JSON.parse(fs.readFileSync("./warn.json", "utf8"));

module.exports.run = async (bot, message, args) => {
    if(message.member.hasPermission('BAN_MEMBERS', false, false)){
        let wUser  = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        //if(message.member.hasPermission('KICK_MEMBERS', false, false)) return message.reply("Error 10-2kool Désoler, cet Utilisateur est bien trop cool pour etre warn :woopsEZ:");
        if(!wUser) return message.reply("g pa trrouvé :/");
        let reason = args.join(" ").slice(22);

        if(!warns[wUser.id]) warns[wUser.id] = {
            warns: 0
        };

        warns[wUser.id].warns++;
        var tamer = JSON.stringify(warns)
        fs.writeFile("./warn.json", tamer, err =>{
            if(err){console.log(err);}
        });

        let wEmbed = new discord.RichEmbed()
        .setDescription("~Warns!~")
        .setAuthor(message.author.username)
        .setColor("#800080")
        .addField("Warn user: ", `${wUser} with ID ${wUser.id}`)
        .addField("Warn by: ", `<@${message.author.id}> with ID ${message.author.id}`)
        .addField("Warn in", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason:", reason)
        .addField("Number of warn: ", warns[wUser.id].warns)

        let incidentChannel = message.guild.channels.find('name', "incident");
        if(!incidentChannel) return message.channel.send("Oops Erreur 10-Chanf :/ <@186195458182479874> ");
        incidentChannel.send(wEmbed)

        if(warns[wUser.id].warns == 2){
            //10m mute
            let muterole = message.guild.roles.find('name', 'muted');
            if(!muterole) return message.reply("Error 10-MrNf: Mute Role dosent exist <@186195458182479874>");

            let mutetime = "10m"
            await(wUser.addRole(muterole.id));
            message.channel.send(`${wUser} Has been muted for ${mutetime} (Too many warns).`);
            setTimeout(function(){
                wUser.removeRole(muterole.id);
                message.channel.send(`<@${wUser.id}> a etait démute.`);
            },ms(mutetime));
        }

        if(warns[wUser.id].warns == 4){
            //2h mute
            let muterole = message.guild.roles.find('name', 'muted');
            if(!muterole) return message.reply("Error 10-MrNf: Mute Role dosent exist <@186195458182479874>");

            let mutetime = "2h"
            await(wUser.addRole(muterole.id));
            message.channel.send(`${wUser} Has been muted for ${mutetime} (Too many warns).`);
            setTimeout(function(){
                wUser.removeRole(muterole.id);
                message.channel.send(`<@${wUser.id}> a etait démute.`);
            },ms(mutetime));
        }

        if(warns[wUser.id].warns == 6){
            //1d mute
            let muterole = message.guild.roles.find('name', 'muted');
            if(!muterole) return message.reply("Error 10-MrNf: Mute Role dosent exist <@186195458182479874>");

            let mutetime = "1d"
            await(wUser.addRole(muterole.id));
            message.channel.send(`${wUser} Has been muted for ${mutetime} (Too many warns).`);
            setTimeout(function(){
                wUser.removeRole(muterole.id);
                message.channel.send(`<@${wUser.id}> a etait démute.`);
            },ms(mutetime));
        }

        if(warns[wUser.id].warns == 8){
            //1w mute
            let muterole = message.guild.roles.find('name', 'muted');
            if(!muterole) return message.reply("Error 10-MrNf: Mute Role dosent exist <@186195458182479874>");

            let mutetime = "1w"
            await(wUser.addRole(muterole.id));
            message.channel.send(`${wUser} Has been muted for ${mutetime} (Too many warns).`);
            setTimeout(function(){
                wUser.removeRole(muterole.id);
                message.channel.send(`<@${wUser.id}> a etait démute.`);
            },ms(mutetime));
        }

        if(warns[wUser.id].warns == 10){
            //Kick
        message.guild.member(wUser).kick(`${reason} -> Too Many Warns...`)
        message.channel.send(`${wUser} Has been kicked. (Too many wans.)`)
        }

    }else return message.reply("Oy! Tu warn pas les gens comme ça toi! si non c'est moi qui te warn! D:<");
}

module.exports.help = {
    name: "warn",
    description: 'for later ...'
}