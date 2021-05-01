var superagent = require("superagent");
var { MessageEmbed } = require("discord.js");

module.exports = {
    name: "reddit",
    category: "info",
    description: "Send an image from a sub reddit!",
    usage: "$reddit [sub-reddit]",
    run: async (bot, message, args) => {
        let {body} = await superagent
        .get(`https://www.reddit.com/r/${args}.json?sort=top&t=week`)
        .query({limit: 800});

        var allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if(!allowed.length) return message.reply("We are running out of dank meme. 😂😂😂")
        var randomNumber = Math.floor(Math.random() * allowed.length)
        var embed = new MessageEmbed()
        .setColor("PURPLE")
        .setTitle(allowed[randomNumber].data.title)
        .setDescription(allowed[randomNumber].data.author)
        .setImage(allowed[randomNumber].data.url)
        .addField('Information: ', "Up vote:" + allowed[randomNumber].data.ups + " / Comment: " + allowed[randomNumber].data.num_comments)
        .setURL("https://reddit.com" + allowed[randomNumber].data.permalink)
        .setTimestamp()
        .setFooter(bot.user.username, bot.user.displayAvatarURL());
        return message.channel.send(embed)
    }
}