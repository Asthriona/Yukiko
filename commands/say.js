var discord = require("discord.js");


module.exports.run = async (bot, message, args) => {
    //say
    console.log(`${message.author.username} used !say`)
    if(message.author.id === "186195458182479874"){ 
    let botmessage = args.join(" ");
    message.delete().catch();
    console.log(`${message.author.username} -> ${botmessage}`)
    message.channel.send(botmessage);
}else{
    return message.reply("Oy! t'as pas le droit de me dire ce que je doit dire! :'c");
}
}

module.exports.help = {
    name: "say",
    description: "THE WALL SAID SOMETHING! YOU BETTER LISTEN!"
}