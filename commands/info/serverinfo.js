var { RichEmbed } = require("discord.js");
module.exports = {
    name: "server",
    aliases: ["server-info", "serverinfo"],
    category: "info",
    description: "Return server infos.",
    run: async (bot, message, args) => {
        message.channel.startTyping()
        let sicon = message.guild.iconURL;
        let serverembed = new RichEmbed()
        .setDescription("Server Information")
        .setColor("#800080")
        .setThumbnail(sicon)
        .addField("Server name", message.guild.name)
        .addField("Created at", message.guild.createdAt)
        .addField("Joined at: ", message.member.joinedAt)
        .addField("Owner: ", message.guild.owner)
        .addField("Total members: ", message.guild.memberCount)
        .addField("Region: ", message.guild.region)
        message.channel.stopTyping();
        return message.channel.send(serverembed);
    }
}