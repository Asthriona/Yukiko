var discord = require("discord.js");
var superagent = require("superagent");

module.exports.run = async (bot, message, args) => {
    //wink
    let {body} = await superagent
    .get(`https://some-random-api.ml/animu/wink`);
    let winkembed = new discord.RichEmbed()
    .setColor("#800080")
    .setTitle("winky Face! ;)")
    .setImage(body.link);

    message.channel.send(winkembed)
    console.log(`${message.author.username} used !wink`)
}

module.exports.help = {
    name: "wink",
    description: "WINKY FACE! ;D"
}
