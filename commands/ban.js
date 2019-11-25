var discord = require('discord.js');
var superagent = require('superagent');

let p = "a!"
let bicon = 

module.exports.run = async (bot, message, args) => {
    let kUser  = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Utilisateur Introvable D:");
    let kReason = args.join(" ").slice(22);
    if(kUser.hasPermission('BAN_MEMBERS', false, false)) return message.channel.send("Tu peut pas On peut pas ban les Master!")
    if(message.member.hasPermission('BAN_MEMBERS', false, false)){

    let embed = new discord.RichEmbed()
    .setDescription("~Ban!~")
    .setColor("#800080")
    .addField("Ban user: ", `${kUser} with ID ${kUser.id}`)
    .addField("Ban by: ", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Ban in", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason:", kReason)

    let incidentChannel = message.guild.channels.find('name', "incident");
    if(!incidentChannel) return message.channel.send("Oops Erreur 10-ban :/ <@186195458182479874> ");

    let publicKick = new discord.RichEmbed()
    .setDescription(`${kUser} got banned! for **${kReason}***`)
    .setImage("https://media.giphy.com/media/xUO4t2gkWBxDi/giphy.gif")
    message.channel.send(publicKick)
    incidentChannel.send(embed)
    message.guild.member(kUser).ban(kReason);


}else{ return message.channel.send("hé! Ta pas le droit de ban des gens toi!");
};
}

module.exports.help = {
    name: "ban",
    description: 'for later ...'
}