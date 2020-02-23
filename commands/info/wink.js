var superagent = require("superagent");
var { RichEmbed } = require("discord.js");
module.exports = {
    name: "wink",
    category: "info",
    description: "send a Winky face!",
    run: async (bot, message, args) => {
        let {body} = await superagent
        .get(`https://some-random-api.ml/animu/wink`);
        let winkembed = new RichEmbed()
        .setColor("#800080")
        .setTitle("winky Face! ;)")
        .setImage(body.link);
    
        message.channel.send(winkembed)
    }
}