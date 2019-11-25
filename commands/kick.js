var discord = require('discord.js');
var superagent = require('superagent');

let p = "a!"
let bicon = 

module.exports.run = async (bot, message, args) => {
    let kUser  = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Utilisateur Introvable D:");
    let kReason = args.join(" ").slice(22);
    if(!kReason) return message.reply("Hey! Ta oublier la raison! :O")
    if(kUser.hasPermission('KICK_MEMBERS', false, false)) return message.channel.send("On peut pas kicker le Master!")
    if(message.member.hasPermission('KICK_MEMBERS', false, false)){

    let embed = new discord.RichEmbed()
    .setDescription("~Kick!~")
    .setColor("#800080")
    .addField("kicked user: ", `${kUser} with ID ${kUser.id}`)
    .addField("Kicked by: ", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Kicked in", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason:", kReason)

    let incidentChannel = message.guild.channels.find('name', "incident");
    if(!incidentChannel) return message.channel.send("Oops Erreur 10-Kicknf :/ <@186195458182479874> ");
    
    let bicon = bot.user.displayAvatarURL;
    let publicKick = new discord.RichEmbed()
    .setDescription(`${kUser} got 10-Ricco'd! for **${kReason}***`)
    .setImage("https://cdn.asthriona.com/kick.gif")
    .setFooter("Kick Sponsored by Asthriona LLC!" , `${bicon}`, "https://Asthriona.Com")
    message.channel.send(publicKick)
    incidentChannel.send(embed)
    message.guild.member(kUser).kick(`${kReason} ${message.author}`);


}else{ return message.channel.send("Oy! Ta pas le droit de 10-ricco des gens toi!");
};
}

module.exports.help = {
    name: "kick",
    description: 'for later ...'
}