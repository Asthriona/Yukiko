var discord = require("discord.js");
var mongoose = require("mongoose");
var botConfig = require('../botconfig.json');

mongoose.connect(botConfig.dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Users = require('../model/xp.js')

module.exports.run = async (bot, message, args) => {
    if(message.author.id != "186195458182479874") return message.channel.send("You cant change other ppl lvl!")
    let lvlUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!lvlUser) return message.channel.send("Utilisateur Introvable D:");
    Users.findOne({
        did: lvlUser.id,
        serverID: message.guild.id
    }, async (err, users) => {
        if (err) console.log(err);
        users.level = users.level =+ args[1];
        users.xp = users.xp =+ args[1] * Math.pow(2, users.level);
        users.save().catch(error => console.log(error));
        console.log(args[1])
        message.reply("<@"+lvlUser.id+"> level's setted to " + users.level)
    });
}

module.exports.help = {
    name: "setlvl",
    description: "Change User levels"
}