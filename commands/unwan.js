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

        warns[wUser.id].warns--;
        var tamer = JSON.stringify(warns)
        fs.writeFile("./warn.json", tamer, err =>{
            if(err){console.log(err);}
        });
        message.reply("Warn has been removed. Now:" + warns[wUser.id].warns)

}
}

module.exports.help = {
    name: "unwarn",
    description: 'for later ...'
}